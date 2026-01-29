import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import beautify from 'js-beautify';

function resolveJSPath(filePath) {
  const fullPath = path.resolve(filePath);

  if (fs.existsSync(fullPath)) return fullPath;
  if (fs.existsSync(fullPath + '.js')) return fullPath + '.js';
  if (fs.existsSync(path.join(fullPath, 'index.js'))) return path.join(fullPath, 'index.js');

  throw new Error(`Cannot resolve JS file: ${filePath}`);
}

function inlineJS(filePath, alreadyProcessed = new Set()) {
  const fullPath = resolveJSPath(filePath);

  if (alreadyProcessed.has(fullPath)) return '';
  alreadyProcessed.add(fullPath);

  let js = fs.readFileSync(fullPath, 'utf-8');

  js = js.replace(/import\s+(?:.*?\s+from\s+)?['"](.+?)['"];?/g, (_, importPath) => {
    const importedFile = path.resolve(path.dirname(fullPath), importPath);
    return inlineJS(importedFile, alreadyProcessed);
  });

  js = js.replace(/export\s*\{[^}]*\};?/g, '');
  js = js.replace(/\b(const|let|var)\s+(NAVIGATION_DATA_PATH|CONTENT_DATA_PATH|NAVIGATION_DATA|CONTENT_DATA)\s*=[^;]+;/g, '');
  js = js.replace(/const\s*\[\s*NAVIGATION_DATA\s*,\s*CONTENT_DATA\s*,/g, 'const [');
  js = js.replace(/readJSON\(NAVIGATION_DATA_PATH\)\s*,\s*readJSON\(CONTENT_DATA_PATH\)\s*,?/g, '');
  return js + '\n';
}


function inlineCSS(filePath, alreadyProcessed = new Set()) {
  const fullPath = path.resolve(filePath);
  if (alreadyProcessed.has(fullPath)) return '';
  alreadyProcessed.add(fullPath);

  let css = fs.readFileSync(fullPath, 'utf-8');
  return css.replace(/@import\s+['"](.+?)['"];?/g, (_, importPath) => {
    const importedFile = path.resolve(path.dirname(fullPath), importPath);
    return inlineCSS(importedFile, alreadyProcessed);
  });
}

function fileToBase64(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return null;
  const ext = path.extname(fullPath).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const buffer = fs.readFileSync(fullPath);
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

async function saveStaticFromRunningServer() {
  const url = 'http://localhost:5500/';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });

  const links = await page.evaluate(() =>
    Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).map(l => l.getAttribute('href'))
  );

  let combinedCSS = '';
  for (const href of links) {
    const filePath = path.resolve('./', href);
    combinedCSS += inlineCSS(filePath) + '\n';
  }

  const staticScriptPath = path.resolve('./script/static-index.js');
  let combinedJS = inlineJS(staticScriptPath);
  
  const staticHTML = await page.evaluate(
    (css, js) => {
      const head = document.head.cloneNode(true);
      const body = document.body.cloneNode(true);

      head.querySelectorAll('link[rel="stylesheet"], style').forEach(el => el.remove());
      body.querySelectorAll('script, style').forEach(el => el.remove());

      
      const style = document.createElement('style');
      style.textContent = css;
      head.appendChild(style);

      
      const script = document.createElement('script');
      script.textContent = `
        history.scrollRestoration = "manual";
        document.body.style.display = "none";
        (async () => {
          ${js}
        })()
      `;
      script.setAttribute('type', 'module');
      body.appendChild(script);

      return { headHTML: head.innerHTML, bodyHTML: body.innerHTML };
    },
    combinedCSS,
    combinedJS
  );

  let { headHTML, bodyHTML } = staticHTML;

  
  
  bodyHTML = bodyHTML.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
    if (src.startsWith('data:')) return match; 
    const base64 = fileToBase64(path.join('./', src));
    if (!base64) return match;
    return match.replace(src, base64);
  });

  
  headHTML = headHTML.replace(/<link\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, (match, href) => {
    if (!/rel="icon"|rel="shortcut icon"/.test(match)) return match;
    if (href.startsWith('data:')) return match;
    const base64 = fileToBase64(path.join('./', href));
    if (!base64) return match;
    return match.replace(href, base64);
  });

  const formattedHTML = beautify.html(
    '<!DOCTYPE html>\n<html lang="ru">\n<head>' +
      headHTML +
      '</head>\n<body>' +
      bodyHTML +
      '</body>\n</html>',
    { indent_size: 2 }
  );

  fs.mkdirSync('./dist', { recursive: true });
  fs.writeFileSync('./dist/index.html', formattedHTML, 'utf-8');

  console.log('Static page saved to dist/index.html');
  await browser.close();
}

saveStaticFromRunningServer().catch(console.error);

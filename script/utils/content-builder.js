import { BASE_PATH } from "../variables-constants.js";

function contentBuilder(node) {
  if (typeof node === "string") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(contentBuilder).join("");
  }

  if (node && typeof node === "object") {
    return Object.entries(node)
      .map(([tag, value]) => {
        const { tagName, id, classes, attributes } = parseTag(tag);

        if (tagName === "table") {
          return renderTable(value);
        }

        if (tagName === "script") {
          return renderScript(id, classes, attributes, value);
				}

				if (tagName === "a") {
					attributes.map(([key, val]) => {
						if (key === 'href') {
							attributes[0][1] = BASE_PATH + val;
						}
					})
				}

        const inner = contentBuilder(value);
        const idAttr = id ? ` id="${id}"` : "";
        const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
        const attrsStr = attributes.length
          ? " " +
            attributes
              .map(([key, val]) => (val ? `${key}="${val}"` : key))
              .join(" ")
          : "";

        return `<${tagName}${idAttr}${classAttr}${attrsStr}>${inner}</${tagName}>`;
      })
      .join("");
  }

  return "";
}

function parseTag(tag) {
  const attributes = [];
  const attrRegex = /\[([^\]=]+)(?:=([^\]]+))?\]/g;
  let match;
  while ((match = attrRegex.exec(tag)) !== null) {
    const key = match[1].trim();
    const value = match[2] ? match[2].trim() : null;
    attributes.push([key, value]);
  }

  const tagWithoutAttrs = tag.replace(attrRegex, "");

  let tagName = "div";
  let id = "";
  const classes = [];

  const firstSpecial = tagWithoutAttrs.search(/[#.]/);
  if (firstSpecial === -1) {
    tagName = tagWithoutAttrs || "div";
  } else {
    tagName = tagWithoutAttrs.slice(0, firstSpecial) || "div";
    const rest = tagWithoutAttrs.slice(firstSpecial);
    const regex = /([#.])([^#.]+)/g;
    let m;
    while ((m = regex.exec(rest)) !== null) {
      if (m[1] === "#") id = m[2];
      else if (m[1] === ".") classes.push(m[2]);
    }
  }

  return { tagName, id, classes, attributes };
}

function renderTable(table) {
  const thead = table.headers
    ? `
			<thead>
				<tr>
					${table.headers.map((h) => `<th>${h}</th>`).join("")}
				</tr>
			</thead>
		`
    : "";

  const tbody = table.rows
    ? `
			<tbody>
				${table.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
          )
          .join("")}
			</tbody>
		`
    : "";

  return `
		<table>
			${thead}
			${tbody}
		</table>
	`;
}

function renderScript(id, classes, attributes, content) {
  const placeholderId = `script-placeholder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const placeholder = `<div id="${placeholderId}" style="display:none;"></div>`;

  setTimeout(() => {
    const placeholderElement = document.getElementById(placeholderId);
    if (!placeholderElement) return;

    const script = document.createElement("script");

    if (id) script.id = id;
    if (classes.length) script.className = classes.join(" ");

    attributes.forEach(([key, val]) => {
      if (val) {
        script.setAttribute(key, val);
      } else {
        script.setAttribute(key, "");
      }
    });

    if (content && typeof content === "string") {
      script.textContent = content;
    }

    placeholderElement.replaceWith(script);
  }, 0);

  return placeholder;
}

export { contentBuilder, renderTable };

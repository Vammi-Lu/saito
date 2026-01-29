import './bmi-calculator.js';

async function syncInitialHash() {
	if (!location.hash) return;

	const id = location.hash.slice(1);
	const el = document.getElementById(id);

	if (!el || el.tagName !== "SECTION") return;


	location.hash = "";
	location.hash = "#" + id;
}

async function addHashClickEvent() {
  document.addEventListener("click", async e => {
		const a = e.target.closest("a");
		if (!a || !a.hash) return;
  
    const id = a.hash.slice(1);
		const el = document.getElementById(id);

		if (id === 'logout') return logout();
		
    if (!el || el.tagName !== "SECTION") return;
  
  
    e.preventDefault();
    const x = scrollX;
    const y = scrollY;
  
    location.hash = a.hash;
    requestAnimationFrame(() => scrollTo(x, y));
  }, true);
}

async function triggerPageHandle() {
	await syncInitialHash();
	await addHashClickEvent();
}

await triggerPageHandle();

setTimeout(() => {
	document.body.style.display = "";
}, 200);
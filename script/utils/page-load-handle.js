import { CURRENT_USER, BASE_PATH } from "../variables-constants.js";
import { logout } from "../accounts/logout.js";

async function redirectIfNoUser(sectionId) {
  if (sectionId === 'profile' && !CURRENT_USER) {
    window.location.href = `${BASE_PATH}#login`;
    return true;
  }
  return false;
}

async function syncInitialHash() {
	if (!location.hash) return;

	const id = location.hash.slice(1);
	const el = document.getElementById(id);

	if (id === 'logout') return logout();

	if (!el || el.tagName !== "SECTION") return;

	if (await redirectIfNoUser(id)) return;

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
  
    if (await redirectIfNoUser(id)) return;
  
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

export { triggerPageHandle };
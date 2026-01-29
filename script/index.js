import { makeHeader } from "./components/header.js";
import { makeMain } from "./components/main.js";
import { makeFooter } from "./components/footer.js";
import { triggerPageHandle } from "./utils/page-load-handle.js";


history.scrollRestoration = "manual";
document.body.style.display = "none";

const appInit = (async () => {
	const scriptInitiator = document.getElementById("script-initiator");
	const documentBody = document.querySelector("body");

	const header = await makeHeader();
	const main = await makeMain();
	const footer = await makeFooter();
	
	for (const element of [header, main, footer]) {
		documentBody.insertBefore(element, scriptInitiator);
	}
})();

appInit.then(async () => {
	await triggerPageHandle();
	document.body.style.display = "";
});
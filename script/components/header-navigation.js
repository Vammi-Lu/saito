import { NAVIGATION_DATA, LOGGED_IN, CURRENT_USER } from "../variables-constants.js";
import { replaceVariableInText } from "../accounts/login-utils.js";

async function makeHeaderNavigation(variant = "default") {
  const markup = document.createElement("nav");
  markup.classList.add("header-navigation");

	const menu = await buildNavMenu(NAVIGATION_DATA[variant], NAVIGATION_DATA["logonStatus"][LOGGED_IN ? "loggedIn" : "loggedOut"]);
	if (LOGGED_IN) {
		replaceVariableInText(menu, CURRENT_USER);
	}
	
  markup.appendChild(menu);
  
  return markup;
}

async function buildNavMenu(items, lastItems = []) {
  const ul = document.createElement("ul");
  ul.classList.add("header-navigation__list");

	for (const itemsArray of [items, lastItems]) {
		for (const item of itemsArray) {
			const li = document.createElement("li");
			li.classList.add("header-navigation__item");

			if (item.style) {
				li.setAttribute("style", item.style);
			}

			if (item.url) {
				const a = document.createElement("a");
				a.classList.add("header-navigation__link");
				a.textContent = item.label;
				a.href = item.url;

				if (item.attributes) {
					for (const [key, value] of Object.entries(item.attributes)) {
						a.setAttribute(key, value);
					}
				}

				li.appendChild(a);
			} else {
				li.classList.add("list-dropdown");

				const span = document.createElement("span");
				span.classList.add("header-navigation__sub-title");
				span.textContent = item.label;
				li.appendChild(span);
			}

			if (Array.isArray(item.childs)) {
				li.appendChild(await buildNavMenu(item.childs));
			}

			ul.appendChild(li);
		}
	}

  return ul;
}

export { makeHeaderNavigation };
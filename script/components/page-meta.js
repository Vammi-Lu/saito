import { readJSON } from '../utils/json.js';
import { META_DATA } from "../variables-constants.js";

class PageMeta extends HTMLElement {
	connectedCallback() {
		const elements = [
      { tag: "title", content: META_DATA["Заголовок"] },
      { tag: "meta", attributes: { name: "description", content: META_DATA["Мета"]["Описание"] } },
      { tag: "link", attributes: { rel: "icon", href: "./images/svg/logo.svg" } },
      { tag: "link", attributes: { rel: "stylesheet", href: "./style/index.css" } },
    ];

		for (const elementData of elements) {
			const element = document.createElement(elementData.tag);

			if (elementData.content) {
				element.textContent = elementData.content;
			}

			if (elementData.attributes) {
				for (const [key, value] of Object.entries(elementData.attributes)) {
					element.setAttribute(key, value);
				}
			}

			document.head.appendChild(element);
		}
		
		this.remove();
	}
}

customElements.define('page-meta', PageMeta);
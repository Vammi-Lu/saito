
import { META_DATA } from "../variables-constants.js";

class PageHeader extends HTMLElement {
	connectedCallback() {
		const markup = document.createElement("header");

		markup.innerHTML = /*html*/ `
			<h1>${META_DATA["Заголовок"]}</h1>
			<page-header-navigation></page-header-navigation>
		`;

		this.replaceWith(markup);
	}
}

customElements.define('page-header', PageHeader);
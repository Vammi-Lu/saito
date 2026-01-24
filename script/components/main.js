import { META_DATA } from "../variables-constants.js";

class PageContent extends HTMLElement {
  connectedCallback() {
    const markup = document.createElement("main");
    markup.classList.add("page-content");

    markup.innerHTML = /*html*/ `
			Это основной контент
		`;

    this.replaceWith(markup);
  }
}

customElements.define("page-content", PageContent);

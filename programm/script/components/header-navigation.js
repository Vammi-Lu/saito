import { META_DATA } from "../variables-constants.js";

class PageHeaderNav extends HTMLElement {
  connectedCallback() {
    const markup = document.createElement("nav");

    markup.innerHTML = /*html*/ `
			<a href="test">test</a>
		`;

    this.replaceWith(markup);
  }
}

customElements.define("page-header-navigation", PageHeaderNav);

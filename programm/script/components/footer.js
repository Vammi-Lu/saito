class PageFooter extends HTMLElement {
	connectedCallback() {
		const markup = document.createElement("footer");

    markup.innerHTML = /*html*/ `
			Это подвал сайта
		`;

    this.replaceWith(markup);
	}
}

customElements.define("page-footer", PageFooter);
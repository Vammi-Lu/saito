
import { META_DATA } from "../variables-constants.js";

class PageHeader extends HTMLElement {
	connectedCallback() {
		const markup = document.createElement("header");
		markup.classList.add("page-header");

		markup.innerHTML = /*html*/ `
			<div class="page-header__content-wrapper">
				<div class="page-header__logo">
					<div class="page-header__logo__image-wrapper">
						<img class="page-header__logo__image" src="images/svg/logo.svg" alt="logo">
					</div>
				</div>
				<h1 class="page-header__title">${META_DATA["Заголовок"]}</h1>
				<page-header-navigation></page-header-navigation>
			</div>
		`;

		this.replaceWith(markup);
	}
}

customElements.define('page-header', PageHeader);
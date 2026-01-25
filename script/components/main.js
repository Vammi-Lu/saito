import { CURRENT_PATH, CONTENT_DATA, CURRENT_USER } from "../variables-constants.js";
import { contentBuilder } from "../utils/content-builder.js";
import { applyTypographyToElement } from "../utils/typographer.js";
import { replaceVariableInText } from "../utils/login-utils.js";
import { proceedLoginForm } from "../login-form.js";

class PageMain extends HTMLElement {
  async connectedCallback() {
    const markup = document.createElement("main");
    markup.classList.add("page-main");

    const pageMainContent = document.createElement("div");
    pageMainContent.classList.add("page-main__content");
    pageMainContent.innerHTML = contentBuilder(CONTENT_DATA[CURRENT_PATH]["content"]);
    applyTypographyToElement(pageMainContent);

    const pageMainSidebar = document.createElement("div");
    pageMainSidebar.classList.add("page-main__sidebar");
    pageMainSidebar.innerHTML = contentBuilder(CONTENT_DATA[CURRENT_PATH]["sidebar"]);
    applyTypographyToElement(pageMainSidebar);

    markup.appendChild(pageMainContent);
    markup.appendChild(pageMainSidebar);
		
    if (CURRENT_PATH == '/login' || CURRENT_PATH == '/register') {
			const isRegister = CURRENT_PATH == '/register';
			const formElement = markup.querySelector(`.login-form`);
      
      if (formElement) {
				await proceedLoginForm(formElement, isRegister);
      }
		} else if (CURRENT_PATH == '/profile') {
			if (CURRENT_USER == null) {
				window.location.href = '/login';
			}
			replaceVariableInText(markup, CURRENT_USER);
		}
		
		this.replaceWith(markup);
  }
}

customElements.define("page-main", PageMain);
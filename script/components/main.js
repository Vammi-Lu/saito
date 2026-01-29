import { CONTENT_DATA, CURRENT_USER } from "../variables-constants.js";
import { contentBuilder } from "../utils/content-builder.js";
import { applyTypographyToElement } from "../utils/typographer.js";
import { replaceVariableInText } from "../accounts/login-utils.js";
import { proceedLoginForm } from "../accounts/login-form.js";

async function makeMain() {
  const markup = document.createElement("main");
	markup.classList.add("page-main");
	
	const CONTENT_DATA_COUNT = Object.keys(CONTENT_DATA).length;

	if (CONTENT_DATA_COUNT == 0) {
		console.error('Нет данных в CONTENT_DATA');
		return;
	}

	for (const [CONTENT_PAGE, CONTENT] of Object.entries(CONTENT_DATA)) {
		const section = document.createElement('section');
		const sectionId = CONTENT_PAGE.replace(/^#/, '');

		section.setAttribute('id', sectionId);
		section.classList.add('page-section');
		
		const pageMainContent = document.createElement("div");
		pageMainContent.classList.add("page-main__content");
		pageMainContent.innerHTML = contentBuilder(CONTENT["content"]);
		applyTypographyToElement(pageMainContent);
		
		const pageMainSidebar = document.createElement("div");
		pageMainSidebar.classList.add("page-main__sidebar");
		pageMainSidebar.innerHTML = contentBuilder(CONTENT["sidebar"]);
		applyTypographyToElement(pageMainSidebar);
		
		section.appendChild(pageMainContent);
		section.appendChild(pageMainSidebar);

		
		if (CONTENT_PAGE == 'login' || CONTENT_PAGE == 'register') {
			const isRegister = CONTENT_PAGE == 'register';
			const formElement = section.querySelector('.login-form');
			
			if (formElement) {
				await proceedLoginForm(formElement, isRegister);
			}
		} else if (CONTENT_PAGE == 'profile' && CURRENT_USER) {
			replaceVariableInText(section, CURRENT_USER);
		}
		
		markup.appendChild(section);
	}
	
	
	return markup;
}

export { makeMain };
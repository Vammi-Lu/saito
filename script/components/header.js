import { makeHeaderNavigation } from "./header-navigation.js";

async function makeHeader() {
	const title = document.querySelector("title");

	const markup = document.createElement("header");
	markup.classList.add("page-header");

	const pageHeaderContentWrapper = document.createElement("div");
	pageHeaderContentWrapper.classList.add("page-header__content-wrapper");
	
	const pageHeaderTitleWrapper = document.createElement("a");
	pageHeaderTitleWrapper.classList.add("page-header__title-wrapper");
	pageHeaderTitleWrapper.href = "";

	const pageHeaderLogo = document.createElement("div");
	pageHeaderLogo.classList.add("page-header__logo");

	const pageHeaderLogoImageWrapper = document.createElement("div");
	pageHeaderLogoImageWrapper.classList.add("page-header__logo__image-wrapper");

	const pageHeaderLogoImage = document.createElement("img");
	pageHeaderLogoImage.classList.add("page-header__logo__image");
	pageHeaderLogoImage.src = "./favicon.svg";
	pageHeaderLogoImage.alt = "logo";

	pageHeaderLogoImageWrapper.appendChild(pageHeaderLogoImage);
	pageHeaderLogo.appendChild(pageHeaderLogoImageWrapper);
	pageHeaderTitleWrapper.appendChild(pageHeaderLogo);

	const pageHeaderTitle = document.createElement("h1");
	pageHeaderTitle.classList.add("page-header__title");
	pageHeaderTitle.textContent = title.textContent;

	pageHeaderTitleWrapper.appendChild(pageHeaderTitle);

	pageHeaderContentWrapper.appendChild(pageHeaderTitleWrapper);
	pageHeaderContentWrapper.appendChild(await makeHeaderNavigation("default"));
	markup.appendChild(pageHeaderContentWrapper);
	
	return markup;
}


export { makeHeader };
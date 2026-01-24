import { CURRENT_PATH, CONTENT_DATA } from "../variables-constants.js";
import { contentBuilder } from "../utils/content-builder.js";
import { applyTypographyToElement } from "../utils/typographer.js";

class PageMain extends HTMLElement {
  connectedCallback() {
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

    this.replaceWith(markup);
  }
}

customElements.define("page-main", PageMain);

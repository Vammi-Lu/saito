import { CURRENT_PATH, CONTENT_DATA } from "../variables-constants.js";
import { contentBuilder } from "../utils/content-builder.js";

class PageMain extends HTMLElement {
  connectedCallback() {
    const markup = document.createElement("main");
    markup.classList.add("page-main");
    console.log(CONTENT_DATA);

    markup.innerHTML = /*html*/ `
			<div class="page-main__content">
        ${contentBuilder(CONTENT_DATA[CURRENT_PATH]["content"])}
      </div>
      <div class="page-main__sidebar">

      </div>
		`;

    this.replaceWith(markup);
  }
}

customElements.define("page-main", PageMain);

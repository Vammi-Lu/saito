import { RELATIVE_PATH, NAVIGATION_DATA } from "../variables-constants.js";

class PageHeaderNav extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute("variant") ?? "default";
    const markup = document.createElement("nav");
    const items = this.buildNavMenu(NAVIGATION_DATA[variant]);
    
    markup.classList.add("header-navigation");

    const menu = this.buildNavMenu(NAVIGATION_DATA[variant]);
    markup.appendChild(menu);
    
    this.replaceWith(markup);
  }

  buildNavMenu(items) {
    const ul = document.createElement("ul");
    ul.classList.add("header-navigation__list");

    for (const item of items) {
      const li = document.createElement("li");
      li.classList.add("header-navigation__item");

      if (item.style) {
        li.setAttribute("style", item.style);
      }

      if (item.url) {
        const a = document.createElement("a");
        a.classList.add("header-navigation__link");
        a.textContent = item.label;
				a.href = RELATIVE_PATH + item.url;

        if (item.attributes) {
          for (const [key, value] of Object.entries(item.attributes)) {
            a.setAttribute(key, value);
          }
        }

        li.appendChild(a);
      } else {
        li.classList.add("list-dropdown");

        const span = document.createElement("span");
        span.classList.add("header-navigation__sub-title");
        span.textContent = item.label;
        li.appendChild(span);
      }

      if (Array.isArray(item.childs)) {
        li.appendChild(this.buildNavMenu(item.childs));
      }

      ul.appendChild(li);
    }

    return ul;
  }
}

customElements.define("page-header-navigation", PageHeaderNav);

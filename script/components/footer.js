async function makeFooter() {
	const markup = document.createElement("footer");
	markup.classList.add("page-footer");

  markup.innerHTML = /*html*/ `
		Это подвал сайта
	`;

  return markup;
}

export { makeFooter };
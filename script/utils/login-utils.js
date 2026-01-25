function replaceVariableInText(element, variablesObject) {
	function processNode(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent;
			if (text && text.trim()) {
				node.textContent = text.replace(/\$\{(.+?)\}/g, (match, variable) => {
					const value = variablesObject[variable];
					if (value === undefined) {
						console.error(`Переменная «${variable}» не найдена для ноды:`);
						console.error(node);
					}
					return value || match;
				});
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const skipTags = ["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT"];

			if (!skipTags.includes(node.tagName)) {
				const childNodes = Array.from(node.childNodes);
				childNodes.forEach((child) => processNode(child));
			}
		}
	}

	processNode(element);
}

export { replaceVariableInText };
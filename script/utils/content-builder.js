function contentBuilder(node) {
  // строка = HTML
  if (typeof node === "string") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(contentBuilder).join("");
  }

  // объект
  if (node && typeof node === "object") {
    return Object.entries(node)
      .map(([tag, value]) => {
        if (tag === "table") {
          return renderTable(value);
        }

        const inner = contentBuilder(value);
        return `<${tag}>${inner}</${tag}>`;
      })
      .join("");
  }

  return "";
}

function renderTable(table) {
  const thead = table.headers
    ? `
			<thead>
				<tr>
					${table.headers.map((h) => `<th>${h}</th>`).join("")}
				</tr>
			</thead>
		`
    : "";

  const tbody = table.rows
    ? `
			<tbody>
				${table.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
          )
          .join("")}
			</tbody>
		`
    : "";

  return `
		<table>
			${thead}
			${tbody}
		</table>
	`;
}

export { contentBuilder, renderTable };

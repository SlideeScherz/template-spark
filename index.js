document.addEventListener("DOMContentLoaded", function () {
  const templateInput = document.getElementById("template");
  const saveButton = document.getElementById("saveButton");

  templateInput.addEventListener("input", function () {
    const templateText = templateInput.value;
    templateInput.innerHTML = templateText;
  });

  saveButton.addEventListener("click", function () {});

  document.getElementById("generate").addEventListener("click", function () {
    const template = document.getElementById("template");
    const resultText = document.getElementById("result-text");

    const formattedTemplate = formatTemplate(template.value);
    resultText.innerHTML = formattedTemplate;
  });

  function formatTemplate(templateText) {
    const table = document.getElementById("table");
    if (!table || table.tagName !== "TABLE") {
      console.error("Invalid table element or ID provided.");
    }

    const keysAndValues = {};

    // Iterate through each row of the table
    const rows = Array.from(table.querySelectorAll("tr"));
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 2) {
        const keyInput = cells[0].querySelector("input"); // Assuming first cell contains keys
        const valueInput = cells[1].querySelector("input"); // Assuming second cell contains values
        if (keyInput && valueInput) {
          const key = keyInput.value.trim();
          const value = valueInput.value.trim();
          keysAndValues[key] = value;
        }
      }
    });

    console.table(keysAndValues);

    return templateText.replace(/\[(.*?)\]/g, (match, key) => {
      const value = keysAndValues[key.trim()];
      return value ? value : match;
    });
  }
});

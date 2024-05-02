const StoreKeys = {
  TemplatePlaceholderText: "TemplatePlaceholderText",
};

// selectors
const templateInput = document.getElementById("template-input");
const generateButton = document.getElementById("generate-button");
const resultText = document.getElementById("result-text");
const table = document.getElementById("table");
const footerBottom = document.getElementById("footer-bottom");

const abortController = new AbortController();

// global object that stores the key-value pairs from the table
const fieldTable = {};

document.addEventListener("DOMContentLoaded", function () {
  verifySelectors();
  loadTemplatePlaceholderText();
  loadFooterContent();
  updateFieldTable();

  generateButton.addEventListener("mouseenter", () => {
    generateButton.style.animation = "none";
  });
});

function handleTemplateInput(element) {
  console.log("element:", JSON.stringify(element, null, 2));
  element.parentNode.dataset.replicatedValue = element.value;
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
  // highlightFields();
}

function highlightFields() {
  let formatted = templateInput.value;
  updateFieldTable();
  Object.keys(fieldTable).forEach((key) => {
    const regex = new RegExp(`\\[${key}\\]`, "gim");
    formatted = templateInput.value.replace(regex, `<mark>${key}</mark>`);
  });

  // document.getElementById("highlightedText").innerHTML = formatted;
  // templateInput.value = formatted;
  // templateInput.innerHTML = formatted;
}

function handleGeneratePress(element) {
  updateFieldTable();
  const formattedTemplate = formatTemplate(templateInput.value, fieldTable);
  resultText.innerHTML = formattedTemplate;
}

function onClearTemplateInputPress(element) {
  // console.info("Resetting element:", element);
  // templateInput.value = localStorage.getItem(StoreKeys.TemplatePlaceholderText);
  // templateInput.value = "";
  templateInput.value = templateInput.placeholder;
  resultText.innerHTML = "";
}

function updateFieldTable() {
  console.time(updateFieldTable.name);
  const rows = Array.from(table.querySelectorAll("tr"));

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 2) {
      const keyInput = cells[0].querySelector("input");
      const valueInput = cells[1].querySelector("input");
      if (keyInput && valueInput) {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        fieldTable[key] = value;
      }
    }
  });

  console.log("fieldTable (next)", JSON.stringify(fieldTable, null, 2));
  console.timeEnd(updateFieldTable.name);
}

function formatTemplate(templateText, fieldTable = {}) {
  console.time(formatTemplate.name);

  const formatted = templateText.replace(/\[(.*?)\]/gim, (match, key) => {
    return fieldTable[key.trim()] ?? match;
  });

  console.timeEnd(formatTemplate.name);
  return formatted;
}

function loadTemplatePlaceholderText() {
  console.time(loadTemplatePlaceholderText.name);

  // hacky devtool to update cache
  const REFRESH_PLACEHOLDER_TEXT = true;

  let placeholderText = localStorage.getItem(StoreKeys.TemplatePlaceholderText);

  if (placeholderText && !REFRESH_PLACEHOLDER_TEXT) {
    console.info("Placeholder text has already been fetched.");
  } else {
    fetch("public/content/template-placeholder.txt", {
      method: "GET",
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch placeholder text file.");
        }
        return response.text();
      })
      .then((text) => {
        console.info("Placeholder text fetched successfully:", text);
        localStorage.setItem(StoreKeys.TemplatePlaceholderText, text);
        placeholderText = text;
      })
      .catch((error) => {
        console.error("Error fetching placeholder text:", error.message);
      });
  }

  // dont set placeholder text if it is empty
  templateInput.value = placeholderText;
  console.timeEnd(loadTemplatePlaceholderText.name);
}

function loadFooterContent() {
  console.time(loadFooterContent.name);

  fetch("package.json", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: abortController.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch footer content file.");
      }
      return response.json();
    })
    .then((data) => {
      console.info("Package fetched successfully:", data);
      const versionText = document.createElement("p");
      versionText.innerText = `v${data.version}`;
      footerBottom.appendChild(versionText);
    })
    .catch((error) => {
      console.error("Error fetching footer content:", error.message);
    });

  console.timeEnd(loadFooterContent.name);
}

function verifySelectors() {
  if (
    !templateInput ||
    !generateButton ||
    !resultText ||
    !table ||
    !footerBottom
  ) {
    throw new Error("One or more selectors are missing.");
  }
}

/**
 * @see https://support.microsoft.com/en-us/office/file-formats-that-are-supported-in-excel-0943ff2c-6014-4e8d-aaea-b83d51d46247#:~:text=for%20backward%20compatibility.-,Excel%20file%20formats,-Format
 * @param {*} event
 */
function loadFileInputAttributes(event) {
  const excelFileInputTypes = [
    ".xlsx",
    ".xlm",
    ".xlsm",
    ".xlm",
    ".xlsb",
    ".xltx",
    ".xlm",
    ".xltm",
    ".xlm",
    ".xls",
    ".xlt",
    ".xls",
    ".xml",
    ".xml",
    ".xlam",
    ".xlm",
    ".xla",
    ".xlw",
    ".xlr",
  ];

  const acceptedFileTypes = [...excelFileInputTypes, ".txt", ".csv"];
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const warningTextarea = document.getElementById("warning-message");
const generateBtn = document.getElementById("generate-pdf");
const { jsPDF } = window.jspdf;

let selectedOptions = [];

function formatWENumber(input) {
  input.value = input.value.replace(/[^0-9\-]/g, "");
  input.value = input.value.replace(/(\d{3})(\d{3})/, "$1-$2-");
}

function formatCASNumber(input) {
  input.value = input.value.replace(/[^0-9\-]/g, "");
  input.value = input.value.replace(/(\d{4})(\d{2})(\d{1})/, "$1-$2-$3");
}

document.addEventListener("DOMContentLoaded", function () {
  const casNumInput = document.getElementById("cas-num");
  casNumInput.addEventListener("input", function () {
    formatCASNumber(casNumInput);
  });

  const weNumInput = document.getElementById("we-num");
  weNumInput.addEventListener("input", function () {
    formatWENumber(weNumInput);
  });
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    const option = checkbox.getAttribute("data-option");
    if (checkbox.checked) {
      selectedOptions.push(option);
      warningTextarea.value += `${checkbox.value}. `;
    } else {
      warningTextarea.value = warningTextarea.value.replace(
        `${checkbox.value}. `,
        ""
      );
      selectedOptions = selectedOptions.filter((opt) => opt !== option);
    }
  });
});

const imageUrls = {
  gases: "./img/compressed_gas.png",
  corrosive: "./img/corrosive.png",
  explosive: "./img/explosive.png",
  flammable: "./img/flammable.png",
  oxidizing: "./img/oxidizing.png",
  toxic: "./img/toxic.png",
  harmful: "./img/harmful.png",
  healthhazard: "./img/health_hazard.png",
  environmentalhazard: "./img/environmental_hazard.png",
};

function renderChemicalFormula(doc, x, y, formula) {
  const fontSize = 12.5;
  const subscriptSize = 6;
  const subscriptOffsetY = 1;
  let currentX = x;

  doc.setFontSize(fontSize);

  for (let i = 0; i < formula.length; i++) {
    if (formula[i] === "_") {
      const subscript = formula[i + 1];
      if (subscript) {
        doc.setFontSize(subscriptSize);
        const subscriptY = y + subscriptOffsetY;

        doc.text(currentX, subscriptY, subscript);
        currentX += (doc.getStringUnitWidth(subscript) * subscriptSize) / 3;
        i++;
        doc.setFontSize(fontSize);
      }
    } else {
      doc.text(currentX, y, formula[i]);
      currentX += (doc.getStringUnitWidth(formula[i]) * fontSize) / 3;
    }
  }
}

generateBtn.addEventListener("click", () => {
  const imgSize = 10;
  const gridSize = 3;
  let posX = 5;
  let posY = 2;
  let chemical = {
    name: document.getElementById("substance-name").value.toUpperCase(),
    formula: document.getElementById("substance-formula").value,
    mass:
      document.getElementById("substance-mass").value +
      document.getElementById("weight-unit").value,
    expirationDate: document.getElementById("date").value,
    we_num: document.getElementById("we-num").value,
    cas_num: document.getElementById("cas-num").value,
    molar_mass: document.getElementById("molar-mass").value + "g/mol",
    description: document.getElementById("description").value,
    warning: document.getElementById("warning-message").value,
  };

  const doc = new jsPDF("landscape", "mm", [210, 38]);

  selectedOptions.forEach((option, index) => {
    const imageUrl = imageUrls[option];
    if (index > 0 && index % gridSize === 0) {
      posX = 5;
      posY += imgSize + 2;
    }

    doc.addImage(imageUrl, "PNG", posX, posY, imgSize, imgSize);

    posX += imgSize + 5;
  });

  doc.setFont("helvetica", "bold");
  doc.text(50, 7, chemical.name);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12.5);
  renderChemicalFormula(doc, 50, 12, chemical.formula);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(85, 23, "Mass: " + chemical.mass);
  doc.text(85, 26, "Expiration date: " + chemical.expirationDate);
  doc.setFontSize(7);
  doc.text(50, 23, "WE number: " + chemical.we_num);
  doc.text(50, 26, "CAS number: " + chemical.cas_num);
  doc.text(50, 29, "Molar mass: " + chemical.molar_mass);
  doc.setFontSize(6);
  doc.text(140, 5, doc.splitTextToSize(chemical.description, 60));
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic", "bold");
  doc.text(140, 18, "WARNING:");
  doc.setFontSize(4);
  doc.setFont("helvetica", "normal");
  doc.text(140, 21, doc.splitTextToSize(chemical.warning, 60));
  doc.save(`${chemical.name}.pdf`);
});

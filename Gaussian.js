document.addEventListener("DOMContentLoaded", function () {
  const equationCountInput = document.getElementById("equation-count");
  const variableCountInput = document.getElementById("variable-count");
  const coefficientTableBody = document.getElementById("coefficient-table-body");
  const submitButton = document.getElementById("submit-button");
  const solutionOutput = document.getElementById("solution-output");
  const inverseOutput = document.getElementById("inverse-output");

  submitButton.addEventListener("click", function () {
    const numEquations = parseInt(equationCountInput.value);
    const numVariables = parseInt(variableCountInput.value);
    const coefficients = [];

    for (let i = 0; i < numEquations; i++) {
      const equationCoefficients = [];
      for (let j = 0; j < numVariables; j++) {
        const input = document.getElementById(`coefficient-${i}-${j}`);
        equationCoefficients.push(parseFloat(input.value));
      }
      equationCoefficients.push(parseFloat(document.getElementById(`constant-${i}`).value)); // Add constant term
      coefficients.push(equationCoefficients);
    }

    const solutions = solveEquations(coefficients);
    displaySolutions(solutions);
    const inverseMatrix = findInverse(coefficients);
    displayInverse(inverseMatrix);
  });

  equationCountInput.addEventListener("input", createCoefficientInputs);
  variableCountInput.addEventListener("input", createCoefficientInputs);

  function createCoefficientInputs() {
    const numEquations = parseInt(equationCountInput.value);
    const numVariables = parseInt(variableCountInput.value);
    coefficientTableBody.innerHTML = "";

    for (let i = 0; i < numEquations; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < numVariables; j++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.id = `coefficient-${i}-${j}`;
        input.type = "number";
        input.step = "any";
        input.value = "0"; // Set default value to 0
        cell.appendChild(input);
        row.appendChild(cell);
      }

      // Add an additional cell for the constant term
      const constantCell = document.createElement("td");
      const constantInput = document.createElement("input");
      constantInput.id = `constant-${i}`;
      constantInput.type = "number";
      constantInput.step = "any";
      constantInput.value = "0"; // Set default value to 0
      constantCell.appendChild(constantInput);
      row.appendChild(constantCell);

      coefficientTableBody.appendChild(row);
    }
  }

  function displayInverse(inverseMatrix) {
    inverseOutput.textContent = ""; // Clear previous output

    const matrixTable = document.createElement("table");
    matrixTable.id = "inverse-matrix";
    const matrixBody = document.createElement("tbody");

    for (const row of inverseMatrix) {
      const tableRow = document.createElement("tr");
      for (const cell of row) {
        const tableCell = document.createElement("td");
        tableCell.textContent = cell;
        tableRow.appendChild(tableCell);
      }
      matrixBody.appendChild(tableRow);
    }

    matrixTable.appendChild(matrixBody);
    inverseOutput.appendChild(matrixTable);
  }

  function solveEquations(coefficients) {
    const numEquations = coefficients.length;
    const numVariables = coefficients[0].length - 1;
    const solution = new Array(numVariables).fill(0);

    for (let i = 0; i < numEquations; i++) {
      if (coefficients[i][i] === 0) {
        // Swap rows if the diagonal element is 0
        for (let j = i + 1; j < numEquations; j++) {
          if (coefficients[j][i] !== 0) {
            [coefficients[i], coefficients[j]] = [coefficients[j], coefficients[i]];
            break;
          }
        }
      }

      const pivot = coefficients[i][i];
      for (let j = i + 1; j < numEquations; j++) {
        const ratio = coefficients[j][i] / pivot;
        for (let k = i; k <= numVariables; k++) {
          coefficients[j][k] -= coefficients[i][k] * ratio;
        }
      }
    }

    for (let i = numEquations - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < numEquations; j++) {
        sum += coefficients[i][j] * solution[j];
      }
      solution[i] = (coefficients[i][numVariables] - sum) / coefficients[i][i];
    }

    return solution;
  }

  function displaySolutions(solutions) {
    solutionOutput.textContent = ""; // Clear previous output

    let outputString = "";
    for (let i = 0; i < solutions.length; i++) {
      outputString += `x${i + 1} = ${solutions[i]}`;
      if (i !== solutions.length - 1) {
        outputString += ", ";
      }
    }

    solutionOutput.textContent = outputString;
  }

  function findInverse(coefficients) {
    const numEquations = coefficients.length;
    const augmentedMatrix = coefficients.map(row => [...row]);

    for (let i = 0; i < numEquations; i++) {
      for (let j = numEquations; j < 2 * numEquations; j++) {
        augmentedMatrix[i][j] = (i === j - numEquations) ? 1 : 0;
      }
    }

    for (let i = 0; i < numEquations; i++) {
      if (augmentedMatrix[i][i] === 0) {
        for (let j = i + 1; j < numEquations; j++) {
          if (augmentedMatrix[j][i] !== 0) {
            [augmentedMatrix[i], augmentedMatrix[j]] = [augmentedMatrix[j], augmentedMatrix[i]];
            break;
          }
        }
      }

      const pivot = augmentedMatrix[i][i];
      for (let j = i; j < 2 * numEquations; j++) {
        augmentedMatrix[i][j] /= pivot;
      }

      for (let j = 0; j < numEquations; j++) {
        if (j !== i) {
          const ratio = augmentedMatrix[j][i];
          for (let k = i; k < 2 * numEquations; k++) {
            augmentedMatrix[j][k] -= ratio * augmentedMatrix[i][k];
          }
        }
      }
    }

    const inverseMatrix = augmentedMatrix.map(row => row.slice(numEquations));

    return inverseMatrix;
  }
});

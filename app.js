/**
 * Eazi Profit - Advanced Computational Engine
 * Compliant with ASTM D1250-04 / API MPMS Chapter 11.1
 */

document.addEventListener("DOMContentLoaded", () => {
    const computeBtn = document.getElementById("computeBtn");
    const resetBtn = document.getElementById("resetBtn");
    const copyBtn = document.getElementById("copyBtn");

    computeBtn.addEventListener("click", executePetroleumCore);
    resetBtn.addEventListener("click", resetSuiteDisplay);
    copyBtn.addEventListener("click", copyResultsToClipboard);
});

function executePetroleumCore() {
    let targetObservedAPI = 0;
    let targetTemperature = 0;

    // Fetch states from user input DOM nodes
    const directAPI = parseFloat(document.getElementById("apiInput").value);
    const directTemp = parseFloat(document.getElementById("tempInput").value);
    const w0 = parseFloat(document.getElementById("w0Input").value);
    const ww = parseFloat(document.getElementById("wwInput").value);
    const ws = parseFloat(document.getElementById("wsInput").value);
    const pycTemp = parseFloat(document.getElementById("pycTempInput").value);

    // LOGIC ROUTING SCHEME
    if (!isNaN(w0) && !isNaN(ww) && !isNaN(ws) && !isNaN(pycTemp)) {
        if ((ww - w0) <= 0) {
            alert("Calculation Error: Water fill mass must be greater than empty flask mass.");
            return;
        }
        let calculatedSG = (ws - w0) / (ww - w0);
        targetObservedAPI = (141.5 / calculatedSG) - 131.5;
        targetTemperature = pycTemp;
    } else if (!isNaN(directAPI) && !isNaN(directTemp)) {
        targetObservedAPI = directAPI;
        targetTemperature = directTemp;
    } else {
        alert("Execution Error: Please completely fill out either Method A or Method B fields.");
        return;
    }

    // CORE ASTM CONVERGENCE LOOP MATRIX (TABLE 5A)
    const K0 = 341.0957;
    const waterDensityBase = 999.016;
    const deltaT = targetTemperature - 60.0;

    const observedSG = 141.5 / (targetObservedAPI + 131.5);
    const observedDensity = observedSG * waterDensityBase;
    const glassCorrectedDensity = observedDensity * (1.0 - (0.00001278 * deltaT) - (0.0000000062 * Math.pow(deltaT, 2)));

    let rho60Guess = glassCorrectedDensity;
    let alpha60, volumeCorrectionFactor;

    for (let pass = 0; pass < 4; pass++) {
        alpha60 = K0 / Math.pow(rho60Guess, 2);
        volumeCorrectionFactor = Math.exp(-alpha60 * deltaT * (1.0 + 0.8 * alpha60 * deltaT));
        rho60Guess = glassCorrectedDensity / volumeCorrectionFactor;
    }

    const finalStandardSG = rho60Guess / waterDensityBase;
    const standardAPI60 = (141.5 / finalStandardSG) - 131.5;

    // UPDATE DATA FIELD NODES
    document.getElementById("resultAPI").innerText = standardAPI60.toFixed(2) + " °";
    document.getElementById("resultSG").innerText = finalStandardSG.toFixed(4);
    document.getElementById("resultVCF").innerText = volumeCorrectionFactor.toFixed(5);
}

function copyResultsToClipboard() {
    // 1. Harvest the current text states from outputs
    const api60 = document.getElementById("resultAPI").innerText;
    const sg60 = document.getElementById("resultSG").innerText;
    const vcf = document.getElementById("resultVCF").innerText;

    // Guard statement to check if user has actually computed parameters yet
    if (api60 === "--") {
        alert("Copy Canceled: No analytical calculations found on the active display matrix.");
        return;
    }

    // 2. Format a highly professional, clean corporate text report
    const reportTemplate = 
`--- Eazi Profit Petroleum Log ---
Corrected API @ 60°F: ${api60}
Corrected SG @ 60/60°F: ${sg60}
Volume Correction Factor (VCF): ${vcf}
Generated via API MPMS Ch. 11.1 Engine`;

    // 3. Inject the text payload into the phone or PC clipboard API
    navigator.clipboard.writeText(reportTemplate)
        .then(() => {
            // Visual alert confirming successful background action execution
            alert("Success: Eazi Profit metrics copied smoothly to clipboard!");
        })
        .catch(err => {
            alert("Clipboard Failure: System denied background data stream transfer.");
        });
}

function resetSuiteDisplay() {
    document.getElementById("apiInput").value = "";
    document.getElementById("tempInput").value = "";
    document.getElementById("w0Input").value = "";
    document.getElementById("wwInput").value = "";
    document.getElementById("wsInput").value = "";
    document.getElementById("pycTempInput").value = "";

    document.getElementById("resultAPI").innerText = "--";
    document.getElementById("resultSG").innerText = "--";
    document.getElementById("resultVCF").innerText = "--";
}

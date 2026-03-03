let currentMode = null;
let playersAssigned = false;

/* =========================
   CATEGORY DATA (OFFICIAL)
   ========================= */

const missionData = {

    Deployment: [
        "Line",
        "Table Corners",
        "Midboard",
        "From Corners",
        "Attacker Defender",
        "Encirclement"
    ],

    "Approach Type": [
        "Standoff",
        "Close Enough",
        "Column",
        "Counterattack",
        "Delayed Response",
        "Home Fleet Disadvantage"
    ],

    Layouts: [
        "Diagonal",
        "Edge Case",
        "Eruption",
        "Gatecrash",
        "Moonlight",
        "Moonstruck"
    ],

    Variants: [
        "Guarded Sectors",
        "Secure Comms Array",
        "Battlescarred",
        "Gridlocked",
        "Expansive Atmosphere",
        "Orbital Complex"
    ],

    Objectives: [
        "Attrition",
        "Survey",
        "Extract",
        "Protect",
        "Breakthrough",
        "Raise"
    ]
};

/* SCENARIO TABLE (Scenario Mode Only) */

const scenarioData = [
    "Take and Hold",
    "Erupting Battlefront",
    "Power Gate",
    "Shack and Yaw",
    "Orbital Support",
    "Entrapment"
];

/* =========================
   MODE LIMITS
   ========================= */

const modeLimits = {
    casual: 4,           // 1–4 across all
    narrative: 6,        // 1–6 across all
    competitive: {
        Deployment: 4,
        Layouts: 3,
        default: 6
    },
    scenario: 6
};

/* =========================
   MODE BUTTONS
   ========================= */

document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentMode = btn.dataset.mode;
        generateAll();
    });
});

/* =========================
   GENERATE ALL
   ========================= */

function generateAll() {

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!currentMode) return;

    if (currentMode === "scenario") {
        createScenarioRow();
        return;
    }

    Object.keys(missionData).forEach(category => {
        createRow(category);
    });
}

/* =========================
   CREATE STANDARD ROW
   ========================= */

function createRow(category) {

    const resultsDiv = document.getElementById("results");

    const row = document.createElement("div");
    row.className = "result-row";

    const text = document.createElement("div");
    text.className = "result-text";

    const reroll = document.createElement("button");
    reroll.className = "reroll-btn";
    reroll.textContent = "Reroll";

    reroll.addEventListener("click", () => {
        rollCategory(category, text);
    });

    rollCategory(category, text);

    row.appendChild(text);
    row.appendChild(reroll);

    resultsDiv.appendChild(row);
}

/* =========================
   ROLL CATEGORY
   ========================= */

function rollCategory(category, textElement) {

    let limit;

    if (currentMode === "competitive") {
        limit = modeLimits.competitive[category] || modeLimits.competitive.default;
    } else {
        limit = modeLimits[currentMode];
    }

    const rollIndex = Math.floor(Math.random() * limit);
    const resultName = missionData[category][rollIndex];

    textElement.textContent = `${category}: ${rollIndex + 1} - ${resultName}`;
}

/* =========================
   SCENARIO MODE
   ========================= */

function createScenarioRow() {

    const resultsDiv = document.getElementById("results");

    const row = document.createElement("div");
    row.className = "result-row";

    const text = document.createElement("div");
    text.className = "result-text";

    const reroll = document.createElement("button");
    reroll.className = "reroll-btn";
    reroll.textContent = "Reroll";

    reroll.addEventListener("click", () => {
        rollScenario(text);
    });

    rollScenario(text);

    row.appendChild(text);
    row.appendChild(reroll);

    resultsDiv.appendChild(row);
}

function rollScenario(textElement) {

    const rollIndex = Math.floor(Math.random() * 6);
    const resultName = scenarioData[rollIndex];

    textElement.textContent = `Scenario: ${rollIndex + 1} - ${resultName}`;
}

/* =========================
   PLAYER ASSIGNMENT
   ========================= */

document.getElementById("assignPlayers").addEventListener("click", () => {

    if (playersAssigned) return;

    const p1 = document.getElementById("player1").value || "Player 1";
    const p2 = document.getElementById("player2").value || "Player 2";

    const swap = Math.random() < 0.5;

    const red = swap ? p1 : p2;
    const blue = swap ? p2 : p1;

    document.getElementById("playerResult").innerHTML =
        `<span style="color:#cc4444;">Red Player: ${red}</span> | 
         <span style="color:#4da6ff;">Blue Player: ${blue}</span>`;

    playersAssigned = true;
});

/* RESET PLAYERS */

document.getElementById("resetPlayers").addEventListener("click", () => {
    playersAssigned = false;
    document.getElementById("playerResult").innerHTML = "";
});

/* =========================
   COPY TO CLIPBOARD
   ========================= */

document.getElementById("copyBtn").addEventListener("click", () => {

    let copyText = "";

    const playerText = document.getElementById("playerResult").innerText;
    if (playerText) copyText += playerText + "\n\n";

    document.querySelectorAll(".result-text").forEach(row => {
        copyText += row.textContent + "\n";
    });

    navigator.clipboard.writeText(copyText);
});
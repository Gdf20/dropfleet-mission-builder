let currentMode = null;
let playersAssigned = false;

const categories = ["Deployment", "Layout", "Primary", "Secondary", "Twist"];

const modeLimits = {
    casual: { default: 4 },
    narrative: { default: 6 },
    competitive: {
        Deployment: 4,
        Layout: 3,
        default: 6
    },
    scenario: { default: 6 }
};

document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentMode = btn.dataset.mode;
        generateAll();
    });
});

function generateAll() {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    categories.forEach(cat => {
        createRow(cat);
    });
}

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

    row.appendChild(document.createElement("div"));
    row.appendChild(text);
    row.appendChild(reroll);

    resultsDiv.appendChild(row);
}

function rollCategory(category, textElement) {
    if (!currentMode) return;

    let limit = modeLimits[currentMode][category] || modeLimits[currentMode].default;
    let roll = Math.floor(Math.random() * limit) + 1;

    textElement.textContent = `${category}: ${roll}`;
}

/* PLAYER ASSIGNMENT */

document.getElementById("assignPlayers").addEventListener("click", () => {
    if (playersAssigned) return;

    const p1 = document.getElementById("player1").value || "Player 1";
    const p2 = document.getElementById("player2").value || "Player 2";

    const rand = Math.random() < 0.5;

    const red = rand ? p1 : p2;
    const blue = rand ? p2 : p1;

    document.getElementById("playerResult").textContent =
        `Red Player: ${red} | Blue Player: ${blue}`;

    playersAssigned = true;
});

document.getElementById("resetPlayers").addEventListener("click", () => {
    playersAssigned = false;
    document.getElementById("playerResult").textContent = "";
});

/* COPY */

document.getElementById("copyBtn").addEventListener("click", () => {
    let text = document.getElementById("playerResult").textContent + "\n";

    document.querySelectorAll(".result-text").forEach(r => {
        text += r.textContent + "\n";
    });

    navigator.clipboard.writeText(text);
});
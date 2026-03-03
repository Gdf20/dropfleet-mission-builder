// -------------------- DATA --------------------

const deployments = [
  "Line","Table Corners","Midboard","From Corners",
  "Attacker Defender","Encirclement"
];

const approaches = [
  "Standoff","Close Enough","Column","Counterattack",
  "Delayed Response","Home Fleet Disadvantage"
];

const layouts = [
  "Diagonal","Edge Case","Eruption",
  "Gatecrash","Moonlight","Moonstruck"
];

const variants = [
  "Guarded Sectors","Secure Comms Array","Battlescarred",
  "Gridlocked","Expansive Atmosphere","Orbital Complex"
];

const objectives = [
  "Attrition","Survey","Extract",
  "Protect","Breakthrough","Raise"
];

const scenarios = [
  "Take and Hold","Erupting Battlefront","Power Gate",
  "Shack and Yaw","Orbital Support","Entrapment"
];

// -------------------- STATE --------------------

let playersAssigned = false;
let currentMode = "casual";
let currentRolls = {};

// -------------------- UTILITY --------------------

function random(max) {
  return Math.floor(Math.random() * max);
}

function rollCategory(name, array, max) {
  let index;
  do {
    index = random(max);
  } while (currentRolls[name] === index);

  currentRolls[name] = index;

  return {
    number: index + 1,
    value: array[index]
  };
}

// -------------------- PLAYER ASSIGNMENT --------------------

function assignPlayers() {
  if (playersAssigned) return;

  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();

  if (!p1 || !p2) {
    alert("Enter both player names.");
    return;
  }

  const swap = Math.random() < 0.5;

  const output = document.getElementById("playerResults");

  output.innerHTML = swap
    ? `<div class="red-player">Red: ${p1}</div>
       <div class="blue-player">Blue: ${p2}</div>`
    : `<div class="red-player">Red: ${p2}</div>
       <div class="blue-player">Blue: ${p1}</div>`;

  playersAssigned = true;

  document.getElementById("assignBtn").disabled = true;
  document.getElementById("resetPlayersBtn").disabled = false;
}

function resetPlayers() {
  playersAssigned = false;

  document.getElementById("playerResults").innerHTML = "";
  document.getElementById("player1").value = "";
  document.getElementById("player2").value = "";

  document.getElementById("assignBtn").disabled = false;
  document.getElementById("resetPlayersBtn").disabled = true;
}

// -------------------- MODE BADGE --------------------

function setBadge(mode) {
  currentMode = mode;

  const badge = document.getElementById("modeBadge");

  badge.className = "badge badge-" + mode;

  const labels = {
    casual: "Casual",
    narrative: "Casual Narrative",
    competitive: "Competitive",
    standard: "Standard Scenario"
  };

  badge.innerText = "Mode: " + labels[mode];
}

// -------------------- MAIN ROLL --------------------

function rollMission(mode) {
  setBadge(mode);
  currentRolls = {};

  const results = document.getElementById("results");
  results.innerHTML = "";

  // STANDARD MODE
  if (mode === "standard") {
    const roll = rollCategory("Scenario", scenarios, 6);
    results.innerHTML = createCard("Scenario", roll);
    return;
  }

  // Set limits per mode
  let depMax = 6;
  let appMax = 6;
  let layMax = 6;
  let varMax = 6;
  let objMax = 6;

  if (mode === "casual") {
    depMax = appMax = layMax = varMax = objMax = 4;
  }

  if (mode === "competitive") {
    depMax = 4;      // Limited
    layMax = 3;      // Limited
  }

  const categories = [
    ["Deployment", deployments, depMax],
    ["Approach Type", approaches, appMax],
    ["Layout", layouts, layMax],
    ["Variant", variants, varMax],
    ["Objective", objectives, objMax]
  ];

  categories.forEach(cat => {
    const roll = rollCategory(cat[0], cat[1], cat[2]);
    results.innerHTML += createCard(cat[0], roll);
  });
}

// -------------------- CARD CREATION --------------------

function createCard(name, roll) {
  return `
    <div class="category-card" data-name="${name}">
      <div class="category-text">
        <strong>${name}:</strong> ${roll.number} - ${roll.value}
      </div>
      <button class="reroll-btn" onclick="rerollCategory('${name}')">
        Reroll
      </button>
    </div>
  `;
}

// -------------------- SINGLE REROLL --------------------

function rerollCategory(name) {

  let array, max;

  switch (name) {
    case "Deployment":
      array = deployments;
      max = (currentMode === "casual" || currentMode === "competitive") ? 4 : 6;
      break;

    case "Approach Type":
      array = approaches;
      max = (currentMode === "casual") ? 4 : 6;
      break;

    case "Layout":
      array = layouts;
      max = (currentMode === "competitive") ? 3 :
            (currentMode === "casual") ? 4 : 6;
      break;

    case "Variant":
      array = variants;
      max = (currentMode === "casual") ? 4 : 6;
      break;

    case "Objective":
      array = objectives;
      max = (currentMode === "casual") ? 4 : 6;
      break;

    case "Scenario":
      array = scenarios;
      max = 6;
      break;

    default:
      return;
  }

  const roll = rollCategory(name, array, max);

  const card = document.querySelector(`[data-name='${name}']`);

  if (card) {
    card.outerHTML = createCard(name, roll);
  }
}

// -------------------- COPY FUNCTION --------------------

function copyMission() {
  const playerText = document.getElementById("playerResults").innerText.trim();
  const categories = document.querySelectorAll(".category-text");

  let text = "";

  if (playerText) {
    text += playerText + "\n";
  }

  categories.forEach(cat => {
    text += cat.innerText + "\n";
  });

  navigator.clipboard.writeText(text.trim());

  alert("Mission copied!");
}
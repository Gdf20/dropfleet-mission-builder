const deployments = [
  "Line",
  "Table Corners",
  "Midboard",
  "From Corners",
  "Attacker Defender",
  "Encirclement"
];

const approaches = [
  "Standoff",
  "Close Enough",
  "Column",
  "Counterattack",
  "Delayed Response",
  "Home Fleet Disadvantage"
];

const layouts = [
  "Diagonal",
  "Edge Case",
  "Eruption",
  "Gatecrash",
  "Moonlight",
  "Moonstruck"
];

const variants = [
  "Guarded Sectors",
  "Secure Comms Array",
  "Battlescarred",
  "Gridlocked",
  "Expansive Atmosphere",
  "Orbital Complex"
];

const objectives = [
  "Attrition",
  "Survey",
  "Extract",
  "Protect",
  "Breakthrough",
  "Raise"
];

const scenarios = [
  "Take and Hold",
  "Erupting Battlefront",
  "Power Gate",
  "Shack and Yaw",
  "Orbital Support",
  "Entrapment"
];

let playersAssigned = false;

function random(max) {
  return Math.floor(Math.random() * max);
}

function assignPlayers() {
  if (playersAssigned) return;

  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();

  if (!p1 || !p2) {
    alert("Enter both player names.");
    return;
  }

  const roll = random(2);
  const output = document.getElementById("playerResults");

  if (roll === 0) {
    output.innerHTML = `
      <div class="red-player">Red Player: ${p1}</div>
      <div class="blue-player">Blue Player: ${p2}</div>
    `;
  } else {
    output.innerHTML = `
      <div class="red-player">Red Player: ${p2}</div>
      <div class="blue-player">Blue Player: ${p1}</div>
    `;
  }

  document.getElementById("assignBtn").disabled = true;
  playersAssigned = true;
}

function setBadge(mode) {
  const badge = document.getElementById("modeBadge");
  badge.className = "mode-badge badge-" + mode;

  const labels = {
    casual: "Casual",
    narrative: "Casual Narrative",
    competitive: "Competitive",
    standard: "Standard Scenario"
  };

  badge.innerText = "Mode: " + labels[mode];
}

function rollMission(mode) {
  const results = document.getElementById("results");
  setBadge(mode);

  // STANDARD BUTTON (Scenario only)
  if (mode === "standard") {
    const s = scenarios[random(6)];
    results.innerHTML = `
      <h2>Scenario</h2>
      <p>${s}</p>
    `;
    return;
  }

  // Default ranges
  let depMax = 6;
  let appMax = 6;
  let layMax = 6;
  let varMax = 6;
  let objMax = 6;

  // Casual (1–4 all)
  if (mode === "casual") {
    depMax = 4;
    appMax = 4;
    layMax = 4;
    varMax = 4;
    objMax = 4;
  }

  // Competitive
  if (mode === "competitive") {
    depMax = 4;   // 1–4
    layMax = 3;   // 1–3
  }

  // Narrative stays 1–6 all

  const deployment = deployments[random(depMax)];
  const approach = approaches[random(appMax)];
  const layout = layouts[random(layMax)];
  const variant = variants[random(varMax)];
  const objective = objectives[random(objMax)];

  results.innerHTML = `
    <h2>Deployment</h2>
    <p>${deployment}</p>

    <h2>Approach Type</h2>
    <p>${approach}</p>

    <h2>Layout</h2>
    <p>${layout}</p>

    <h2>Variant</h2>
    <p>${variant}</p>

    <h2>Objective</h2>
    <p>${objective}</p>
  `;
}

function copyMission() {
  const text = document.getElementById("exportArea").innerText;
  navigator.clipboard.writeText(text);
  alert("Mission copied!");
}

function exportPNG() {
  html2canvas(document.getElementById("exportArea"))
    .then(canvas => {
      const link = document.createElement("a");
      link.download = "mission.png";
      link.href = canvas.toDataURL();
      link.click();
    });
}
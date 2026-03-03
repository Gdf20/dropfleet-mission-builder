const scenarios = [
  "Domination",
  "Recon",
  "Breakthrough",
  "Vital Intelligence",
  "Supply Drop",
  "Invasion"
];

const deployments = [
  "Standard",
  "Flank",
  "Corner",
  "Diagonal",
  "Encirclement",
  "Ambush"
];

const layouts = [
  "Sparse",
  "Moderate",
  "Dense",
  "Clustered",
  "Central Mass",
  "Outer Ring"
];

function random(max) {
  return Math.floor(Math.random() * max);
}

function setBadge(mode) {
  const badge = document.getElementById("modeBadge");
  badge.className = "mode-badge";

  if (mode === "casual") {
    badge.classList.add("badge-casual");
    badge.innerText = "Mode: Casual";
  }

  if (mode === "narrative") {
    badge.classList.add("badge-narrative");
    badge.innerText = "Mode: Casual Narrative";
  }

  if (mode === "competitive") {
    badge.classList.add("badge-competitive");
    badge.innerText = "Mode: Competitive";
  }

  if (mode === "standard") {
    badge.classList.add("badge-standard");
    badge.innerText = "Mode: Standard Scenario";
  }
}

function rollMission(mode) {
  const results = document.getElementById("results");

  results.classList.remove("roll-animation");
  void results.offsetWidth;
  results.classList.add("roll-animation");

  setBadge(mode);

  let scenarioRoll, deploymentRoll, layoutRoll;

  if (mode === "casual") {
    scenarioRoll = random(4);
    deploymentRoll = random(4);
    layoutRoll = random(4);
  }

  if (mode === "narrative") {
    scenarioRoll = random(6);
    deploymentRoll = random(6);
    layoutRoll = random(6);
  }

  if (mode === "competitive") {
    scenarioRoll = random(6);
    deploymentRoll = random(4);
    layoutRoll = random(3);
  }

  if (mode === "standard") {
    scenarioRoll = random(6);
    results.innerHTML = `
      <h2>Scenario</h2>
      <p>${scenarios[scenarioRoll]}</p>
    `;
    return;
  }

  results.innerHTML = `
    <h2>Scenario</h2>
    <p>${scenarios[scenarioRoll]}</p>
    <h2>Deployment</h2>
    <p>${deployments[deploymentRoll]}</p>
    <h2>Cluster Layout</h2>
    <p>${layouts[layoutRoll]}</p>
  `;
}

function copyMission() {
  const text = document.getElementById("exportArea").innerText;
  navigator.clipboard.writeText(text);
  alert("Mission copied to clipboard!");
}

function exportPNG() {
  const exportArea = document.getElementById("exportArea");

  html2canvas(exportArea).then(canvas => {
    const link = document.createElement("a");
    link.download = "mission.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
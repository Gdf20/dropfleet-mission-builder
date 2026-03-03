const deployments = [
  "Line","Table Corners","Midboard","From Corners","Attacker Defender","Encirclement"
];

const approaches = [
  "Standoff","Close Enough","Column","Counterattack","Delayed Response","Home Fleet Disadvantage"
];

const layouts = [
  "Diagonal","Edge Case","Eruption","Gatecrash","Moonlight","Moonstruck"
];

const variants = [
  "Guarded Sectors","Secure Comms Array","Battlescarred","Gridlocked","Expansive Atmosphere","Orbital Complex"
];

const objectives = [
  "Attrition","Survey","Extract","Protect","Breakthrough","Raise"
];

const scenarios = [
  "Take and Hold","Erupting Battlefront","Power Gate","Shack and Yaw","Orbital Support","Entrapment"
];

let playersAssigned = false;

function random(max) { return Math.floor(Math.random() * max); }

function assignPlayers() {
  if (playersAssigned) return;
  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();
  if (!p1 || !p2) return alert("Enter both player names.");

  const roll = random(2);
  const output = document.getElementById("playerResults");

  if (roll === 0) {
    output.innerHTML = `<div class="red-player">Red: ${p1}</div><div class="blue-player">Blue: ${p2}</div>`;
  } else {
    output.innerHTML = `<div class="red-player">Red: ${p2}</div><div class="blue-player">Blue: ${p1}</div>`;
  }

  document.getElementById("assignBtn").disabled = true;
  playersAssigned = true;
}

function setBadge(mode) {
  const badge = document.getElementById("modeBadge");
  badge.className = "mode-badge badge-" + mode;
  const labels = {casual:"Casual", narrative:"Casual Narrative", competitive:"Competitive", standard:"Standard Scenario"};
  badge.innerText = "Mode: " + labels[mode];
}

function rollMission(mode) {
  const results = document.getElementById("results");
  setBadge(mode);

  if (mode==="standard") {
    const s = scenarios[random(6)];
    results.innerHTML = `<div class="category-card scenario"><strong>Scenario (1):</strong> <span>${s}</span></div>`;
    return;
  }

  let depMax=6, appMax=6, layMax=6, varMax=6, objMax=6;
  if(mode==="casual"){ depMax=appMax=layMax=varMax=objMax=4; }
  if(mode==="competitive"){ depMax=4; layMax=3; }

  const cards = [
    {name:"Deployment", value:deployments[random(depMax)], css:"deployment"},
    {name:"Approach Type", value:approaches[random(appMax)], css:"approach"},
    {name:"Layout", value:layouts[random(layMax)], css:"layout"},
    {name:"Variant", value:variants[random(varMax)], css:"variant"},
    {name:"Objective", value:objectives[random(objMax)], css:"objective"}
  ];

  results.innerHTML = cards.map((c,i)=>`<div class="category-card ${c.css}"><strong>${c.name} (${i+1}):</strong> <span>${c.value}</span></div>`).join("");
}

function copyMission() {
  navigator.clipboard.writeText(document.getElementById("exportArea").innerText);
  alert("Mission copied!");
}

function exportPNG() {
  html2canvas(document.getElementById("exportArea")).then(canvas=>{
    const link=document.createElement("a");
    link.download="mission.png";
    link.href=canvas.toDataURL();
    link.click();
  });
}
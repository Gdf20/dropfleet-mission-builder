// ------------------- Data -------------------
const deployments = ["Line","Table Corners","Midboard","From Corners","Attacker Defender","Encirclement"];
const approaches = ["Standoff","Close Enough","Column","Counterattack","Delayed Response","Home Fleet Disadvantage"];
const layouts = ["Diagonal","Edge Case","Eruption","Gatecrash","Moonlight","Moonstruck"];
const variants = ["Guarded Sectors","Secure Comms Array","Battlescarred","Gridlocked","Expansive Atmosphere","Orbital Complex"];
const objectives = ["Attrition","Survey","Extract","Protect","Breakthrough","Raise"];
const scenarios = ["Take and Hold","Erupting Battlefront","Power Gate","Shack and Yaw","Orbital Support","Entrapment"];

// ------------------- Global State -------------------
let playersAssigned = false;
let currentMode = "casual";
let currentRolls = {};

// ------------------- Utility -------------------
function random(max) { return Math.floor(Math.random() * max); }

// ------------------- Player Assignment -------------------
function assignPlayers() {
  if (playersAssigned) return;
  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();
  if (!p1 || !p2) return alert("Enter both player names.");

  const roll = Math.random() < 0.5 ? 0 : 1;
  const output = document.getElementById("playerResults");
  if (roll === 0) {
    output.innerHTML = `<div class="red-player">Red: ${p1}</div><div class="blue-player">Blue: ${p2}</div>`;
  } else {
    output.innerHTML = `<div class="red-player">Red: ${p2}</div><div class="blue-player">Blue: ${p1}</div>`;
  }

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

// ------------------- Mode Badge -------------------
function setBadge(mode) {
  currentMode = mode;
  const badge = document.getElementById("modeBadge");
  badge.className = "mode-badge badge-" + mode;
  const labels = {casual:"Casual", narrative:"Casual Narrative", competitive:"Competitive", standard:"Standard Scenario"};
  badge.innerText = "Mode: " + labels[mode];
}

// ------------------- Roll Category -------------------
function rollCategory(name, array, max) {
  let idx;
  do { idx = random(max); } while (currentRolls[name] === idx);
  currentRolls[name] = idx;
  return {num: idx+1, value: array[idx]};
}

// ------------------- Main Mission Roll -------------------
function rollMission(mode) {
  setBadge(mode);
  currentRolls = {};
  const results = document.getElementById("results");

  if(mode==="standard") {
    const s = rollCategory("Scenario", scenarios, scenarios.length);
    results.innerHTML = `<div class="category-card scenario dice-roll" data-name="Scenario">
      <div class="category-text"><strong>Scenario:</strong> ${s.num} - ${s.value}</div>
      <button class="reroll-btn" onclick="rerollCategory('Scenario')">Reroll</button>
    </div>`;
    return;
  }

  let depMax=deployments.length, appMax=approaches.length, layMax=layouts.length,
      varMax=variants.length, objMax=objectives.length;

  if(mode==="casual"){ depMax=appMax=layMax=varMax=objMax=4; }
  if(mode==="narrative"){ depMax=appMax=layMax=varMax=objMax=6; }
  if(mode==="competitive"){ depMax=4; layMax=3; appMax=6; varMax=6; objMax=6; }

  const categories = [
    {name:"Deployment", array:deployments, max:depMax, css:"deployment"},
    {name:"Approach Type", array:approaches, max:appMax, css:"approach"},
    {name:"Layout", array:layouts, max:layMax, css:"layout"},
    {name:"Variant", array:variants, max:varMax, css:"variant"},
    {name:"Objective", array:objectives, max:objMax, css:"objective"},
  ];

  results.innerHTML = categories.map(c=>{
    const roll = rollCategory(c.name, c.array, c.max);
    return `<div class="category-card ${c.css} dice-roll" data-name="${c.name}">
      <div class="category-text"><strong>${c.name}:</strong> ${roll.num} - ${roll.value}</div>
      <button class="reroll-btn" onclick="rerollCategory('${c.name}')">Reroll</button>
    </div>`;
  }).join("");
}

// ------------------- Reroll Single Category -------------------
function rerollCategory(name) {
  const catDiv = document.querySelector(`.category-card[data-name='${name}']`);
  if(!catDiv) return;

  catDiv.classList.remove("dice-roll");
  void catDiv.offsetWidth; // restart animation
  catDiv.classList.add("dice-roll");

  let arr=[], max=0;
  switch(name){
    case "Deployment": arr=deployments; max=(currentMode==="casual"||currentMode==="competitive")?4:6; break;
    case "Approach Type": arr=approaches; max=(currentMode==="casual")?4:6; break;
    case "Layout": arr=layouts; max=(currentMode==="casual")?4:6; if(currentMode==="competitive") max=3; break;
    case "Variant": arr=variants; max=(currentMode==="casual")?4:6; break;
    case "Objective": arr=objectives; max=(currentMode==="casual")?4:6; break;
    case "Scenario": arr=scenarios; max=6; break;
    default: return;
  }

  const roll = rollCategory(name, arr, max);
  catDiv.innerHTML = `<div class="category-text"><strong>${name}:</strong> ${roll.num} - ${roll.value}</div>
                      <button class="reroll-btn" onclick="rerollCategory('${name}')">Reroll</button>`;
  catDiv.classList.add("dice-roll");
}

// ------------------- Copy Mission -------------------
function copyMission() {
  const results = document.getElementById("results").innerText.trim();
  const players = document.getElementById("playerResults").innerText.trim();
  const textToCopy = players + (players ? "\n" : "") + results;
  navigator.clipboard.writeText(textToCopy);
  alert("Mission copied!");
}

// ------------------- Export to PNG -------------------
function exportPNG() {
  const cards = document.querySelectorAll(".category-card");
  cards.forEach(c=>c.classList.remove("dice-roll")); // pause animation

  const exportArea = document.getElementById("exportArea");
  exportArea.style.width = exportArea.scrollWidth + "px";
  exportArea.style.height = exportArea.scrollHeight + "px";

  html2canvas(exportArea).then(canvas=>{
    const link=document.createElement("a");
    link.download="mission.png";
    link.href=canvas.toDataURL();
    link.click();
    cards.forEach(c=>c.classList.add("dice-roll")); // restore animation
    exportArea.style.width = "";
    exportArea.style.height = "";
  });
}
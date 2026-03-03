const deployments = ["Line","Table Corners","Midboard","From Corners","Attacker Defender","Encirclement"];
const approaches = ["Standoff","Close Enough","Column","Counterattack","Delayed Response","Home Fleet Disadvantage"];
const layouts = ["Diagonal","Edge Case","Eruption","Gatecrash","Moonlight","Moonstruck"];
const variants = ["Guarded Sectors","Secure Comms Array","Battlescarred","Gridlocked","Expansive Atmosphere","Orbital Complex"];
const objectives = ["Attrition","Survey","Extract","Protect","Breakthrough","Raise"];
const scenarios = ["Take and Hold","Erupting Battlefront","Power Gate","Shack and Yaw","Orbital Support","Entrapment"];

let playersAssigned = false;
let currentMode = "casual";

// Track current roll indices to allow rerolls
let currentRolls = {};

function random(max) { return Math.floor(Math.random() * max); }

// ------------------- Player Assignment -------------------
function assignPlayers() {
  if (playersAssigned) return;

  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();

  if (!p1 || !p2) {
    alert("Enter both player names.");
    return;
  }

  // Randomly assign Red/Blue
  const roll = Math.random() < 0.5 ? 0 : 1;
  const output = document.getElementById("playerResults");

  if (roll === 0) {
    output.innerHTML = `<div class="red-player">Red: ${p1}</div><div class="blue-player">Blue: ${p2}</div>`;
  } else {
    output.innerHTML = `<div class="red-player">Red: ${p2}</div><div class="blue-player">Blue: ${p1}</div>`;
  }

  playersAssigned = true;
  document.getElementById("assignBtn").disabled = true;
}

// ------------------- Mode Badge -------------------
function setBadge(mode) {
  currentMode = mode;
  const badge = document.getElementById("modeBadge");
  badge.className = "mode-badge badge-" + mode;
  const labels = {casual:"Casual", narrative:"Casual Narrative", competitive:"Competitive", standard:"Standard Scenario"};
  badge.innerText = "Mode: " + labels[mode];
}

// ------------------- Roll a single category -------------------
function rollCategory(name, array, max) {
  let idx;
  do { idx = random(max); } while (currentRolls[name] === idx);
  currentRolls[name] = idx;
  return {num: idx+1, value: array[idx]};
}

// ------------------- Main Mission Roll -------------------
function rollMission(mode) {
  setBadge(mode);
  currentRolls = {}; // reset for new mission
  const results = document.getElementById("results");

  if(mode==="standard") {
    const s = rollCategory("Scenario", scenarios, scenarios.length);
    results.innerHTML = `<div class="category-card scenario"><strong>Scenario:</strong> ${s.num} - ${s.value}</div>`;
    return;
  }

  // Mode rules
  let depMax=deployments.length, appMax=approaches.length, layMax=layouts.length,
      varMax=variants.length, objMax=objectives.length;

  if(mode==="casual"){ depMax=appMax=layMax=varMax=objMax=4; }
  if(mode==="competitive"){ depMax=4; layMax=3; }

  const categories = [
    {name:"Deployment", array:deployments, max:depMax, css:"deployment"},
    {name:"Approach Type", array:approaches, max:appMax, css:"approach"},
    {name:"Layout", array:layouts, max:layMax, css:"layout"},
    {name:"Variant", array:variants, max:varMax, css:"variant"},
    {name:"Objective", array:objectives, max:objMax, css:"objective"},
  ];

  results.innerHTML = categories.map(c=>{
    const roll = rollCategory(c.name, c.array, c.max);
    return `<div class="category-card ${c.css}" data-name="${c.name}">
              <strong>${c.name}:</strong> ${roll.num} - ${roll.value}
              <button class="reroll-btn" onclick="rerollCategory('${c.name}')">Reroll</button>
            </div>`;
  }).join("");
}

// ------------------- Reroll a single category -------------------
function rerollCategory(name) {
  const catDiv = document.querySelector(`.category-card[data-name='${name}']`);
  if(!catDiv) return;

  // Determine category array & max based on currentMode
  let arr=[], max=0;
  switch(name){
    case "Deployment": arr=deployments; max=(currentMode==="casual"||currentMode==="competitive")?4:6; break;
    case "Approach Type": arr=approaches; max=(currentMode==="casual")?4:6; break;
    case "Layout": arr=layouts; max=(currentMode==="casual")?4:6; if(currentMode==="competitive") max=3; break;
    case "Variant": arr=variants; max=(currentMode==="casual")?4:6; break;
    case "Objective": arr=objectives; max=(currentMode==="casual")?4:6; break;
    default: return;
  }

  const roll = rollCategory(name, arr, max);
  catDiv.innerHTML = `<strong>${name}:</strong> ${roll.num} - ${roll.value} <button class="reroll-btn" onclick="rerollCategory('${name}')">Reroll</button>`;
}

// ------------------- Copy Mission -------------------
function copyMission() {
  navigator.clipboard.writeText(document.getElementById("exportArea").innerText);
  alert("Mission copied!");
}

// ------------------- Export to PNG (fix animation) -------------------
function exportPNG() {
  const cards = document.querySelectorAll(".category-card");
  cards.forEach(c=>c.classList.remove("shake")); // pause dice-roll animation

  html2canvas(document.getElementById("exportArea")).then(canvas=>{
    const link=document.createElement("a");
    link.download="mission.png";
    link.href=canvas.toDataURL();
    link.click();
    cards.forEach(c=>c.classList.add("shake")); // restore animation
  });
}
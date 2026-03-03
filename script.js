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

  let content = "";

  if(mode==="standard") {
    const s = rollCategory("Scenario", scenarios, scenarios.length);
    content += `<div class="category-card scenario dice-roll" data-name="Scenario">
      <div class="category-text"><strong>Scenario:</strong> ${s.num} - ${s.value}</div>
      <button class="reroll-btn" onclick="rerollCategory('Scenario')">Reroll</button>
    </div>`;
  } else {
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

    categories.forEach(c=>{
      const roll = rollCategory(c.name, c.array, c.max);
      content += `<div class="category-card ${c.css} dice-roll" data-name="${c.name}">
        <div class="category-text"><strong>${c.name}:</strong> ${roll.num} - ${roll.value}</div>
        <button class="reroll-btn" onclick="rerollCategory('${c.name}')">Reroll</button>
      </div>`;
    });
  }

  results.innerHTML = content;
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
  const resultsDiv = document.getElementById("results");
  const cards = resultsDiv.querySelectorAll(".category-card");
  const players = document.getElementById("playerResults").innerText.trim();
  
  let textToCopy = players ? players + "\n" : "";
  cards.forEach(c=>{
    const text = c.querySelector(".category-text").innerText;
    textToCopy += text + "\n";
  });

  navigator.clipboard.writeText(textToCopy.trim());
  alert("Mission copied!");
}

// ------------------- Export to PNG (Fixed) -------------------
function exportPNG() {
  const missionBoard = document.getElementById("missionBoard");

  // Temporarily remove dice-roll animation
  const cards = missionBoard.querySelectorAll(".category-card");
  cards.forEach(c => c.classList.remove("dice-roll"));

  // Fix width for consistent export
  missionBoard.style.width = "700px";
  missionBoard.style.padding = "20px";
  missionBoard.style.boxSizing = "border-box";

  // Force redraw to stabilize layout
  missionBoard.getBoundingClientRect();

  html2canvas(missionBoard, {
    scale: 0.7,
    useCORS: true,
    allowTaint: true
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "mission.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // Restore dice-roll animation and layout
    cards.forEach(c => c.classList.add("dice-roll"));
    missionBoard.style.width = "";
    missionBoard.style.padding = "";
  }).catch(err => {
    alert("Error exporting PNG: " + err);
  });
}
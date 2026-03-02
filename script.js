const data = {
    Deployment: ["Line","Table Corners","Midboard","From Corners","Attacker Defender","Encirclement"],
    "Approach Type": ["Standoff","Close Enough","Column","Counterattack","Delayed Response","Home Fleet Disadvantage"],
    Layouts: ["Diagonal","Edge Case","Eruption","Gatecrash","Moonlight","Moonstruck"],
    Variants: ["Guarded Sectors","Secure Comms Array","Battlescarred","Gridlocked","Expansive Atmosphere","Orbital Complex"],
    Objectives: ["Attrition","Survey","Extract","Protect","Breakthrough","Raise"],
    Scenario: ["Take and Hold","Erupting Battlefront","Power Gate","Shack and Yaw","Orbital Support","Entrapment"]
};

const rulesPages = {
    Deployment: "Page 28 of Rules PDF",
    "Approach Type": "Page 30 of Rules PDF",
    Layouts: "Page 30 of Rules PDF",
    Variants: "Page 33 of Rules PDF",
    Objectives: "Page 34 of Rules PDF",
    Scenario: "Page 35 of Rules PDF"
};

let currentResults = {};
let currentMode = "";

function rollCasual(){ currentMode="casual"; rollMission(4,false); }
function rollComplete(){ currentMode="complete"; rollMission(6,false); }
function rollCompetitive(){ currentMode="competitive"; rollMission(6,true); }

function rollMission(maxRoll, competitiveMode){
    const resultsDiv = document.getElementById("results");
    const diceDiv = document.getElementById("dice");
    resultsDiv.innerHTML = "";
    currentResults = {};

    let ticks = 10;
    let currentTick = 0;

    const interval = setInterval(() => {
        const randomRoll = getRandomNumber(maxRoll);
        diceDiv.textContent = `🎲 ${randomRoll}`;
        diceDiv.style.transform = `rotate(${Math.random()*360}deg) scale(${1 + Math.random()*0.3})`;

        currentTick++;
        if(currentTick >= ticks){
            clearInterval(interval);

            for(let category in data){
                let roll;
                if(category === "Approach Type" && competitiveMode){
                    roll = getRandomNumber(3);
                } else {
                    roll = getRandomNumber(maxRoll);
                }

                const result = data[category][roll-1];
                currentResults[category] = {roll,result};

                resultsDiv.innerHTML += `
                    <div class="result-row" id="row-${category}">
                        <span class="result-text"><strong>${category}:</strong> ${roll} - ${result} (${rulesPages[category]})</span>
                        <button class="reroll-btn" onclick="rerollCategory('${category}')">Reroll</button>
                    </div>
                `;
            }

            diceDiv.textContent = "🎲 Done!";
            diceDiv.style.transform = "scale(1) rotate(0deg)";
        }
    }, 80);
}

function rerollCategory(category){
    let maxRoll;
    switch(currentMode){
        case "casual": maxRoll=4; break;
        case "complete": maxRoll=6; break;
        case "competitive": maxRoll=6; 
            if(category==="Approach Type"){ maxRoll=3 } 
            break;
    }

    let possible = [];
    for(let i=1;i<=maxRoll;i++){
        if(i !== currentResults[category].roll) possible.push(i);
    }

    let newRoll = possible[Math.floor(Math.random()*possible.length)];
    let newResult = data[category][newRoll-1];
    currentResults[category] = {roll:newRoll, result:newResult};

    const diceDiv = document.getElementById("dice");
    diceDiv.textContent = `🎲 ${newRoll}`;
    diceDiv.style.transform = `rotate(${Math.random()*360}deg) scale(${1 + Math.random()*0.3})`;
    setTimeout(()=>{
        diceDiv.textContent="🎲 Done!";
        diceDiv.style.transform="scale(1) rotate(0deg)";
    }, 400);

    const row = document.getElementById(`row-${category}`);
    if(row){
        row.querySelector('.result-text').textContent = `${category}: ${newRoll} - ${newResult} (${rulesPages[category]})`;
    }
}

function getRandomNumber(max){
    return Math.floor(Math.random()*max)+1;
}

// =====================
// Mobile-safe PNG export
// =====================
function exportPNG() {
    const resultsDiv = document.getElementById("results");
    if (resultsDiv.innerHTML.trim() === "") {
        alert("Please roll a mission first!");
        return;
    }

    const clone = resultsDiv.cloneNode(true);
    clone.querySelectorAll('.reroll-btn').forEach(el => el.remove());

    // Force clone offscreen and static
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = resultsDiv.offsetWidth + "px";
    clone.style.pointerEvents = "none"; 
    document.body.appendChild(clone);

    // small delay ensures buttons removed before html2canvas runs
    setTimeout(() => {
        html2canvas(clone, {backgroundColor:"#0b0f1a", scale:2, useCORS:true}).then(canvas=>{
            const link = document.createElement("a");
            link.download = "dropfleet_mission.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            document.body.removeChild(clone);
        }).catch(err=>{
            alert("PNG export failed: "+err);
            document.body.removeChild(clone);
        });
    }, 50);
}
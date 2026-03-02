// ===== DATA =====
const data = {
    Deployment: ["Line","Table Corners","Midboard","From Corners","Attacker Defender","Encirclement"],
    "Approach Type": ["Standoff","Close Enough","Column","Counterattack","Delayed Response","Home Fleet Disadvantage"],
    Layouts: ["Diagonal","Edge Case","Eruption","Gatecrash","Moonlight","Moonstruck"],
    Variants: ["Guarded Sectors","Secure Comms Array","Battlescarred","Gridlocked","Expansive Atmosphere","Orbital Complex"],
    Objectives: ["Attrition","Survey","Extract","Protect","Breakthrough","Raise"],
    Scenario: ["Take and Hold","Erupting Battlefront","Power Gate","Shack and Yaw","Orbital Support","Entrapment"]
};

// ===== ROLL FUNCTIONS =====
function rollCasual(){ rollMission(4,false); }
function rollComplete(){ rollMission(6,false); }
function rollCompetitive(){ rollMission(6,true); }

// ===== CORE LOGIC WITH DICE ANIMATION =====
function rollMission(maxRoll, competitiveMode){
    const resultsDiv = document.getElementById("results");
    const diceDiv = document.getElementById("dice");
    resultsDiv.innerHTML = ""; // clear previous results

    // Animation ticks
    let ticks = 10;
    let currentTick = 0;

    const interval = setInterval(() => {
        // Random dice number for visual effect
        const randomRoll = getRandomNumber(maxRoll);
        diceDiv.textContent = `🎲 ${randomRoll}`;
        diceDiv.style.transform = `rotate(${Math.random()*360}deg) scale(${1 + Math.random()*0.3})`;

        currentTick++;
        if(currentTick >= ticks){
            clearInterval(interval);

            // Final mission results
            for(let category in data){
                let roll;
                if(category === "Approach Type" && competitiveMode){
                    roll = getRandomNumber(3); // Only 1-3 for competitive
                } else {
                    roll = getRandomNumber(maxRoll);
                }

                const result = data[category][roll-1];
                resultsDiv.innerHTML += `<p><strong>${category}:</strong> ${roll} - ${result}</p>`;
            }

            // Reset dice
            diceDiv.textContent = "🎲 Done!";
            diceDiv.style.transform = "scale(1) rotate(0deg)";
        }
    }, 80); // 80ms per tick
}

// ===== RANDOM NUMBER FUNCTION =====
function getRandomNumber(max){
    return Math.floor(Math.random()*max)+1;
}

// ===== PNG EXPORT FUNCTION =====
function exportPNG() {
    const resultsDiv = document.getElementById("results");

    if (resultsDiv.innerHTML.trim() === "") {
        alert("Please roll a mission first!");
        return;
    }

    html2canvas(resultsDiv, {
        backgroundColor: "#0b0f1a",
        scale: 2
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "dropfleet_mission.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
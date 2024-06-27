let players = [];
let playerNames = [];

function proceedToNames() {
  const numPlayers = document.getElementById("num-players").value;
  if (numPlayers < 2 || numPlayers > 10) {
    alert("Please enter a number of players between 2 and 10.");
    return;
  }

  const nameInputsDiv = document.getElementById("name-inputs");
  nameInputsDiv.innerHTML = "";
  for (let i = 0; i < numPlayers; i++) {
    nameInputsDiv.innerHTML += `
      <div>
        <label>Player ${i + 1} Name: </label>
        <input type="text" id="player-${i}-name" value="" placeholder="Enter name">
      </div>
    `;
  }

  document.getElementById("start-menu").style.display = "none";
  document.getElementById("name-menu").style.display = "block";
}

function startGame() {
  const numPlayers = document.getElementById("num-players").value;
  players = Array(parseInt(numPlayers)).fill(0);
  playerNames = [];

  for (let i = 0; i < numPlayers; i++) {
    const nameInput = document.getElementById(`player-${i}-name`);
    playerNames.push(nameInput.value || `Player ${i + 1}`);
  }

  displayGameMenu();
}

function displayGameMenu() {
  const playerInputsDiv = document.getElementById("player-inputs");
  playerInputsDiv.innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    playerInputsDiv.innerHTML += `
      <div>
        <label>${playerNames[i]} Points: </label>
        <input type="number" id="player-${i}-points" value="0" min="0">
      </div>
    `;
  }

  document.getElementById("start-menu").style.display = "none";
  document.getElementById("name-menu").style.display = "none";
  document.getElementById("game-menu").style.display = "block";

  updateScores();
}

function calculatePoints() {
  for (let i = 0; i < players.length; i++) {
    const pointsInput = document.getElementById(`player-${i}-points`);
    const points = parseInt(pointsInput.value);
    players[i] += points;
    pointsInput.value = "0";

    if (players[i] >= 500) {
      celebrate(i);
    }
  }

  updateScores();
}

function updateScores() {
  const playerScoresDiv = document.getElementById("player-scores");
  playerScoresDiv.innerHTML = "";
  players.forEach((score, index) => {
    playerScoresDiv.innerHTML += `<div class="player-score">${playerNames[index]}: ${score} points</div>`;
  });
}

function saveGame() {
  const gameData = {
    players: players,
    playerNames: playerNames,
  };

  const json = JSON.stringify(gameData);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "uno_game.json";
  a.click();
  URL.revokeObjectURL(url);
}

function loadGame(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const gameData = JSON.parse(e.target.result);
    players = gameData.players;
    playerNames = gameData.playerNames;

    document.getElementById("num-players").value = players.length;
    displayGameMenu(); // Directly start the game after loading data
  };

  reader.readAsText(file);
}

function celebrate(playerIndex) {
  document.getElementById("celebration").style.display = "flex";
  document.getElementById(
    "winner"
  ).innerText = `${playerNames[playerIndex]} reached 500 points!`;

  const celebrationSound = document.getElementById("celebration-sound");
  celebrationSound.play();

  setTimeout(() => {
    document.getElementById("celebration").style.display = "none";
  }, 5000);
}

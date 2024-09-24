const board = document.getElementById("board");
const diceResult = document.getElementById("dice-result");
const gameStatus = document.getElementById("game-status");
const rollDiceButton = document.getElementById("roll-dice");

const boardSize = 27;
let gameRunning = true;
let currentPlayer = 0;
const totalPlayers = 4;
let playerPositions = [0, 0, 0, 0];
const players = [];

for (let i = 0; i < totalPlayers; i++) {
  const player = document.createElement("div");
  player.className = `player player-${i + 1}`;
  players.push(player);
}

const cards = [
  {
    text: "Ataque DDoS, volte 3 casas.",
    action: (pos) => Math.max(0, pos - 3),
  },
  {
    text: "Virtualização eficiente, avance 2 casas.",
    action: (pos) => Math.min(boardSize - 1, pos + 2),
  },
  {
    text: "Falha no backup, fique 1 rodada sem jogar.",
    action: (pos) => pos,
    skipTurn: true,
  },
  {
    text: "Conexão 5G rápida, role o dado novamente.",
    action: (pos) => pos,
    reroll: true,
  },
  {
    text: "SSD no servidor, avance 2 casas.",
    action: (pos) => Math.min(boardSize - 1, pos + 2),
  },
  {
    text: "Malware detectado, volte 2 casas.",
    action: (pos) => Math.max(0, pos - 2),
  },
];

function createBoard() {
  const startCell = document.createElement("div");
  startCell.className = "cell";
  startCell.innerText = "Início";
  board.appendChild(startCell);

  for (let i = 1; i <= 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = i;
    board.appendChild(cell);
  }

  const endCell = document.createElement("div");
  endCell.className = "cell";
  endCell.innerText = "Fim";
  board.appendChild(endCell);

  for (let i = 0; i < totalPlayers; i++) {
    board.children[0].appendChild(players[i]);
  }
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function movePlayer(spaces) {
  const newPosition = Math.min(
    playerPositions[currentPlayer] + spaces,
    boardSize - 1
  );

  board.children[playerPositions[currentPlayer]].removeChild(
    players[currentPlayer]
  );

  playerPositions[currentPlayer] = newPosition;

  board.children[newPosition].appendChild(players[currentPlayer]);

  if (playerPositions[currentPlayer] === boardSize - 1) {
    gameStatus.innerText = `Parabéns! Jogador ${
      currentPlayer + 1
    } venceu o jogo!`;
    gameRunning = false;
    rollDiceButton.disabled = true;
  } else {
    drawCard();
  }
}

function drawCard() {
  const card = cards[Math.floor(Math.random() * cards.length)];
  gameStatus.innerText = `Jogador ${currentPlayer + 1}: ${card.text}`;

  playerPositions[currentPlayer] = card.action(playerPositions[currentPlayer]);

  board.children[playerPositions[currentPlayer]].appendChild(
    players[currentPlayer]
  );

  if (card.skipTurn) {
    rollDiceButton.disabled = true;
    setTimeout(() => {
      rollDiceButton.disabled = false;
      gameStatus.innerText = "Sua vez de jogar novamente!";
    }, 2000);
  } else if (!card.reroll) {
    nextPlayer();
  } else {
    gameStatus.innerText += " Role o dado novamente!";
  }
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % totalPlayers;
  gameStatus.innerText = `Vez do Jogador ${currentPlayer + 1}`;
}

rollDiceButton.addEventListener("click", () => {
  if (!gameRunning) return;

  const dice = rollDice();
  diceResult.innerText = `Você rolou: ${dice}`;
  movePlayer(dice);
});

createBoard();

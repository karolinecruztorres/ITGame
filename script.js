const board = document.getElementById("board");
const diceResult = document.getElementById("dice-result");
const gameStatus = document.getElementById("game-status");
const rollDiceButton = document.getElementById("roll-dice");

let playerPosition = 0;
const boardSize = 25;
const player = document.createElement("div");
player.className = "player";
let gameRunning = true;

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
  for (let i = 0; i < boardSize; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = i + 1;
    board.appendChild(cell);
  }
  board.children[0].appendChild(player);
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function movePlayer(spaces) {
  const newPosition = Math.min(playerPosition + spaces, boardSize - 1);
  board.children[playerPosition].removeChild(player);
  playerPosition = newPosition;
  board.children[playerPosition].appendChild(player);

  if (playerPosition === boardSize - 1) {
    gameStatus.innerText = "Parabéns! Você venceu o jogo!";
    gameRunning = false;
    rollDiceButton.disabled = true;
  } else {
    drawCard();
  }
}

function drawCard() {
  const card = cards[Math.floor(Math.random() * cards.length)];
  gameStatus.innerText = card.text;

  playerPosition = card.action(playerPosition);

  board.children[playerPosition].appendChild(player);

  if (card.skipTurn) {
    rollDiceButton.disabled = true;
    setTimeout(() => {
      rollDiceButton.disabled = false;
      gameStatus.innerText = "Sua vez de jogar novamente!";
    }, 2000);
  } else if (card.reroll) {
    gameStatus.innerText += " Role o dado novamente!";
  }
}

rollDiceButton.addEventListener("click", () => {
  if (!gameRunning) return;

  const dice = rollDice();
  diceResult.innerText = `Você rolou: ${dice}`;
  movePlayer(dice);
});

createBoard();

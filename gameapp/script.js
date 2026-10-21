
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const scoreDrawText = document.getElementById("scoreDraw");

const instructions = document.getElementById("instructions");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

let scores = {
  X: 0,
  O: 0,
  draw: 0
};

function findWinner() {
  for (const line of winningLines) {
    const [a, b, c] = line;

    if (
      board[a] !== "" &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      return line;
    }
  }

  return null;
}

function updateScores() {
  scoreXText.textContent = scores.X;
  scoreOText.textContent = scores.O;
  scoreDrawText.textContent = scores.draw;
}

function playTurn(event) {
  const index = Number(event.currentTarget.dataset.index);

  if (gameOver || board[index] !== "") {
    return;
  }

  board[index] = currentPlayer;

  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;

  const winningLine = findWinner();

  if (winningLine) {
    gameOver = true;
    scores[currentPlayer]++;

    winningLine.forEach(i => {
      cells[i].classList.add("winner");
    });

    statusText.textContent = `Player ${currentPlayer} wins! 🎉`;
    cells.forEach(button => button.disabled = true);
    updateScores();
    return;
  }

  if (board.every(value => value !== "")) {
    gameOver = true;
    scores.draw++;
    statusText.textContent = "It's a draw!";
    updateScores();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function newGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("x", "o", "winner");
  });

  statusText.textContent = "Player X's turn";
}

function resetScores() {
  scores = {
    X: 0,
    O: 0,
    draw: 0
  };

  updateScores();
  newGame();
}

cells.forEach(cell => {
  cell.addEventListener("click", playTurn);
});

document.getElementById("newGame")
  .addEventListener("click", newGame);

document.getElementById("resetScores")
  .addEventListener("click", resetScores);

document.getElementById("howToPlay")
  .addEventListener("click", () => {
    instructions.hidden = !instructions.hidden;
  });

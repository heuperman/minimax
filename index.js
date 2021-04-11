const boardElement = document.getElementById("board");
const infoElement = document.getElementById("info");
const resetButtonElement = document.getElementById("reset-button");

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const tiles = [];
const computerPlayer = "X";
let currentPlayer = "X";
infoElement.innerText = `Turn: ${currentPlayer}`;

resetButtonElement.addEventListener("click", () => {
  tiles.forEach((tile) => {
    tile.innerText = "";
  });
  currentPlayer = "X";
  infoElement.innerText = `Turn: ${currentPlayer}`;
  makeComputerPlay();
});

const isWin = (state, player) => {
  const winningCombination = winningCombinations.find((combo) => {
    return combo.every((index) => state[index] === player);
  });
  return !!winningCombination;
};

const isDraw = (state) => {
  return !state.some((item) => item === "");
};

const checkWinner = (state) => {
  if (isWin(state, "X")) return "X";
  if (isWin(state, "O")) return "O";
  if (isDraw(state)) return "draw";
};

const markTile = (tile, player) => {
  if (tile.innerText === "") {
    tile.innerText = player;

    const winner = checkWinner(tiles.map((tile) => tile.innerText));

    if (winner) {
      infoElement.innerText =
        winner === "draw" ? "It's a draw!" : `${winner} wins!`;
      return;
    }

    currentPlayer = player === "X" ? "O" : "X";
    infoElement.innerText = `Turn: ${currentPlayer}`;

    if (currentPlayer === computerPlayer) {
      makeComputerPlay();
    }
  }
};

[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(() => {
  const tile = document.createElement("button");
  tile.className = "tile";
  tile.onclick = () => markTile(tile, currentPlayer);
  tiles.push(tile);
  boardElement.appendChild(tile);
});

const scores = { X: 100, O: -100, draw: 0 };

const minimax = (state, depth, max) => {
  let score;
  const winner = checkWinner(state);
  if (winner !== undefined) {
    score = scores[winner] - depth;
    return score;
  }

  if (max) {
    let bestScore = -Infinity;
    state.forEach((item, index) => {
      if (item === "") {
        const newState = [...state];
        newState[index] = computerPlayer;
        const score = minimax(newState, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    state.forEach((item, index) => {
      if (item === "") {
        const newState = [...state];
        newState[index] = "O";
        const score = minimax(newState, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
};

const getBestMove = () => {
  let bestScore = -Infinity;
  let bestMove;
  const state = tiles.map((tile) => tile.innerText);
  state.forEach((item, index) => {
    if (item === "") {
      const newState = [...state];
      newState[index] = computerPlayer;
      const score = minimax(newState, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  });
  return bestMove;
};

const makeComputerPlay = () => {
  markTile(tiles[getBestMove()], computerPlayer);
};

makeComputerPlay();

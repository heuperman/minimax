const boardElement = document.getElementById("board");
const infoElement = document.getElementById("info");
const resetButtonElement = document.getElementById("reset-button");
const faviconElement = document.getElementById("favicon");

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

const players = {
  one: "X",
  two: "O",
};

const colors = {
  [players.one]: "#6699CC",
  [players.two]: "#F99157",
};

const emptyTile = "";

const switchPlayer = (player) =>
  player === players.one ? players.two : players.one;

const setFavicon = (symbol) => {
  faviconElement.href = `favicon-${symbol}.png`;
};

const tiles = [];
let computerPlayer = players.one;
let currentPlayer = players.one;
infoElement.innerText = `YOU ARE ${switchPlayer(computerPlayer)}`;
setFavicon(switchPlayer(computerPlayer).toLowerCase());

resetButtonElement.addEventListener("click", () => {
  tiles.forEach((tile) => {
    tile.innerText = emptyTile;
    tile.disabled = false;
  });
  currentPlayer = players.one;
  computerPlayer = switchPlayer(computerPlayer);
  setFavicon(switchPlayer(computerPlayer).toLowerCase());
  infoElement.innerText = `YOU ARE ${switchPlayer(computerPlayer)}`;
  if (currentPlayer === computerPlayer) {
    makeComputerPlay();
  }
});

const isWin = (state, player) => {
  const winningCombination = winningCombinations.find((combo) => {
    return combo.every((index) => state[index] === player);
  });
  return !!winningCombination;
};

const isDraw = (state) => {
  return !state.some((item) => item === emptyTile);
};

const checkWinner = (state) => {
  if (isWin(state, players.one)) return players.one;
  if (isWin(state, players.two)) return players.two;
  if (isDraw(state)) return "draw";
};

const markTile = (tile, player) => {
  tile.innerText = player;
  tile.style.color = colors[player];
  tile.disabled = true;

  const winner = checkWinner(tiles.map((tile) => tile.innerText));

  if (winner) {
    let text = winner === "draw" ? "IT'S A DRAW!" : "YOU WIN!";
    if (winner === computerPlayer) text = "COMPUTER WINS!";
    infoElement.innerText = text;

    tiles.forEach((tile) => (tile.disabled = true));
  } else {
    currentPlayer = switchPlayer(player);
    if (currentPlayer === computerPlayer) makeComputerPlay();
  }
};

[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(() => {
  const tile = document.createElement("button");
  tile.className = "tile";
  tile.onclick = () => markTile(tile, currentPlayer);
  tiles.push(tile);
  boardElement.appendChild(tile);
});

const getScore = (winner, depth) => {
  let score = 0 - depth;
  if (winner === switchPlayer(computerPlayer)) score = -100 + depth;
  if (winner === computerPlayer) score = 100 - depth;
  return score;
};

const minimax = (state, depth, alpha, beta, max) => {
  let score;
  const winner = checkWinner(state);
  if (winner !== undefined) {
    score = getScore(winner, depth);
    return score;
  }

  let bestScore = max ? -Infinity : Infinity;
  for (const [index, item] of state.entries()) {
    if (item === emptyTile) {
      const newState = [...state];
      newState[index] = max ? computerPlayer : switchPlayer(computerPlayer);
      const score = minimax(newState, depth + 1, alpha, beta, !max);
      bestScore = max ? Math.max(score, bestScore) : Math.min(score, bestScore);

      if (max) alpha = Math.max(alpha, score);
      if (!max) beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
  }
  return bestScore;
};

const getBestMove = () => {
  let bestScore = -Infinity;
  let bestMove;
  const state = tiles.map((tile) => tile.innerText);
  state.forEach((item, index) => {
    if (item === emptyTile) {
      const newState = [...state];
      newState[index] = computerPlayer;
      const score = minimax(newState, 0, -Infinity, Infinity, false);
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

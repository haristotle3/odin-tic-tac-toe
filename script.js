const GameBoard = (function () {
  const EMPTY = 0;
  const X = -1;
  const O = +1;

  const grid = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];

  const markCell = function (index, player) {
    if (grid[index] === EMPTY) {
      grid[index] = player.token === "X" ? X : O;
      return 1;
    } else return 0;
  };

  const getBoard = () => grid;
  const xValue = () => X;
  const oValue = () => O;
  const emptyValue = () => EMPTY;

  return { getBoard, markCell, xValue, oValue, emptyValue };
})();

const Player = function (tokenCharacter = "*", name = "Player") {
  const rename = function (newName) {
    this.name = newName;
  };
  return { name, token: tokenCharacter, rename };
};

const GameController = (function () {
  const player1 = Player("X", "Player 1");
  const player2 = Player("O", "Player 2");
  const MAX_TURNS = 8;

  let turnNumber = 0;
  let activePlayer = player1;

  const playRound = (index) => {
    if (GameBoard.markCell(index, activePlayer)) {
      if (playerWins(player1)) {
        console.log(`Player 1 wins!`);
        return 1;
      }
      if (playerWins(player2)) {
        console.log(`Player 2 wins!`);
        return 1;
      }
      if (isTie()) {
        console.log(`Tie`);
        return 1;
      }

      switchPlayer();
      incTurn();
      return 0;
    } else {
      return 0;
    }
  };

  const incTurn = () => turnNumber++;
  const getTurn = () => turnNumber;

  const playerWins = (player) => {
    const marker =
      player.token === "X" ? GameBoard.xValue() : GameBoard.oValue();

    const board = GameBoard.getBoard();
    const winLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of winLines) {
      let win = true;

      for (let cellIndex of line) {
        if (board[cellIndex] != marker) {
          win = false;
          break;
        }
      }

      if (win) return true;
    }

    return false;
  };

  const isTie = () => {
    if (getTurn() === MAX_TURNS) return true;
    return false;
  };

  const switchPlayer = () => {
    activePlayer = activePlayer.token === player1.token ? player2 : player1;
  };

  const getPlayer = (number) => (number === 1 ? player1 : player2);

  return { playRound, getPlayer };
})();

const displayController = (function () {
  const cellContainer = document.querySelector(".cells-container");

  const startBtn = document.querySelector("#start");
  const restartBtn = document.querySelector("#restart");

  const playerOneChangeNameButton = document.querySelector(
    ".player-card.player-1 button"
  );
  const playerTwoChangeNameButton = document.querySelector(
    ".player-card.player-2 button"
  );

  const dialog = document.querySelector("dialog");
  const dialogFormSubmit = document.querySelector("dialog form button");

  const playerOneHeading = document.querySelector(".player-card.player-1 h4");
  const playerTwoHeading = document.querySelector(".player-card.player-2 h4");

  playerOneHeading.textContent = GameController.getPlayer(1).name;
  playerTwoHeading.textContent = GameController.getPlayer(2).name;

  playerOneChangeNameButton.addEventListener("click", () => {
    const hiddenInput = document.querySelector("dialog form > input");
    hiddenInput.value = 1;
    dialog.showModal();
  });

  playerTwoChangeNameButton.addEventListener("click", () => {
    const hiddenInput = document.querySelector("dialog form > input");
    hiddenInput.value = 2;
    dialog.showModal();
  });

  dialogFormSubmit.addEventListener("click", () => {
    const newName = document.querySelector("dialog form label input").value;
    const playerNumber = document.querySelector("dialog form > input").value;
    console.log(playerNumber);
    GameController.getPlayer(playerNumber).rename(newName);

    if (playerNumber === "1")
      playerOneHeading.textContent =
        GameController.getPlayer(playerNumber).name;
    else
      playerTwoHeading.textContent =
        GameController.getPlayer(playerNumber).name;

    dialog.close();
  });
  
})();

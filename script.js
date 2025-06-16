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
  let result = -1;

  const playRound = (index) => {
    if (GameBoard.markCell(index, activePlayer)) {
      if (playerWins(player1)) {
        // player1 wins
        setResult(1);
        return 1;
      }
      if (playerWins(player2)) {
        // player2 wins
        setResult(2);
        return 2;
      }
      if (isTie()) {
        // tie
        setResult(0);
        return 0;
      }

      switchPlayer();
      incTurn();
      return 200;
    } else return -1;
  };

  const incTurn = () => turnNumber++;
  const getTurn = () => turnNumber;
  const getActivePlayerToken = () => activePlayer.token;
  const setResult = (res) => {
    result = res;
  };
  const getResult = () => result;

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

  return { playRound, getPlayer, getActivePlayerToken, getResult };
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
    const playerNumber = Number(
      document.querySelector("dialog form > input").value
    );

    GameController.getPlayer(playerNumber).rename(newName);
    console.log(
      GameController.getPlayer(1).name,
      GameController.getPlayer(2).name
    );

    if (playerNumber === 1)
      playerOneHeading.textContent =
        GameController.getPlayer(playerNumber).name;
    else
      playerTwoHeading.textContent =
        GameController.getPlayer(playerNumber).name;

    dialog.close();
  });

  startBtn.addEventListener("click", () => {
    if (GameController.getResult() != -1) return;

    const gameEnabledStyling = function () {
      const cellsContainer = document.querySelector("main .cells-container");
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(
        `
        main .cells-container button:hover {
          background-color: rgb(228, 228, 228);
        }`,
        12
      );
      cellsContainer.style.backgroundColor = "rgba(0,0,0,1)";
    };

    const gameDisableStyling = function () {
      const cellsContainer = document.querySelector("main .cells-container");
      const styleSheet = document.styleSheets[0];
      styleSheet.deleteRule(12);
      cellsContainer.style.backgroundColor = "rgba(0,0,0,0.2)";
    };

    gameEnabledStyling();

    cellContainer.addEventListener("click", function handleGridClicks(e) {
      if (e.target.id === "grid-gap") return; // there are gaps in the grid cell.
      const cellNumber = e.target.id;
      const cell = document.getElementById(cellNumber);
      const token = GameController.getActivePlayerToken();

      const rv = GameController.playRound(Number(cellNumber));
      const resultHeading = document.querySelector(".results h1");
      console.log(
        GameController.getPlayer(1).name,
        GameController.getPlayer(2).name
      );

      switch (rv) {
        case -1:
          return;
        case 200:
          cell.textContent = token;
          break;
        case 1:
          cell.textContent = token;
          // mistake here
          resultHeading.textContent = `🎉 ${
            GameController.getPlayer(1).name
          } WINS! 🎉`;
          cellContainer.removeEventListener("click", handleGridClicks);
          gameDisableStyling();
          break;
        case 2:
          cell.textContent = token;
          // mistake here
          resultHeading.textContent = `🎉 ${
            GameController.getPlayer(2).name
          } WINS! 🎉`;
          cellContainer.removeEventListener("click", handleGridClicks);
          gameDisableStyling();
          break;
        case 0:
          cell.textContent = token;
          resultHeading.textContent = "🏳️ TIE! 🏳️";
          cellContainer.removeEventListener("click", handleGridClicks);
          gameDisableStyling();
          break;
      }
    });
  });
})();

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
  return { name, token: tokenCharacter };
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

  return { playRound };
})();


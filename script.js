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

  return { getBoard, markCell };
})();

const Player = function (tokenCharacter = "*", name = "Player") {
  return { name, token: tokenCharacter };
};

const GameController = (function () {
  const player1 = Player("X", "Player 1");
  const player2 = Player("O", "Player 2");

  let activePlayer = player1;

  const playRound = (index) => {
    if (GameBoard.markCell(index, activePlayer)) {
      switchPlayer();
      return 1;
    } else {
      return 0;
    }
  };

  const switchPlayer = () => {
    activePlayer = activePlayer.token === player1.token ? player2 : player1;
  };

  return { playRound };
})();

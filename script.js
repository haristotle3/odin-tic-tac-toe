const GameBoard = (function () {
  const EMPTY = 0;
  const X = -1;
  const O = +1;

  const grid = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];

  const markCell = function (index, player) {
    if (grid[index] === EMPTY) grid[index] = player.token === "X" ? X : O;
  };

  const getBoard = () => grid;

  return { getBoard, markCell };
})();



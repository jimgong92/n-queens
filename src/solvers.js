/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = new Board({n:n});
  var nQueens = 0;

  for (var r = 0; r < n; r++) {
    for (var c = 0; c < n; c++) {
      solution.togglePiece(r, c);
      nQueens++;
      if (solution.hasAnyRooksConflicts()) {
        solution.togglePiece(r, c);
        nQueens--;
      }
    }
  }
  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  //rowIndex = rows below taken row
  var solutionCount = 0;
  function subBoard (rowIndex, board) {
    if(rowIndex === n - 1) {
       solutionCount++;
       return;
    }
    var oldBoard = board.rows();
    var tempBoard = new Board(oldBoard);
    for (var c = 0; c < n; c++) {
      tempBoard.togglePiece(rowIndex, c);
      if (!tempBoard.hasAnyRooksConflicts()) {
        rowIndex++;
        subBoard(rowIndex, tempBoard);
        rowIndex--;
      }
      tempBoard.togglePiece(rowIndex, c);
    }
  }
  subBoard(0, new Board({n:n}));
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

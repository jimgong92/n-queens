// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },
    countActivePieces: function() {
      var arr = this.rows();
      var count = 0;
      for (var r = 0; r < arr.length; r++) {
        for (var c = 0; c < arr.length; c++) {
          if (arr[r][c] > 0) count++;
        }
      }
      return count;
    },
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },
    hasAnyRookConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) || this.hasColConflictAt(colIndex)
      );
    },
    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },
    hasUpperConflictAt: function(rowIndex, colIndex) {
      return this.hasUpperDiagonalConflictAt(rowIndex, colIndex) || this.hasUpperColumnConflictAt(rowIndex, colIndex);
    },
    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var arr = this.rows()[rowIndex];
      var first = false;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] > 0) {
          if (first) return true;
          else first = true;
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rows = this.rows();
      for(var i = 0; i<rows.length; i++) {
        if (this.hasRowConflictAt(i)) return true;
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var first = false;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i][colIndex] === 1) {
          if (first) return true;
          else first = true;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      for (var c = 0; c < rows.length; c++) {
        if (this.hasColConflictAt(c)) return true;
      }
      return false;
    },

    //Only checks for diagonal conflict above
    hasUpperDiagonalConflictAt: function(row, col) {
      var arr = this.rows();
      var leftCol = col - 1;
      var rightCol = col + 1;
      for (var r = row - 1; r >= 0; r--) {
        if (leftCol > -1) {
          if(arr[r][leftCol--] > 0) return true;
        }
        if (rightCol < arr.length) {
          if(arr[r][leftCol++] > 0) return true;
        }
      }
      return false;
    },
    hasUpperColumnConflictAt: function(row, col) {
      var arr = this.rows();
      for (var r = row - 1; r >= 0; r--) {
        if (arr[r][col] > 0) return true;
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var diagIndex = majorDiagonalColumnIndexAtFirstRow;
      var arr = this.rows();
      var length = arr.length - Math.abs(diagIndex);
      var first = false;
      for (var i = 0; i < length; i++) {
        if (arr[i][i + diagIndex] === 1) {
          if (first) return true;
          else first = true;
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if(this.hasMajorDiagonalConflictAt(i)) return true;
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var diagIndex = minorDiagonalColumnIndexAtFirstRow;
      var arr = this.rows();
      var length = diagIndex + 1;
      var first = false;
      for (var i = 0; i <= length; i++) {
        if (arr[i][length - i] === 1) {
          if (first) return true;
          else first = true;
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if(this.hasMinorDiagonalConflictAt(i)) return true;
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

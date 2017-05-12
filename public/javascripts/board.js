var Board = (function($, Cell) {
	var Board = function(args) {
		this.updateData(args);
		this.buildBoard();
	}

	Board.prototype.buildBoard = function() {
		var board_el = this.settings.board_el;

		for (var row = 0; row < this.settings.size_y; row++ ) {
			var tr = $('<tr></tr>');
			board_el.append(tr);

			for (var col = 0; col < this.settings.size_x; col++ ) {
				var td = $('<td></td>');
				var player = this.grid_data[row][col].player;

				var cell = new Cell({
					x: col,
					y: row,
					owned_by: player
				});
				
				if (!this.grid[row]) {
					this.grid[row] = [];
				}

				this.grid[row][col] = cell;

				td.append(cell.element);
				tr.append(td);
			}
		}
	}

	Board.prototype.updateData = function( args ) {
		var defaults = {
			size_x: 7,
			size_y: 7,
			players: 2,
			board_el: $('#board')
		}

		this.settings = args;
		this.grid = [];
		this.grid_data = args.grid;

		for (var prop in defaults) {
			if (prop in this.settings) { continue; }
			this.settings[prop] = defaults[prop];
		}
	}

	Board.prototype.updateBoard = function( data ) {
		this.settings.board_el.html("");
		this.updateData(data.board);
		this.buildBoard();
	}

	Board.prototype.showBoard = function() {
		$('#board').show();
	}

	return Board;
})(jQuery, Cell);
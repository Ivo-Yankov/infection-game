var Cell = (function($) {
	var Cell = function(args) {
		this.x = args.x || 0;
		this.y = args.y || 0;
		this.owned_by = args.owned_by || 0;
		this.build();
	}

	Cell.prototype.build = function() {
		var self = this;
		var $el = $('<div class="cell"></div>');
		this.element = $el;

		if (this.owned_by) {
			$el.addClass('player-' + this.owned_by);
		}
		else {
			$el.addClass('empty');	
		}

		$el.on('mouseenter', function() {
			$this = $(this);

			var highlight_owned_cell = !window.selected_piece && $this.hasClass('player-' + window.player_number);
			var highlight_neutral_cell = window.selected_piece && $this.hasClass('empty') && (self.getMoveDistance() <= 2);

			if (window.my_turn && ( highlight_owned_cell || highlight_neutral_cell) ) {
				$this.addClass('possible-move');
			}
		});

		$el.on('mouseleave', function() {
			$(this).removeClass('possible-move');
		});

		$el.on('click', function() {
			$this = $(this);
			var piece_is_owned = $this.hasClass('player-' + window.player_number);
			var cell_is_empty = $this.hasClass('empty');
			if ( piece_is_owned ) {
				$('.selected-piece').removeClass('selected-piece');
				if ( window.selected_piece === self ) {					
					window.selected_piece = null;
				}
				else {
					window.selected_piece = self;
					$this.addClass('selected-piece');
				}
			}
			else if ( cell_is_empty ) {
				self.moveToHere();
			}
		});
	}

	Cell.prototype.getMoveDistance = function() {
		if ( ! window.selected_piece ) {
			return 1000;
		}
		else {
			//Calculate the distance
			var distance_x = Math.abs(window.selected_piece.x - this.x);
			var distance_y = Math.abs(window.selected_piece.y - this.y);
			
			return Math.max(distance_x, distance_y);
		}
	}

	Cell.prototype.moveToHere = function() {
		if ( ! window.selected_piece ) {
			console.log('no selected piece!');
			return false;
		}
		var distance = this.getMoveDistance();

		if ( distance <= 2 ) {
			window.socketHandler.makeMove(window.selected_piece, this);
			$('.selected-piece').removeClass('selected-piece');
			$('.possible-move').removeClass('possible-move');
			window.selected_piece = null;
		}
	}

	return Cell;
})(jQuery);
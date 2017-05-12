var SocketHandler = (function($, io) {
	handler = function() {
		this.socket = io();

		this.socket.on('game started', function( data ) {
			window.board = new Board(data.board);
			window.board.showBoard();
			window.menu.close();

			console.log('game started', data);
		});

		this.socket.on('assign player number', function( number ) {
			console.log('You are player', number);
			window.player_number = number;
		});

		this.socket.on('player turn', function( player_to_move ) {
			if (window.player_number == player_to_move) {
				window.my_turn = true;
				$('#my-turn-msg').show();
			}
			else {
				window.my_turn = false;	
				$('#my-turn-msg').hide();
			}
		});

		this.socket.on('update board', function( data ) {
			window.board.updateBoard(data);
			console.log("UPDATE THE BOARD!!!", data);
		});

		this.socket.on('invalid move', function( msg ) {
			console.log(msg);
		});

		this.socket.on('refresh lobbies', function( data ) {
			console.log('refresh lobbies', data);
			window.menu.refreshLobbies(data);
		});

		this.socket.on('lobby joined', function() {
			console.log('lobby joined');
			window.menu.openPage('lobby');
		});

		this.socket.on('refresh lobby', function( data ) {
			window.menu.refreshLobby(data);
			// populate the lobby screen with data
		});
	}

	handler.prototype.subscribeToGameList = function() {
		console.log('subscribeToGameList');
		this.socket.emit('listen for lobbies');
	}

	handler.prototype.unsubscribeFromGameList = function() {
		console.log('unsubscribeFromGameList');
		this.socket.emit('stop listening for lobbies');
	}

	handler.prototype.createGame = function( args ) {
		this.socket.emit('create game', args);
	}

	handler.prototype.startGame = function( args ) {
		this.socket.emit('start game', args);
	}

	handler.prototype.joinGame = function( lobby_id ) {
		this.socket.emit('join lobby', lobby_id);
	}

	handler.prototype.makeMove = function( target, destination ) {
		console.log('sending move request');
		this.socket.emit('make move', {
			target: target,
			destination: destination,
			player_number: window.player_number
		});	
	}

	return handler;
})(jQuery, io);
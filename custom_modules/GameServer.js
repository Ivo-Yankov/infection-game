var Board = require('./Board.js');
var Player = require('./Player.js');

GameServer = function (args) {
    this.app = args.app;
    this.id = args.hostSocket.id;
    this.hostSocket = args.hostSocket;
    this.players = [];
    this.hostSocket.server = this;

    if (args.lobby) {
        for (var i = 0; i < args.lobby.players.length; i++) {
            var player_args = {
                type: args.lobby.players[i].type,
                number: i + 1
            };

            if (args.lobby.players[i].socket) {
                player_args.socket = args.lobby.players[i].socket;
            }

            this.addPlayer(new Player(player_args));
        }
    }
    else {
        this.addPlayer(new Player({
                type: "human",
                socket: args.hostSocket,
                number: 1
            })
        );

        args.ai_players = args.ai_players || 0;
        for (var i = 0; i < args.ai_players; i++) {
            this.addPlayer(new Player({
                    type: "ai",
                    number: this.players.length + 1
                })
            );
        }
    }

    this.startGame(args);
};

GameServer.prototype.addPlayer = function (player) {
    this.players.push(player);
    if (player.socket) {
        player.socket.server = this;
        player.socket.emit('assign player number', player.number);
    }
};

GameServer.prototype.getData = function () {
    var players = [];
    for (var i = 0; i < this.players.length; i++) {
        players.push(this.players[i].getData());
    }

    return {
        board: this.board.getData(),
        players: players
    }
};

GameServer.prototype.validateMove = function (cell1, cell2, player_number) {
    var player = this.getPlayer(player_number);
    if (player.to_move) {
        var distance = this.board.getCellDistance(cell1, cell2);

        if (cell1.player === player_number && cell2.player === 0 && distance <= 2) {
            return true;
        }
    }

    return false;
};

GameServer.prototype.assignNextPlayer = function () {
    var next_player_index = 0;

    for (i = 0; i < this.players.length; i++) {
        if (this.players[i].to_move) {
            this.players[i].to_move = false;
            if (this.players[i + 1]) {
                next_player_index = i + 1;
            }
            break;
        }
    }

    this.players[next_player_index].to_move = true;
    this.emit("player turn", this.players[next_player_index].number);
};

GameServer.prototype.makeMove = function (target, destination, player_number, socket) {
    var cell1 = this.board.grid[target.y][target.x];
    var cell2 = this.board.grid[destination.y][destination.x];

    if (!this.validateMove(cell1, cell2, player_number)) {
        socket.emit('invalid move', "Your move is not valid");
    }
    else {
        var distance = this.board.getCellDistance(cell1, cell2);

        // The target piece is removed
        if (distance === 2) {
            cell1.player = 0;
        }

        cell2.player = player_number;

        var dest_x = destination.x;
        var dest_y = destination.y;

        // Capture neighbour pieces
        for (var y = 0; y < this.board.grid.length; y++) {
            for (var x = 0; x < this.board.grid[y].length; x++) {

                // If the cell is a neighbour
                if ((x === dest_x || x === dest_x + 1 || x === dest_x - 1) &&
                    (y === dest_y || y === dest_y + 1 || y === dest_y - 1)) {

                    var cell = this.board.grid[y][x];
                    if (cell.player !== 0 && cell.player !== player_number) {
                        cell.player = player_number;
                    }
                }
            }
        }

        this.assignNextPlayer();
        this.emit('update board', this.getData());

        if (this.gameIsOver()) {
            this.endGame();
        }
    }
};

GameServer.prototype.emit = function (event, data) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].socket) {
            this.players[i].socket.emit(event, data);
        }
    }
};

GameServer.prototype.getPlayer = function (player_number) {
    if (this.players[player_number - 1]) {
        return this.players[player_number - 1];
    }

    return null;
};

GameServer.prototype.removePlayer = function (player_id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i] && this.players[i].id === player_id) {
            this.players.splice(i, 1);
            return;
        }
    }
};

GameServer.prototype.getPlayerBySocketId = function (socket_id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].socket && this.players[i].socket.id === socket_id) {
            return this.players[i];
        }
    }

    return null;
};

GameServer.prototype.startGame = function (args) {
    this.board = new Board(args);

    // Do this some other way
    if (this.players.length === 2) {
        this.board.grid[0][0].player = 1;
        this.board.grid[this.board.size_y - 1][this.board.size_x - 1].player = 1;

        this.board.grid[this.board.size_y - 1][0].player = 2;
        this.board.grid[0][this.board.size_x - 1].player = 2;
    }

    this.assignNextPlayer();
};

GameServer.prototype.gameIsOver = function () {
    var grid = this.board.grid;
    var empty_cells = 0;
    var players_score = {};
    var remaining_players = 0;
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            if (!grid[y][x].player) {   // The cell is still empty
                empty_cells++;
            }
            else {
                if (!players_score[grid[y][x].player]) {
                    remaining_players++;
                    players_score[grid[y][x].player] = 1;
                }
                else {
                    players_score[grid[y][x].player]++;
                }
            }
        }
    }

    // The game ends when there are no empty cells or when there is only 1 player left
    return remaining_players === 1 || !empty_cells;
};

GameServer.prototype.endGame = function () {
    this.emit('game over', this.getResults());
};

GameServer.prototype.getResults = function () {
    return {
        winner: 1
    };
};

module.exports = GameServer;
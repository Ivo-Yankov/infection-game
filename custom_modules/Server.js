var Board = require('./Board.js');
var Player = require('./Player.js');

Server = function (args) {
    this.app = args.app;
    this.id = args.hostSocket.id;
    this.hostSocket = args.hostSocket;
    this.players = [];
    this.hostSocket.server = this;
    this.started = false;

    this.addPlayer({
        type: 'human',
        socket: args.hostSocket
    });

    this.startGame(args);
};

Server.prototype.addPlayer = function (args) {
    var player = new Player(args);
    this.players.push(player);
    this.emit('refresh lobby', this.getData());

    if (player.socket) {
        player.socket.server = this;
        player.socket.emit('assign player number', player.number);
    }
};

Server.prototype.removePlayer = function (player_id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i] && this.players[i].id === player_id) {
            this.players.splice(i, 1);
            return;
        }
    }
};

Server.prototype.getData = function () {
    var players = [];
    for (var i = 0; i < this.players.length; i++) {
        players.push(this.players[i].getData());
    }

    return {
        id: this.id,
        board: this.board.getData(),
        players: players
    }
};



Server.prototype.emit = function (event, data) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].socket) {
            this.players[i].socket.emit(event, data);
        }
    }
};
Server.prototype.getPlayer = function (player_number) {
    if (this.players[player_number - 1]) {
        return this.players[player_number - 1];
    }

    return null;
};

Server.prototype.getPlayerBySocketId = function (socket_id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].socket && this.players[i].socket.id === socket_id) {
            return this.players[i];
        }
    }

    return null;
};

Server.prototype.startGame = function() {
    this.started = true;
    this.emit('game created', this.getData());
};

module.exports = Server;
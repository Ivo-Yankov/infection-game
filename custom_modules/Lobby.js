var Player = require('./Player.js');
var GameServer = require('./GameServer.js');

var Lobby = function (args) {
    this.app = args.app;
    this.id = args.hostSocket.id;
    this.players = [];

    this.addPlayer({
        type: 'human',
        socket: args.hostSocket
    })
};

Lobby.prototype.addPlayer = function (args) {
    var player_args = {type: args.type};

    var lobby_data;

    if (args.socket) {
        if (this.getPlayerBySocketId(args.socket.id)) {
            lobby_data = this.getData();
            this.emit('refresh lobby', lobby_data);
            return;
        }

        player_args.socket = args.socket;
    }

    var player = new Player(player_args);

    this.players.push(player);
    lobby_data = this.getData();
    this.emit('refresh lobby', lobby_data);
};

Lobby.prototype.removePlayer = function (player_id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i] && this.players[i].id === player_id) {
            this.players.splice(i, 1);
            return;
        }
    }
};

Lobby.prototype.startGame = function (args) {
    var server = new GameServer({
        app: this.app,
        hostSocket: this.hostSocket,
        players: this.players
    });

    this.emit('game created', server.getData());
};

Lobby.prototype.getData = function () {
    var players = [];
    for (var i = 0; i < this.players.length; i++) {
        players.push(this.players[i].getData());
    }

    return {
        id: this.id,
        players: players
    }
};

Lobby.prototype.emit = function (event, data) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].socket) {
            this.players[i].socket.emit(event, data);
        }
    }
};

Lobby.prototype.getPlayerBySocketId = function (socket_id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].socket && this.players[i].socket.id === socket_id) {
            return this.players[i];
        }
    }

    return null;
};

module.exports = Lobby;
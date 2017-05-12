var Server = require('./Server.js');

SocketEventHandler = function (args) {

    var io = args.io;
    var app = args.app;
    var eventEmitter = args.eventEmitter;

    io.on('connection', function (socket) {
        console.log('a user has connected');

        socket.on('create game', function () {
            var lobby = new Lobby({
                app: app,
                hostSocket: socket,
                eventEmitter: eventEmitter
            });
            app.lobbies.push(lobby);

            app.lobbyListeners.update(servers.getLobbiesList());
        });

        socket.on('join lobby', function (id) {
            for (var i in app.lobbies) {
                if (app.lobbies.hasOwnProperty(i) && app.lobbies[i].id === id) {
                    app.lobbies[i].addPlayer({
                        type: "human",
                        socket: socket
                    });
                }
            }
        });

        socket.on('start game', function (args) {
            var lobby = null;

            for (var i = 0; i < app.lobbies.length; i++) {
                if (app.lobbies[i].id === args.lobby.id) {
                    lobby = app.lobbies[i];
                }
            }

            var server = new Server({
                app: app,
                hostSocket: socket,
                lobby: lobby
            });

            app.servers.push(server);

            server.emit('game started', server.getData());
        });

        socket.on('make move', function (data) {
            socket.server.makeMove(data.target, data.destination, data.player_number, socket);
        });

        socket.on('listen for lobbies', function () {
            app.lobbyListeners.push(socket);
            app.lobbyListeners.update(servers.getLobbiesList());
        });

        socket.on('stop listening for lobbies', function () {
            removeFromLobbyListeners(socket);
        });

        socket.on('join lobby', function (lobby_id) {
            console.log("lobby_id", lobby_id);
            var lobby = getLobby(lobby_id);
            if (lobby) {
                lobby.addPlayer({
                    type: 'human',
                    socket: socket
                });

                socket.emit('lobby joined');
                lobby.emit('refresh lobby', lobby.getData());
            }
        });

        socket.on('add ai to lobby', function (lobby_id) {
            var lobby = getLobby(lobby_id);
            if (socket.id === lobby.hostSocket.id) {
                lobby.addPlayer({
                    type: 'ai'
                })
            }
        });

        socket.on('disconnect', function () {
            console.log('Got disconnect!');

            for (var i = 0; i < app.lobbies.length; i++) {
                var player = app.lobbies[i].getPlayerBySocketId(socket.id);
                if (player) {
                    app.lobbies[i].removePlayer(player.id);
                    app.lobbies[i].emit('player left lobby', socket.id);

                    if (!app.lobbies[i].players.length) {
                        // Lobby is empty
                    }
                    return;
                }
            }

            for (var i = 0; i < app.servers.length; i++) {
                var player = app.servers[i].getPlayerBySocketId(socket.id);
                if (player) {
                    app.servers[i].removePlayer(player.id);
                    app.servers[i].emit('player left the game', socket.id);

                    if (!app.servers[i].players.length) {
                        // Game is empty
                    }
                    return;
                }
            }
        });
    });
};

module.exports = SocketEventHandler;
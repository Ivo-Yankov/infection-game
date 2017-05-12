var LobbyListenerCollection = function () {
    this.list = [];
};

LobbyListenerCollection.prototype.remove = function (socket) {
    for (var i = 0; i < this.list.length; i++) {
        if (this.list[i] && this.list[i].id === socket.id) {
            this.list.splice(i, 1);
        }
    }
};

LobbyListenerCollection.prototype.add = function (socket) {
    this.list.push(socket);
};

LobbyListenerCollection.prototype.update = function (data) {
    this.list.forEach(function (socket) {
        socket.emit('refresh lobbies', data);
    });
};

module.exports = LobbyListenerCollection;
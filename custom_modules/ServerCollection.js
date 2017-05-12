var ServerCollection = function () {
    this.list = [];
};

ServerCollection.prototype.getLobbiesList = function () {
    var lobbies_data = [];
    for (var i = 0; i < this.list.length; i++) {
        if (!this.list[i].started) {
            lobbies_data.push(this.list[i].getData());
        }
    }

    return lobbies_data;
};

ServerCollection.prototype.getLobby = function (lobby_id) {
    for (var i = 0; i < app.lobbies.length; i++) {
        if (app.lobbies[i].id === lobby_id) {
            return app.lobbies[i];
        }
    }

    return null;
};

module.exports = ServerCollection;
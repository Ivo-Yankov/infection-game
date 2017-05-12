var uuidV1 = require('uuid/v1');

Player = function (args) {
    this.type = args.type || "ai";
    this.socket = args.socket || null;
    this.number = args.number || 0;
    this.to_move = args.to_move || false;

    this.id = uuidV1();
};

Player.prototype.getData = function () {
    return {
        type: this.type,
        number: this.number,
        id: this.id
    }
};

module.exports = Player;
Cell = function (args) {
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.player = args.player || 0;
};

Board = function (args) {
    this.size_x = args.size_x || 7;
    this.size_y = args.size_y || 7;
    this.grid = [];

    for (var y = 0; y < this.size_y; y++) {
        for (var x = 0; x < this.size_x; x++) {
            if (!this.grid[y]) {
                this.grid[y] = [];
            }

            this.grid[y][x] = new Cell({
                x: x,
                y: y,
                player: 0
            });
        }
    }
};

Board.prototype.getCellDistance = function (cell1, cell2) {
    var x_distance = Math.abs(cell1.x - cell2.x);
    var y_distance = Math.abs(cell1.y - cell2.y);

    return Math.max(x_distance, y_distance);
};

Board.prototype.getData = function () {
    return {
        grid: this.grid,
        size_x: this.size_x,
        size_y: this.size_y
    }
};

module.exports = Board;
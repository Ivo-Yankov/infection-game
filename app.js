var express = require('express');
var fs = require('fs');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var EventHandler = require('./custom_modules/EventHandler.js');
var SocketHandler = require('./custom_modules/SocketEventHandler.js');
var ServerCollection = require('./custom_modules/ServerCollection.js');
var LobbyListenerCollection = require('./custom_modules/LobbyListenerCollection.js');
var Path = require('path');

var dist = 'dist';
var src = 'src';
var PORT = process.env.PORT || 3000;

app.servers = new ServerCollection();
app.lobbyListeners = new LobbyListenerCollection();

app.set('view engine', 'tmpl');

app.get('/', function (req, res) {
    fs.readFile('./public/index.html', 'utf8', function (err, text) {
        res.send(text);
    });
});

app.use(express.static('public'));

SocketHandler({
    io: io,
    app: app,
    eventEmitter: EventHandler()
});

http.listen(PORT);

console.log('Listening on ', PORT);
var MenuBehaviours = (function($) {
	return {
		subscribeToGameList: function() {
			window.socketHandler.subscribeToGameList();
		},

		unsubscribeFromGameList: function() {
			window.socketHandler.unsubscribeFromGameList();	
		},

		newAiGame: function(menu) {
			console.log('newAiGame');
			menu.openPage('game-settings');
		},

		hostGame: function(menu) {
			console.log('hostGame');
			window.socketHandler.createGame({});
			menu.openPage(['lobby', 'game-settings']);
		},

		openGameList: function(menu) {
			menu.openPage('game-list');
		},

		joinGame: function(menu) {
			console.log('joinGame');
			menu.openPage('lobby');
			window.socketHandler.joinGame($(this).attr('data-id'));
		},

		startGame: function(menu) {
			console.log('startGame');
			window.socketHandler.startGame({lobby: window.lobby});
		},
	}
})(jQuery);
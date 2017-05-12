var Menu = (function($) {
	var page_open_behaviours = {
		'game-list' : MenuBehaviours.subscribeToGameList
	}

	var page_close_behaviours = {
		'game-list' : MenuBehaviours.unsubscribeFromGameList
	}

	var Menu = function(args) {
		var self = this;
		self.el = args.element;
		self.overlay = args.overlay;
		self.pages = {};

		self.el.find('.menu-page').each(function(i, e) {
			self.addPage($(e));
		});

		self.el.find('.menu-item').each(function(i, e) {
			var $e = $(e);
			self.bindEventListeners($e);
		});

		self.openMenu();
	}

	Menu.prototype.bindEventListeners = function( $e ) {
		var self = this;
		if ( $e.attr('data-behaviour') && MenuBehaviours[$e.attr('data-behaviour')] ) {
			$e.on('click', MenuBehaviours[$e.attr('data-behaviour')].bind($e, self));
		}
	}

	Menu.prototype.addPage = function( page ) {
		this.pages[page.attr('data-page')] = page;
	}

	Menu.prototype.pageIsOpen = function( page_name ) {
		return (this.pages[page_name] && this.pages[page_name].is(':visible')) || false;
	}

	Menu.prototype.openPage = function( page_names ) {
		if ( !Array.isArray(page_names) ) {
			page_names = [page_names];
		}

		for (var pn in this.pages) {
			if ( this.pages.hasOwnProperty(pn) && page_names.indexOf(pn) === -1 ) {
				if ( this.pageIsOpen(pn) ) {
					this.pages[pn].hide();
					if (page_close_behaviours[pn]) {
						page_close_behaviours[pn]();
					}
				}

			}
		}
		
		for (var i = 0; i < page_names.length; i++) {
			this.pages[page_names[i]].show();
			if (page_open_behaviours[page_names[i]]) {
				page_open_behaviours[page_names[i]]();
			}
		}

	}

	Menu.prototype.openMenu = function() {
		this.overlay.show();
		this.el.show();

		this.openPage('main');
	}

	Menu.prototype.close = function() {
		this.overlay.hide();
		this.el.hide();
	}

	Menu.prototype.refreshLobbies = function( lobbies ) {
		var self = this;
		if ( this.pageIsOpen('game-list') ) {
			var page = this.pages['game-list'];
			page.find('.lobby').not('.lobby-template').remove();

			for (var i = 0; i < lobbies.length; i++) {
				var lobby_el = page.find('.lobby-template').clone();
				lobby_el.removeClass('lobby-template').attr('data-id', lobbies[i].id).appendTo(page);
				lobby_el.text(lobbies[i].id);

				self.bindEventListeners(lobby_el);
			}
		}
	}

	Menu.prototype.refreshLobby = function( data ) {
		window.lobby = data;
		var self = this;
		var page = this.pages['lobby'];
		page.find('.lobby-player').not('.lobby-player-template').remove();
		for (var i = 0; i < data.players.length; i++) {
			var player_el = page.find('.lobby-player-template').clone();
			player_el.removeClass('lobby-player-template').attr('data-id', data.players[i].id).appendTo(page);
			player_el.text("player: " + data.players[i].id);
			self.bindEventListeners(player_el);
		}
	}

	return Menu;
})(jQuery);
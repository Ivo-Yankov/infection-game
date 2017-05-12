$(function() {
	window.socketHandler = new SocketHandler();

	window.menu = new Menu({
		element: $('#menu'),
		overlay: $('#menu-overlay')
	})
});
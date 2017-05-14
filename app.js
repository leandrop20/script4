requirejs.config({
	baseUrl: 'lib',
	paths: {
		app: '../src'
	}
});

requirejs([
	'phaser',
	'phaser-spine',
	
	'script4/utils/Boot',
	'script4/utils/Preloader',
	'script4/Script4',
	'script4/events/Event',
	'script4/display/Container',
	'script4/display/Sprite',
	'script4/display/Spine',
	'script4/display/SimpleButton',

	'app/Assets',
	'app/Root',
	'app/Main'
]);
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
	'script4/display/Container',
	'script4/display/Sprite',
	'script4/display/Spine',

	'app/Assets',
	'app/Root',
	'app/Main'
]);
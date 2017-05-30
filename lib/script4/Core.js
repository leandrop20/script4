function loadScripts(array, callback)
{
	var loader = function(src, handler) {
		var script = document.createElement("script");
		script.src = src + ".js";
		script.onload = script.onreadystatechange = function() {
			script.onreadystatechange = script.onload = null;
			handler();
		}
		var head = document.getElementsByTagName("head")[0];
		(head || document.body).appendChild(script);
	};
	(function run() {
		if (array.length!=0) {
			loader(array.shift(), run);
		} else {
			callback && callback();
		}
	})();
}

loadScripts([
	'lib/phaser',
	'lib/phaser-spine',

	'lib/script4/utils/Boot',
	'lib/script4/utils/Preloader',
	'lib/script4/utils/Align',
	'lib/script4/utils/Rectangle',
	'lib/script4/Script4',
	'lib/script4/animation/Juggler',
	'lib/script4/animation/DelayedCall',
	'lib/script4/animation/Transitions',
	'lib/script4/animation/Tween',
	'lib/script4/events/Event',
	'lib/script4/events/Touch',
	'lib/script4/events/TouchEvent',
	'lib/script4/events/TouchPhase',
	'lib/script4/geom/Point',
	'lib/script4/display/BlendMode',
	'lib/script4/display/Sprite',
	'lib/script4/display/TileSprite',
	'lib/script4/display/ImageSuper',
	'lib/script4/display/Spine',
	'lib/script4/display/ButtonSuper',
	'lib/script4/display/Graphics',
	'lib/script4/display/PDParticleSystem',
	'lib/script4/text/TextField',

	'src/Main'
], function() {
	loadScripts(Main.imports, function(){ new Main(); });
});
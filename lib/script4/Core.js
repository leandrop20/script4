var IMPORTS = [
	'lib/script4/utils/Boot',
	'lib/script4/utils/Preloader',
	'lib/script4/Script4',
	'lib/script4/events/Event',
	'lib/script4/display/Container',
	'lib/script4/display/Sprite',
	'lib/script4/display/Spine',
	'lib/script4/display/SimpleButton',
	'lib/script4/display/TextField',

	'src/Assets',
	'src/Root',
	'src/Main'
];

function imports()
{
	var script;
	for (var i=0;i<IMPORTS.length;i++) {
		script = document.createElement('script');
		script.src = IMPORTS[i] + ".js";
		document.head.appendChild(script);
	}
	setTimeout(function(){ new Main(); }, 100);
}
imports();
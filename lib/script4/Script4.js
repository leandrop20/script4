var core;

class Script4 extends Phaser.Game
{
	/**
	* root class
	* width int
	* height int
	* renderer (Phaser.AUTO, Phaser.CANVAS, Phaser.WEBGL)
	* canvasID string
	*/
	constructor(rootClass, width = 768, height = 450, renderer = Phaser.AUTO, canvasID = '')
	{
		super(width, height, renderer, canvasID);
		this.rootClass = rootClass;
		this.state.render = this.render;
		this.showStats = false;
		this._juggler;

		this.config = {
			disableVisibilityChange: true,
			enableDebug: false,
			backgroundColor: "#22AAE4",
			// scaleMode: Phaser.ScaleManager.EXACT_FIT,
			fullScreenScaleMode: Phaser.ScaleManager.EXACT_FIT
		}
	}

	static get VERSION() { return "v0.1"; }
	static get juggler() { return this._juggler; }
	static set juggler(value) { this._juggler = value; }
	
	get getShowStats() { return this.showStats; }
	set setShowStats(bool) { this.showStats = bool; if (this.config) { this.config.enableDebug = bool; } }

	start()
	{
		core = this;
		console.log('Script4 ' + Script4.VERSION);

		Script4.juggler = new Juggler();

		this.state.add('Boot', new Boot);
		this.state.add('Preloader', new Preloader);

		this.state.start('Boot');
	}

	render()
	{
		if (this.game.config.enableDebug){
			if (!this.game.time.advancedTiming) { this.game.time.advancedTiming = true; }
			this.game.debug.text('FPS: ' + this.game.time.fps, 4, 18, "#FFFFFF");
		}
	}

	static get width() { return core.width; }
	static get height() { return core.height; }
}
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
	}

	start()
	{
		core = this;

		this.state.add('Boot', new Boot);
		this.state.add('Preloader', new Preloader);

		this.state.start('Boot');
	}

	static get width() { return core.width; }
	static get height() { return core.height; }
}
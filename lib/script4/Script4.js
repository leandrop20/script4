var core;

class Script4 extends Phaser.Game {
	
	/**
	* root class
	* width int
	* height int
	* renderer (Phaser.AUTO, Phaser.CANVAS, Phaser.WEBGL)
	* canvasID string
	*/
	constructor(rootClass, width = 768, height = 450, renderer = Phaser.AUTO, canvasID = '') {
		super(width, height, renderer, canvasID);

		Script4.imagesToPreLoader = [
			{ name: 'imgBar', url: 'assets/images/imgBar.png' },
			{ name: 'imgBgBar', url: 'assets/images/imgBgBar.png' },
			{ name: 'imgLoad', url: 'assets/images/imgLoad.png' }
		];
		
		Script4.customPreloader = {
			name: 'Preloader',
			class: new Preloader
		};

		this.rootClass = rootClass;
		this.state.render = this.render;
		this.showStats = false;
		this._juggler;
		this.contextMenu;

		ContextMenu.customItems = [new ContextMenuItem('Script4', Script4.VERSION)];

		this.config = {
			disableVisibilityChange: true,
			enableDebug: false,
			backgroundColor: "#22AAE4",
			// scaleMode: Phaser.ScaleManager.EXACT_FIT,//NO_SCALE, RESIZE, SHOW_ALL, EXACT_FIT
			fullScreenScaleMode: Phaser.ScaleManager.EXACT_FIT
		}
	}

	static get VERSION() { return "v0.2.2"; }

	static get width() { return core.width; }

	static get height() { return core.height; }

	static get juggler() { return this._juggler; }

	static set juggler(value) { this._juggler = value; }
	
	get getShowStats() { return this.showStats; }
	
	set setShowStats(bool) { this.showStats = bool; if (this.config) { this.config.enableDebug = bool; } }

	start() {
		core = this;
		console.log('Script4 ' + Script4.VERSION);

		Script4.juggler = new Juggler();

		this.state.add('Boot', new Boot);
		this.state.add(Script4.customPreloader.name, Script4.customPreloader.class);

		this.state.start('Boot');
	}

	removeContextMenu() {
		core.contextMenu.destroy();
		core.contextMenu = null;
	}

	render() {
		if (core.canvas && !core.canvas.oncontextmenu) {
			core.canvas.oncontextmenu = function (e) {
				e.preventDefault();
				if (core.contextMenu) { core.removeContextMenu(); }
				core.contextMenu = new ContextMenu(e.layerX, e.layerY);
				core.world.addChild(core.contextMenu);
			}
			document.body.onclick = function (e) {
				if (core.contextMenu) { core.removeContextMenu(); }
			}
		}
		if (this.game.config.enableDebug){
			if (!this.game.time.advancedTiming) { this.game.time.advancedTiming = true; }
			this.game.debug.text('FPS: ' + this.game.time.fps, 4, 18, "#FFFFFF");
		}
	}

}
import { Juggler } from './animation/Juggler';
import { Event } from './enums/Event';
import { Point } from './geom/Point';
import { IPreloader } from './interface/IPreloader';
import { IPreloaderImage } from './interface/IPreloaderImage';
import { ContextMenu } from './ui/ContextMenu';
import { ContextMenuItem } from './ui/ContextMenuItem';
import { Boot } from './utils/Boot';
import { Preloader } from './utils/Preloader';

export class Script4 extends Phaser.Game {

    static core: any;
    static juggler: Juggler;
    static customPreloader: IPreloader;
    static imageToPreloader: IPreloaderImage[];

    static readonly VERSION: string = 'v1.0.0';
    static get width() { return Script4.core.width; }
	static get height() { return Script4.core.height; }

    game: any;
    rootClass: any;

    private _juggler: any;
    private contextMenu: any;

    readonly PRELOADER_IMAGES_DEFAULT: IPreloaderImage[] = [
        { name: 'imgBar', url: 'assets/images/imgBar.png' },
        { name: 'imgBgBar', url: 'assets/images/imgBgBar.png' },
        { name: 'imgLoad', url: 'assets/images/imgLoad.png' }
    ];

    readonly PRELOADER_DEFAULT: IPreloader = {
        name: 'Preloader',
        class: new Preloader
    };

    readonly CONFIGS_DEFAULT: any = {
        disableVisibilityChange: true,
        enableDebug: false,
        backgroundColor: '#22AAE4',
        // scaleMode: Phaser.ScaleManager.EXACT_FIT,//NO_SCALE, RESIZE, SHOW_ALL, EXACT_FIT
        fullScreenScaleMode: Phaser.ScaleManager.EXACT_FIT
    };

    private showStats: boolean = false;

    /**
	*   root class
	*   width int
	*   height int
	*   renderer (Phaser.AUTO, Phaser.CANVAS, Phaser.WEBGL)
	*   canvasID string
	*/
    constructor(rootClass: any,
        width: number = 768,
        height: number = 450,
        renderer: number = Phaser.AUTO, 
        canvasID: string = '',
        configs: any = null
    ) {
        super(width, height, renderer, canvasID);

        this.rootClass = rootClass;
        this.state.render = this.render;
        this.showStats = false;

        ContextMenu.customItems = [new ContextMenuItem('Script4', Script4.VERSION)];

        Script4.imageToPreloader = (Script4.imageToPreloader) ?? this.PRELOADER_IMAGES_DEFAULT;
        Script4.customPreloader = (Script4.customPreloader) ?? this.PRELOADER_DEFAULT;
        
        this.config = configs ?? this.CONFIGS_DEFAULT;
    }

    get getShowStats(): boolean { return this.showStats; }

    set setShowStats(bool: boolean) {
        this.showStats = bool;

        if (this.config) {
            this.config.enableDebug = bool;
        }
    }

    start() {
        console.log(`Script4 ${Script4.VERSION}`);
        
        Script4.core = this;
        Script4.juggler = new Juggler();

        this.state.add('Boot', new Boot);
        this.state.add(Script4.customPreloader.name, Script4.customPreloader.class);

        this.state.start('Boot');
    }

    removeContextMenu() {
        this.contextMenu.destroy();
        this.contextMenu = null;
    }

    render() {
        if (this.game && this.game.canvas && !this.game.canvas.oncontextmenu) {
            this.game
                .canvas
                .oncontextmenu = (e: any) => {
                    e.preventDefault();

                    if (this.game.contextMenu) {
                        this.game.removeContextMenu();
                    }

                    const position: Point = this.game.input.position;
                    this.game.contextMenu = new ContextMenu(position.x, position.y);
                    this.game.world.addChild(this.game.contextMenu);
                };

            this.game
                .canvas
                .onclick = (e: any) => {
                    if (this.game.contextMenu) {
                        this.game.removeContextMenu();
                    }
                };
        }

        if (this.game && this.game.config.enableDebug) {
            if (!this.game.time.advancedTiming) {
                this.game.time.advancedTiming = true;
            }

            this.game.debug.text('FPS: ' + this.game.time.fps, 4, 18, '#FFFFFF');
        }
    }

    addEventListener(type: Event, listener: Function) {
		if (!type) throw('event type not found!');

		window.addEventListener(type as any, listener as any);
	}

	removeEventListener(type: Event, listener: Function) {
		if (!type) throw('event type not found!');

		window.removeEventListener(type as any, listener as any);
	}

}

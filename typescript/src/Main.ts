declare var PIXI: any;
declare var Phaser: any;
declare var TweenMax: any;

import 'pixi';
import 'p2';
import 'phaser-ce';
import 'TweenMax';

import { Script4 } from './com/script4/Script4';
import { Root } from './Root';

class Main {
    
    private script4: Script4;

    constructor() {
        this.script4 = new Script4(Root);
		this.script4.setShowStats = true;
		this.script4.start();
    }

}
new Main();

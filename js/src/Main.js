import PIXI from 'pixi';
import p2 from 'p2';
import Phaser from 'phaser';

import Script4 from './com/script4/Script4';
import Root from './Root';

class Main {

	constructor() {
		this.script4 = new Script4(Root);
		this.script4.setShowStats = true;
		this.script4.start();
	}

}
new Main();
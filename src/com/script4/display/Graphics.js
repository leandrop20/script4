import Script4 from '../Script4';

export default class Graphics extends Phaser.Graphics {
	
	constructor(x, y) {
		super(Script4.core, x, y);
	}

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }

}
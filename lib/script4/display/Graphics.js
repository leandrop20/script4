class Graphics extends Phaser.Graphics {
	
	constructor(x, y) {
		super(core, x, y);
	}

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }

}
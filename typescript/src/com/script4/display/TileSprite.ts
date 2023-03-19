import { Script4 } from '../Script4';
import { Align } from '../enums/Align';

export class TileSprite extends Phaser.TileSprite {

	/**
	* texture = if atlas (atlas.textureName) or textureName only!
	*/
	constructor(
        texture: string,
        x: number = 0,
        y: number = 0,
        width: number = 10,
        height: number = 10
    ) {
		let atlas: string = texture;
        let _texture: any;

		if (texture && texture.indexOf('.') != -1) {
			var parts = texture.split('.');
			atlas = parts[0];
			_texture = parts[1] + '.png';
		}

		super(Script4.core, x, y, width, height, atlas, _texture);
	}

	align(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

	set hAlign(value: Align) {
		switch (value) {
			case Align.LEFT: this.anchor.x = 0.0; break;
			case Align.CENTER: this.anchor.x = 0.5; break;
			case Align.RIGHT: this.anchor.x = 1.0; break;
		}
	}

	set vAlign(value: Align) {
		switch (value) {
			case Align.TOP: this.anchor.y = 0.0; break;
			case Align.MIDDLE: this.anchor.y = 0.5; break;
			case Align.BOTTOM: this.anchor.y = 1.0; break;
		}
	}

	removeFromParent() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
	
}

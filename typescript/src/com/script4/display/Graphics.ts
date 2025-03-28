import { Script4 } from '../Script4';
import { Align } from '../enums/Align';

export class Graphics extends Phaser.Graphics {

    constructor(x: number = 0, y: number = 0) {
        super(Script4.core, x, y);
    }

    align(hAlign: Align = Align.CENTER, vAlign: Align = Align.MIDDLE): void {
        this.hAlign = hAlign;
        this.vAlign = vAlign;
    }

    set hAlign(value: Align) {
		switch (value) {
			case Align.LEFT: this.x = this.x; break;
			case Align.CENTER: this.x = this.x - (this.width * 0.5); break;
			case Align.RIGHT: this.x = this.x - this.width; break;
		}
	}

	set vAlign(value: Align) {
		switch (value) {
			case Align.TOP: this.y = this.y; break;
			case Align.MIDDLE: this.y = this.y - (this.height * 0.5); break;
			case Align.BOTTOM: this.y = this.y - this.height; break;
		}
	}

	removeFromParent(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

}

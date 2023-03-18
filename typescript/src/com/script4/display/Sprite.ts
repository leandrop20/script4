import { Script4 } from '../Script4';

export class Sprite extends Phaser.Group {

    constructor(x: number = 0, y: number = 0) {
        super(Script4.core);
    }

    removeFromParent() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

}

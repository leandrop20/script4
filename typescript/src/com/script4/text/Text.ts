import { Script4 } from '../Script4';

export class Text extends Phaser.Text {

    constructor(x: number = 0, y: number = 0, text: string = '', style: any) {
        super(Script4.core, x, y, text, style);
    }

}

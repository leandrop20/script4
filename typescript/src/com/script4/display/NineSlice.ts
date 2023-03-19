import { Script4 } from '../Script4';
import PhaserNineSlice from '../../../com/phaser-nineslice';

export class NineSlice extends PhaserNineSlice.NineSlice {

    constructor(
        x: number,
        y: number,
        key: any,
        frame: any,
        width: number,
        height: number,
        data: any
    ) {
        super(Script4.core, x, y, key, frame, width, height, data);
    }

}

import { Script4 } from '../Script4';

export class DelayedCall extends Phaser.Tween {

    constructor(callback: Function, delay: number, args: any) {
        super(new Phaser.Point(), Script4.core, Script4.core.tweens);

        this.to({}, delay * 1000);
        this.init(callback, args);
    }

    init(callback: Function, args: any) {
        this.onRepeat.add(function () { callback(args); });
        this.onComplete.add(function () { callback(args); });
    }

    set repeatCount(value: number) {
        this.repeatCounter = value;
    }

}

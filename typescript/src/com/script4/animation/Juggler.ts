import { Script4 } from '../Script4';
import { DelayedCall } from './DelayedCall';
import { Tween } from './Tween';

export class Juggler {

    constructor() {}

    add(tween: Tween): void { tween.start(); }
    
    remove(tween: Tween): void { tween.stop(); }

    tween(target: any, time: number, properties: any): Tween {
        let tween: Tween = new Tween(target, time, properties);
        tween.start();

        return tween;
    }

    delayedCall(callback: Function, delay: number, args: any): DelayedCall {
        let delayedCall: DelayedCall = new DelayedCall(callback, delay, args);
        delayedCall.start();

        return delayedCall;
    }

    removeTweens(object: any): void {
        Script4.core.tweens.removeFrom(object, true);
    }

    purge(): void {
        Script4.core.tweens.removeAll();
    }

}

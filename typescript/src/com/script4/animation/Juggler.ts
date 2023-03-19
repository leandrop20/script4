import { Script4 } from '../Script4';
import { DelayedCall } from './DelayedCall';
import { Tween } from './Tween';

export class Juggler {

    constructor() {}

    add(tween: Tween) { tween.start(); }
    
    remove(tween: Tween) { tween.stop(); }

    tween(target: any, time: number, properties: any) {
        let tween: Tween = new Tween(target, time, properties);
        tween.start();

        return tween;
    }

    delayedCall(callback: Function, delay: number, args: any): DelayedCall {
        let delayedCall: DelayedCall = new DelayedCall(callback, delay, args);
        delayedCall.start();

        return delayedCall;
    }

    removeTweens(object: any) {
        Script4.core.tweens.removeFrom(object, true);
    }

    purge() {
        Script4.core.tweens.removeAll();
    }

}

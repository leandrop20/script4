import Script4 from "../Script4";
import Tween from './Tween';
import DelayedCall from './DelayedCall';

export default class Juggler {
	
	constructor() {}

	add(tween) { tween.start(); }

	remove(tween) { tween.stop(); }

	tween(target, time, properties) {
		var tween = new Tween(target, time, properties);
		tween.start();
	}
	
	delayedCall(callback, delay, args) {
		var delayedCall = new DelayedCall(callback, delay, args);
		delayedCall.start();
	}

	removeTweens(object) {
		Script4.core.tweens.removeFrom(object, true);
	}

	purge() { Script4.core.tweens.removeAll(); }

}
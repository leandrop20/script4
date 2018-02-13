class Juggler {
	
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
		core.tweens.removeFrom(object, true);
	}

	purge() { core.tweens.removeAll(); }

}
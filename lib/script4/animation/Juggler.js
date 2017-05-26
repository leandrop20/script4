class Juggler
{
	constructor()
	{
		
	}

	add(tween)
	{
		tween.start();
	}

	remove(tween)
	{
		core.tweens.remove(tween);
	}

	tween(target, time, properties)
	{
		var tween = new Tween(target, time, properties);
		tween.start();
	}
	
	delayedCall(callback, delay, args)
	{
		var delayedCall = new DelayedCall(callback, delay, args);
		delayedCall.start();
	}
}
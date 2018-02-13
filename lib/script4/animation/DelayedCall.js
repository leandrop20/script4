class DelayedCall extends Phaser.Tween {

	constructor(callback, delay, args, _this) {
		super(new Phaser.Point(), core, core.tweens);
		this.to({}, delay*1000);
		var _args = (args)?args.toString().split(','):[];
		this.onRepeat.add(function() { callback(_this, ..._args); });
		this.onComplete.add(function() { callback(_this, ..._args); });
	}

	set repeatCount(value) { this.repeatCounter = value; }
	
}
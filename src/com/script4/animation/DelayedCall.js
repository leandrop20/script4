import Script4 from "../Script4";

export default class DelayedCall extends Phaser.Tween {

	constructor(callback, delay, args, _this) {
		super(new Phaser.Point(), Script4.core, Script4.core.tweens);
		this.to({}, delay * 1000);
		var _args = (args) ? args.toString().split(',') : [];
		this.onRepeat.add(function() { callback(..._args); });
		this.onComplete.add(function() { callback(..._args); });
	}

	set repeatCount(value) { this.repeatCounter = value; }
	
}
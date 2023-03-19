import { Script4 } from '../Script4';
import { ButtonEvent } from '../enums/ButtonEvent';

export class ButtonSuper extends Phaser.Button {

	scaleWhenDown: number;

	constructor(texture: string, x: number = 0, y: number = 0, callBack: Function | null = null) {
		super(Script4.core, x, y, texture, callBack ?? undefined);

		this.anchor.set(0.5);
		this.scaleWhenDown = 0.95;
		this.onInputDown.add(this.onDown, this);
		this.onInputUp.add(this.onUp, this);
	}

	onDown() {
		this.scale.set(this.scaleWhenDown);
	}

	onUp() {
		this.scale.set(1.0);
	}

	addEventListener(type: ButtonEvent, listener: Function) {
		if (!type) throw('event type not found!');
		
		this[type].add(listener);
	}

	removeEventListener(type: ButtonEvent, listener: Function) {
		if (!type) throw('event type not found!');

		this[type].remove(listener);
	}

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }
	
}

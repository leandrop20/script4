import { Sprite } from './Sprite';
import { ImageSuper } from './ImageSuper';
import { TextField } from '../text/TextField';
import { Align } from '../enums/Align';
import { Rectangle } from '../utils/Rectangle';
import { ButtonEvent } from '../enums/ButtonEvent';
import { Texture } from '../textures/Texture';

export class SimpleButton extends Sprite {

    texture: ImageSuper;
    tf!: TextField;

    _enabled: boolean;
    _listener: any;
    scaleWhenDown: number;

	constructor(
        texture: string | Texture,
        x: number = 0,
        y: number = 0,
        font: string | null = null,
        text: string = ''
    ) {
		super();
		this._enabled = true;
		this._listener;

		this.texture = new ImageSuper(texture);
		this.texture.align(Align.CENTER, Align.MIDDLE);
		this.texture.input.useHandCursor = true;
		this.addChild(this.texture);
		this.texture.events.onInputDown.add(this.onDown, this);
		this.texture.events.onInputUp.add(this.onUp, this);

		if (font) { this.createTf(font, text); }

		this.scaleWhenDown = 0.95;

		this.position.set(x, y);
	}

	set upState(texture: any) {
		var atlas = texture;

		if (!(texture instanceof PIXI.Texture)) {
			if (texture.indexOf('.') != -1) {
				var parts = texture.split('.');
				atlas = parts[0];
				texture = parts[1] + '.png';
			} else {
				texture = null;
			}
		}

		this.texture.loadTexture(atlas, texture);
		this.texture.readjustSize();
	}

	set textureColor(value: number) { this.texture.tint = value; }

	get enabled() { return this._enabled; }

	set enabled(bool: boolean) {
		this._enabled = bool;
		this.texture.inputEnabled = bool;

		if (bool) {
			this.alpha = 1.0;
		} else {
			this.alpha = 0.5;
		}
	}

	createTf(font: string, text: string = '') {
		this.tf = new TextField(this.texture.width, this.texture.height, font, text);
		this.tf.inputEnabled = false;
		this.tf.position.set(-this.texture.width * 0.5, -this.texture.height * 0.5);
		this.addChild(this.tf);
	}

	set fontName(fontName: string) {
		if (this.tf) {
			this.tf.field.font = fontName;
		} else {
			this.createTf(fontName);
		}
	}

	set fontColor(value: number) {
		this.tf.textColor = value;
	}

	set fontSize(value: number) {
		this.tf.fontSize = value;
		this.tf.text = this.tf.text;
	}

	get text() { return (this.tf)?this.tf.text:""; }

	set text(value) {
		if (this.tf) { this.tf.text = value; }
	}

	set textBound(rect: Rectangle) {
		if (this.tf) {
			this.tf.position.set(
				(-this.texture.width * 0.5) + rect.x,
				(-this.texture.height * 0.5) + rect.y
			);

			if (rect.width != 0) { this.tf.width = rect.width; }
			if (rect.height != 0) { this.tf.height = rect.height; }
		}
	}

	alignText(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		if (this.tf) { this.tf.align(hAlign, vAlign); }
	}

	onDown() {
		if (this.enabled) { this.scale.set(this.scaleWhenDown); }
	}

	onUp() {
		if (this.enabled) { this.scale.set(1.0); }
	}

	onEvent() {
		this._listener({ target: this });
	}

    override addEventListener(type: ButtonEvent, listener: Function): void {
        if (!type) throw('event type not found!');

		this._listener = listener;
		this.texture.events[type].add(this.onEvent, this);
    }

    override removeEventListener(type: ButtonEvent, listener: Function): void {
        if (!type) throw('event type not found!');

		this._listener = null;
		this.texture.events[type].remove(this.onEvent, this);
    }

	destroyAll() {
		this.removeChildren();
		this.removeFromParent();
	}

}

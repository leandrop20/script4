import { Script4 } from '../Script4';
import { BitmapData } from '../display/BitmapData';
import { Align } from '../enums/Align';
import { Point } from '../geom/Point';

import { ButtonSuper } from './ButtonSuper';
import { Graphics } from './Graphics';
import { TouchEvent } from '../events/TouchEvent';
import { TouchPhase } from '../enums/TouchPhase';

export class ImageSuper extends Phaser.Image {

    static gradientId: number = 0;

	static async createLinearGradientTexture(
		color1: number,
		color2: number,
		w: number,
		h: number,
		callback: any,
		layers: number = 30
	) {
		let textureName = `gradient${++ImageSuper.gradientId}`;
		let bmp = new BitmapData(w, h);
		let layerY = 0;

		for (let i = 0; i < layers; i++) {
			let increment = Math.round(h / layers);
			let interpolate = Phaser.Color.interpolateColor(color1, color2, layers, i);
			let color = Phaser.Color.getWebRGB(interpolate);
			bmp.rect(0, layerY, w, layerY + increment, color);

			layerY += increment;
		}

		bmp.generateTexture(textureName, callback);

		return textureName;
	}

	touchEventCallBack!: Function;
	atlasPosition!: Point;
	enterFrameEvent!: Phaser.TimerEvent | null;

	/**
	* texture = if atlas (atlas.textureName) or textureName only!
	*/
	constructor(texture: any, x = 0, y = 0) {
		var atlas = texture;

		if (!(texture instanceof BitmapData) && !(texture instanceof PIXI.Texture)) {
			if (texture.indexOf('.') != -1) {
				var parts = texture.split('.');
				atlas = parts[0];
				texture = parts[1] + '.png';
			} else {
				texture = null;
			}
		}
		
		super(Script4.core, x, y, atlas, texture);

		this.inputEnabled = true;
	}

	override loadTexture(
		key: string | Phaser.RenderTexture | Phaser.BitmapData | Phaser.Video | PIXI.Texture,
		frame?: string | number | undefined,
		stopAnimation?: boolean | undefined
	): void {
		super.loadTexture(key, frame, stopAnimation);

		if (key instanceof PIXI.Texture) {
			this.setSize(key.baseTexture.width, key.baseTexture.height);
		}

		this.atlasPosition = this.atlasPosition ?? new Point();

		if (frame && !(key instanceof PIXI.Texture)) {
			var data = Script4.core.cache.getJSON(key + 'Data');

			if (data) {
				var spriteSourceSize: Point = data.frames[frame].spriteSourceSize;

				if (spriteSourceSize && (spriteSourceSize.x != 0 || spriteSourceSize.y != 0)) {
					this.atlasPosition.x = spriteSourceSize.x;
					this.atlasPosition.y = spriteSourceSize.y;
					this.x = 0;
					this.y = 0;
				}
			}
		}
	}

	setSize(w: number, h: number) {
		this.width = w;
		this.height = h;
	}

	readjustSize() {
		this.width = this.texture.frame.width;
		this.height = this.texture.frame.height;
	}

	override get x(): number { return this.position.x; }

	override set x(value: number) {
		this.position.x = this.atlasPosition.x + value;
	}

	override get y(): number { return this.position.y; }

	override set y(value: number) {
		this.position.y = this.atlasPosition.y + value;
	}

	get color(): number { return this.tint; }

	set color(value: number) {
		this.tint = value;
	}

	align(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

	set hAlign(value: Align) {
		switch (value) {
			case Align.LEFT: this.anchor.x = 0.0; break;
			case Align.CENTER: this.anchor.x = 0.5; break;
			case Align.RIGHT: this.anchor.x = 1.0; break;
		}
	}

	set vAlign(value: Align) {
		switch (value) {
			case Align.TOP: this.anchor.y = 0.0; break;
			case Align.MIDDLE: this.anchor.y = 0.5; break;
			case Align.BOTTOM: this.anchor.y = 1.0; break;
		}
	}

	get scaleX(): number { return this.scale.x; }
	
	set scaleX(value: number) { this.scale.x = value; }
	
	get scaleY(): number { return this.scale.y; }

	set scaleY(value: number) { this.scale.y = value; }

	set rounded(value: number) {
		let mask = new Graphics();
		mask.beginFill(0x00FF00);
		mask.drawRoundedRect(
			-(this.width * this.anchor.x),
			-(this.height * this.anchor.y),
			this.width,
			this.height, value
		);
		mask.endFill();
		this.addChild(mask);

		this.mask = mask;
	}

	removeFromParent() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

	touchEvent(object: any, pointer: any, isDown: any) {
		var target: any;
		var currentTarget: any;

		if (!(object instanceof ButtonSuper)) {
			object = ((object instanceof Phaser.Graphics || object instanceof Graphics))
				? object.parent
				: object;
			currentTarget = object;
			target = getTarget(object);
			let touchPhase: TouchPhase;

			if (isDown == undefined) {
				target.isTouchDown = true;
				target.game.input.addMoveCallback(target.onMove, target);
				touchPhase = TouchPhase.BEGAN;
			} else {
				target.isTouchDown = false;
				target.game.input.deleteMoveCallback(target.onMove, target);
				touchPhase = TouchPhase.ENDED;
			}

			target.touchEventCallBack(new TouchEvent(touchPhase, target, currentTarget));
		}

		function getTarget(_obj: any): any {
			if (!_obj.touchEventCallBack) {
				return getTarget(_obj.parent);
			}

			return _obj;
		}
	}

	onMove() {
		this.touchEventCallBack(new TouchEvent(TouchPhase.MOVED, this));
	}

	addEventListener(type: any, listener: Function) {
		if (!type) throw('event type not found!');
		
		if (type == 'touch') {
			this.touchEventCallBack = listener;
			
			this.events['onInputDown'].add(this.touchEvent);
			this.events['onInputUp'].add(this.touchEvent);
		} else if (type == 'enterFrame') {
			this.enterFrameEvent = this.game.time.events.loop(33, listener, this);
		}
	}

	removeEventListener(type: any, listener: Function) {
		if (!type) throw('event type not found!');

		if (type == 'touch') {
			this.events['onInputDown'].remove(this.touchEvent);
			this.events['onInputUp'].remove(this.touchEvent);
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) {
				this.game.time.events.remove(this.enterFrameEvent);
				this.enterFrameEvent = null;
			}
		}
	}
	
}

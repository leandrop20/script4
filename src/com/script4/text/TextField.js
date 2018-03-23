import Script4 from '../Script4';
import Align from "../utils/Align";

export default class TextField extends Phaser.Group {

	constructor(width, height, font, text = '', size = null) {
		super(Script4.core);
		this.inputEnableChildren = true;

		this.w = width;
		this.h = height;

		this.box = new Phaser.Graphics(Script4.core, 0, 0);
		this.box.visible = false;
		this.box.lineStyle(1, 0x000000);
		this.box.drawRect(0, 0, width - 1, height - 1);
		this.box.endFill();
		this.addChild(this.box, 0);

		this.field = new Phaser.BitmapText(Script4.core, 0, 0, font, text);
		this.field.maxWidth = width;
		this.field.fontSize = (size)?size:this.field._data.font.size;
		this.addChild(this.field);

		this.mask = new Phaser.Graphics(Script4.core, 0, 0);
		this.mask.inputEnabled = true;
		this.mask.beginFill(0x009900);
		this.mask.drawRect(0, 0, width, height);
		this.mask.endFill();
		this.addChild(this.mask);

		this.field.mask = this.mask;
	}

	set fontSize(value) { this.field.fontSize = value; }
	get fontSize() { return this.field.fontSize; }

	set alignText(value) {
		this.field.align = value;
	}

	get width () { return this.w; }

	set width(value) {
		this.w = value;
		this.box.width = value;
		this.mask.width = value;
		this.field.maxWidth = value;
	}

	get height () { return this.h; }

	set height(value) {
		this.h = value;
		this.box.height = value;
		this.mask.height = value;
	}

	set inputEnabled(bool) {
		this.mask.inputEnabled = bool;
	}

	/**
	*	value = String text
	*/
	appendText(value) {
		this.field.setText(this.field.text + value);
	}

	set text(value) { this.field.setText(value); }

	set textColor(value) { this.field.tint = value; }

	set border(bool) { this.box.visible = bool; }

	set borderColor(color) { this.box.lineStyle(1, color); }

	/**
	*	value = Align.LEFT (LEFT, CENTER, RIGHT)
	*/
	set hAlign(value) {
		if (value == 'center') {
			this.field.anchor.x = 0.5;
			this.field.x = this.w*0.5;
		} else if (value == 'right') {
			this.field.x = this.width;
			this.field.anchor.x = 1.0;
		}
	}

	/**
	*	value = Align.TOP (TOP, MIDDLE, BOTTOM)
	*/
	set vAlign(value) {
		if (value == 'middle') {
			this.field.anchor.y = 0.5;
			this.field.y = this.h*0.5;
		} else if (value == 'bottom') {
			this.field.y = this.field.textHeight;
		}
	}

	align(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

	destroyAll() {
		this.removeChildren();
		this.parent.removeChild(this);
	}

}
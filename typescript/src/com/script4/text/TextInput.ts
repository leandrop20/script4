import { Script4 } from '../Script4';
import { Align } from '../enums/Align';

export class TextInput extends Phaser.Group {

    box: Phaser.Graphics;
    field: Phaser.BitmapText;
    _mask: Phaser.Graphics;
    hit: Phaser.Graphics;
    line: Phaser.Graphics;

    w: number;
    h: number;
    maxLength: number;
    focused: boolean;
    override type: any;

	constructor(width: number, height: number, font: string, size: any = null) {
		super(Script4.core);
		this.inputEnableChildren = true;

		this.w = width;
		this.h = height;
		this.type = 'text';
		this.focused = false;

		this.box = new Phaser.Graphics(Script4.core, 0, 0);
		this.box.visible = false;
		this.box.lineStyle(1, 0x000000);
		this.box.drawRect(0, 0, width, height);
		this.box.endFill();
		this.addChildAt(this.box, 0);

		this.field = new Phaser.BitmapText(Script4.core, 0, 0, font);
		this.field.align = Align.CENTER;
		this.field.maxWidth = width;
		this.field.fontSize = (size) ? size : this.field.data.font.size;
		this.addChild(this.field);

		this._mask = new Phaser.Graphics(Script4.core, 0, 0);
		this._mask.beginFill(0x009900);
		this._mask.drawRect(0, 0, width + 2, height);
		this._mask.endFill();
		this.addChild(this._mask);

		this.field.mask = this._mask;

		this.hit = new Phaser.Graphics(Script4.core, 0, 0);
		this.hit.inputEnabled = true;
		this.hit.beginFill(0x009900, 0.0);
		this.hit.drawRect(0, 0, width, height);
		this.hit.endFill();
		this.addChild(this.hit);

		this.line = new Phaser.Graphics(Script4.core, 0, 0);
		this.line.lineStyle(1, 0x000000);
		this.line.drawRect(0, 0, 1, this.field.fontSize);
		this.line.endFill();
		this.line.visible = false;
		this.addChild(this.line);

		this.maxLength = 999;

		this.align();

		this.hit.events.onInputDown.add(this.onFocusIn, this);
	}

	get color(): number { return this.field.tint; }

	set color(value) {
		this.field.tint = value;
	}

	set alignText(value: Align) {
		this.field.align = value;
	}

	get width(): number { return this.w; }

	override set width(value: number) {
		this.w = value;
		this.box.width = value;
		this._mask.width = value;
		this.field.maxWidth = value;
		this.hit.width = value;
	}

	get height(): number { return this.h; }

	override set height(value: number) {
		this.h = value;
		this.box.height = value;
		this._mask.height = value;
		this.hit.height = value;
	}

	set inputEnabled(bool: boolean) {
		this.hit.inputEnabled = bool;
	}

	/**
	*	value = String text
	*/
	appendText(value: string) {
		this.field.setText(this.field.text + value);
	}

	get text(): string { return this.field.text; }

	set text(value) { this.field.setText(value); }

	set textColor(value: number) { this.field.tint = value; }

	set border(bool: boolean) { this.box.visible = bool; }

	set borderColor(color: number) { this.box.lineStyle(1, color); }

	set alignPivotX(value: Align) {
		if (value === Align.CENTER) {
			this.pivot.x = this.width * 0.5;
		} else if (value === Align.RIGHT) {
			this.pivot.x = this.width;
		} else {
			this.pivot.x = 0.0;
		}
	}

	set alignPivotY(value: Align) {
		if (value === Align.MIDDLE) {
			this.pivot.y = this.height * 0.5;
		} else if (value === Align.BOTTOM) {
			this.pivot.y = this.height;
		} else {
			this.pivot.y = 0.0;
		}
	}

	alignPivot(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.alignPivotX = hAlign;
		this.alignPivotY = vAlign;
	}

	set hAlign(value: Align) {
		if (value === Align.LEFT) {
			this.field.anchor.x = 0.0;
			this.field.x = 0;
		} else if (value === Align.CENTER) {
			this.field.anchor.x = 0.5;
			this.field.x = this.w * 0.5;
		} else if (value === Align.RIGHT) {
			this.field.anchor.x = 1.0;
			this.field.x = this.width;
		}
	}

	set vAlign(value: Align) {
		if (value === Align.TOP) {
			this.field.anchor.y = 0.0;
			this.field.y = 0;
		} else  if (value === Align.MIDDLE) {
			this.field.anchor.y = 0.5;
			this.field.y = this.h * 0.5;
		} else if (value === Align.BOTTOM) {
			this.field.anchor.y = 1.0;
			this.field.y = this.height;
		}
	}

    override align(
        width: any = Align.CENTER,
        height: any = Align.MIDDLE,
        cellWidth: number = 0,
        cellHeight: number = 0,
        position?: number | undefined,
        offset?: number | undefined
    ): boolean {
		if (!Number.isInteger(width)) {
            this.hAlign = width;
            this.vAlign = height;

            return false;
        }

        return super.align(width, height, cellWidth, cellHeight, position, offset);
    }

	positionLine() {
		switch (this.field.anchor.x) {
			case 0.0: this.line.x = this.field.textWidth + this.field.x; break;
			case 0.5: this.line.x = (this.field.textWidth * 0.5) + this.field.x; break;
			case 1.0: this.line.x = this.field.x - 1; break;
		}

		switch (this.field.anchor.y) {
			case 0.0: this.line.y = 0; break;
			case 0.5: this.line.y = (this.height * 0.5) - (this.field.fontSize * 0.5); break;
			case 1.0: this.line.y = this.height - this.field.fontSize; break;
		}
	}

	onWorldClick(e: any) {
		if (!(e.targetObject.sprite.parent instanceof TextInput)) {
			this.onFocusOut();
		}
	}

	onFocusIn() {
		if (!this.focused) {
			this.focused = true;
			this.positionLine();
			this.line.visible = true;
			this.line.alpha = 1.0;
			TweenMax.to(
                this.line,
                0.3,
                { alpha: 0.0, ease: Ease.BackInOut, yoyo: true, repeat: -1 }
            );

			Script4.core.input.keyboard.onPressCallback = this.onKey.bind(this);
			Script4.core.input.keyboard.onDownCallback = this.onBackspace.bind(this);
			this.game.input.onDown.add(this.onWorldClick, this);
		}
	}

	onFocusOut() {
		this.focused = false;
		this.game.input.onDown.remove(this.onWorldClick, this);
		this.line.visible = false;
		TweenMax.killTweensOf(this.line);
	}

	onKey(code: any) {
		if (this.text.length < this.maxLength) {
			if (this.type === 'number') {
				if (isNaN(code)) return;
			}
			this.appendText(code);
			this.positionLine();
		}
	}

	onBackspace(e: any) {
		if (e.code === 'Backspace') {
			this.text = this.text.substring(0, this.text.length - 1);
			this.positionLine();
		}
	}

	destroyAll() {
		Script4.core.input.keyboard.onPressCallback = null;
		Script4.core.input.keyboard.onUpCallback = null;
		this.hit.events.onInputDown.remove(this.onFocusIn, this);

		this.removeChildren();
		this.parent.removeChild(this);
	}

}

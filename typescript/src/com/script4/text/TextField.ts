import { Script4 } from '../Script4';
import { Align } from '../enums/Align';

export class TextField extends Phaser.Group {

    box: Phaser.Graphics;
    container: Phaser.Sprite;
    field: Phaser.BitmapText;
    _mask: Phaser.Graphics;
    hit: Phaser.Graphics;

    w: number;
    h: number;

    constructor(width: number, height: number, font: string, text = '', size = null) {
        super(Script4.core);
        this.inputEnableChildren = true;

        this.w = width;
        this.h = height;

        this.box = new Phaser.Graphics(Script4.core, 0, 0);
        this.box.visible = false;
        this.box.lineStyle(1, 0x000000);
        this.box.drawRect(0, 0, width, height);
        this.box.endFill();
        this.addChildAt(this.box, 0);

        //insert cause phaser box height error
        this.container = new Phaser.Sprite(Script4.core, 0, 0);
        this.addChild(this.container);

        this.field = new Phaser.BitmapText(Script4.core, 0, 0, font, text);
        this.field.align = Align.CENTER;
        this.field.maxWidth = width;
        this.field.fontSize = (size) ? size : this.field.data.font.size;
        this.container.addChild(this.field);

        this._mask = new Phaser.Graphics(Script4.core, 0, 0);
        this._mask.beginFill(0x009900);
        this._mask.drawRect(0, 0, width + 2, height);
        this._mask.endFill();
        this.container.addChild(this._mask);

        this.container.mask = this._mask;

        this.hit = new Phaser.Graphics(Script4.core, 0, 0);
        this.hit.inputEnabled = true;
        this.hit.beginFill(0x009900, 0.0);
        this.hit.drawRect(0, 0, width, height);
        this.hit.endFill();
        this.addChild(this.hit);

        this.align();
    }

    get color(): number { return this.field.tint; }

    set color(value: any) {
        this.field.tint = value;
    }

    set alignText(value: Align) {
        this.field.align = value;
    }

    override get width(): number { return this.w; }

    override set width(value: number) {
        this.w = value;
        this.box.width = value;
        this._mask.width = value;
        this.field.maxWidth = value;
        this.hit.width = value;
    }

    override get height(): number { return this.h; }

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

    set text(value: string) { this.field.setText(value); }

    set textColor(value: any) { this.field.tint = value; }

    set border(bool: boolean) { this.box.visible = bool; }

    set borderColor(color: any) { this.box.lineStyle(1, color); }

    set fontSize(value: number) { this.field.fontSize = value; }

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
        } else if (value === Align.MIDDLE) {
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

    alignField(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
        this.hAlign = hAlign;
        this.vAlign = vAlign;
    }

    destroyAll() {
        this.removeChildren();
        this.parent.removeChild(this);
    }

}

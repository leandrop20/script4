import { Script4 } from '../Script4';
import { Graphics } from '../display/Graphics';
import { Sprite } from '../display/Sprite';
import { Text } from '../text/Text';
import { ContextMenuItem } from './ContextMenuItem';

export class ContextMenu extends Sprite {

    static customItems: ContextMenuItem[] = [];

    constructor(x: number, y: number) {
        super();

        let bg = new Graphics();
		bg.lineStyle(1, 0xBDC3C7, 1.0)
		bg.beginFill(0xFFFFFF);
		bg.drawRect(0, 0, 240, 128);
		bg.endFill();
		this.addChild(bg);

        this.create(0, 0);

        bg.height = 30 * ContextMenu.customItems.length;

		if ((x + this.width) > Script4.width) {
			x = x - this.width;
		}
		if ((y + this.height) > Script4.height) {
			y = y - this.height;
		}

		this.position.set(x, y);
    }

    override create(
        x: number,
        y: number,
        key?: string | Phaser.RenderTexture | Phaser.BitmapData | Phaser.Video | PIXI.Texture | undefined,
        frame?: string | number | undefined,
        exists?: boolean | undefined,
        index?: number | undefined
    ):void {
        let tf: Text; let tfSub: Text;

		for (let i = 0; i < ContextMenu.customItems.length; i++) {
			tf = new Text(
                0,
                30,
                ContextMenu.customItems[i].text,
                { font: "12px Arial", fill: "#2C3E50" }
            );
			tf.position.set(15, (30 * i) + 8);
			this.addChild(tf);

			tfSub = new Text(
                0,
                30,
                ContextMenu.customItems[i].subtext ?? '',
                { font: "12px Arial", fill: "#BDC3C7" }
            );
			tfSub.position.set((this.width - tfSub.width) - 15, (30 * i) + 8);
			this.addChild(tfSub);
		}
    }

    override destroy(destroyChildren?: boolean | undefined, soft?: boolean | undefined):void {
        this.removeChildren();
        this.removeFromParent();

        super.destroy();
    }

}

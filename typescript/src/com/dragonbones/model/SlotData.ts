import { BaseObject } from '../core/BaseObject';
import { ColorTransform } from '../geom/ColorTransform';

export class SlotData extends BaseObject {

    static DEFAULT_COLOR: ColorTransform = new ColorTransform();

    actions: any[];

    displayIndex!: number;
    zOrder!: number;
    blendMode!: number;
    name: any;
    parent: any;
    color: any;

	constructor() {
		super();

		this.actions = [];
	}

	static generateColor() {
        return new ColorTransform();
    }

    static override toString() {
        return "[class SlotData]";
    }

    override _onClear() {
        for (var i = 0, l = this.actions.length; i < l; ++i) {
            this.actions[i].returnToPool();
        }

        this.displayIndex = 0;
        this.zOrder = 0;
        this.blendMode = 0 /* Normal */;
        this.name = null;
        this.parent = null;
        this.color = null;
        this.actions.length = 0;
    }

}
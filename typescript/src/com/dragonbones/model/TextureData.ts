import { BaseObject } from '../core/BaseObject';
import { Rectangle } from '../geom/Rectangle';

export class TextureData extends BaseObject {

    region!: Rectangle;
    rotated!: boolean;
    name: any;
    frame: any;
    parent: any;

	constructor() {
		super();

		this.region = new Rectangle();
	}

	static generateRectangle() {
        return new Rectangle();
    }

    override _onClear() {
        this.rotated = false;
        this.name = null;
        this.frame = null;
        this.parent = null;
        this.region.clear();
    }

}
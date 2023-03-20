import { BaseObject } from '../core/BaseObject';
import { Transform } from '../geom/Transform';

export class BoneData extends BaseObject {

    transform: Transform;

    inheritTranslation!: boolean;
    inheritRotation!: boolean;
    inheritScale!: boolean;
    bendPositive!: boolean;

    chain!: number;
    chainIndex!: number;
    weight!: number;
    length!: number;

    name: any;
    parent: any;
    ik: any;
    
	constructor() {
		super();

		this.transform = new Transform();
	}

	static override toString(): string {
        return "[class BoneData]";
    }

    override _onClear() {
        this.inheritTranslation = false;
        this.inheritRotation = false;
        this.inheritScale = false;
        this.bendPositive = false;
        this.chain = 0;
        this.chainIndex = 0;
        this.weight = 0;
        this.length = 0;
        this.name = null;
        this.parent = null;
        this.ik = null;
        this.transform.identity();
    }

}
import { BaseObject } from '../core/BaseObject';
import { Point } from '../geom/Point';
import { Transform } from '../geom/Transform';

export class DisplayData extends BaseObject {

    pivot: Point;
    transform: Transform;

    isRelativePivot!: boolean;
    type!: number;
    name: any;
    texture: any;
    armature: any;
    mesh: any;

	constructor() {
		super();

		this.pivot = new Point();
		this.transform = new Transform();
	}

	static override toString(): string {
        return "[class DisplayData]";
    }

    override _onClear() {
        this.isRelativePivot = false;
        this.type = 0 /* Image */;
        this.name = null;
        this.texture = null;
        this.armature = null;
        
        if (this.mesh) {
            this.mesh.returnToPool();
            this.mesh = null;
        }

        this.pivot.clear();
        this.transform.identity();
    }

}
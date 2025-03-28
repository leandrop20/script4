import { Script4 } from '../Script4';
import { Point } from '../geom/Point';

export class Touch {

	static get previous():any { return this._previous; }
    
	static set previous(target) { this._previous = target; }

    static _previous: any;

    target: any;
    phase: any;

    globalX: number;
    globalY: number;

	constructor(target: any, phase: any, globalX: number, globalY: number) {
		this.target = target;
		this.phase = phase;
		this.globalX = globalX;
		this.globalY = globalY;
	}

	getPreviousLocation(obj: any): Point {
		let point: Point = new Point();
		let global: Point = new Point(Script4.core.input.worldX, Script4.core.input.worldY);

		point.x = global.x - obj.x + obj.pivot.x;
		point.y = global.y - obj.y + obj.pivot.y;

		return point;
	}
	
}

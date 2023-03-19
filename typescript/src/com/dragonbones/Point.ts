export class Point {

    x: number;
    y: number;

	constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
	}

	copyFrom(value: Point) {
        this.x = value.x;
        this.y = value.y;
    }

    clear() {
        this.x = this.y = 0;
    }

}
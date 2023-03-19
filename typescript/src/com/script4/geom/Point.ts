export class Point extends Phaser.Point {

    override x!: number;
    override y!: number;

    constructor(x: number = 0, y: number = 0) {
		super(x, y);
	}

    override multiply(x: any, y: number): Point {
        this.x *= x instanceof Point ? x.x : x;
        this.y *= x instanceof Point ? x.y : y || x;

		return this;
    }

	multiplyAdd(x: any, y: number): Point {
		this.x += x instanceof Point ? x.x * y : x * y;
        this.y += x instanceof Point ? x.y * y : x * y;

		return this;
	}

}

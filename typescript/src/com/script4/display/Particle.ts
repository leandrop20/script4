import { Point } from '../geom/Point';

export class Particle {
	
    sprite: any;

    position: Point;
    velocity: Point;
    accel: Point;
	life!: number;
	rotate!: number;
	velRotate!: number;
	deltaAlpha!: number;
	deltaScale!: number;
	deltaColor!: number[];

	constructor() {
		this.position = new Point();
		this.velocity = new Point();
		this.accel = new Point();
	}

	setVelocity(angle: number, speed: number): void {
		this.velocity.x = Math.cos(angle) * speed;
		this.velocity.y = Math.sin(angle) * speed;
	}

	setAccel(angle: number, speed: number): void {
		this.accel.x = Math.cos(angle) * speed;
		this.accel.y = Math.sin(angle) * speed;
	}

}

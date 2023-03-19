import { Point } from '../geom/Point';

export class Particle {

    position: Point;
    velocity: Point;
    accel: Point;
    sprite: any;

	constructor() {
		this.position = new Point();
		this.velocity = new Point();
		this.accel = new Point();
		this.sprite = null;
	}

	setVelocity(angle: number, speed: number) {
		this.velocity.x = Math.cos(angle) * speed;
		this.velocity.y = Math.sin(angle) * speed;
	}

	setAccel(angle: number, speed: number) {
		this.accel.x = Math.cos(angle) * speed;
		this.accel.y = Math.sin(angle) * speed;
	}

}

class PDParticleSystem extends Phaser.Particles.Arcade.Emitter
{
	constructor(texture)
	{
		super(core, 0, 0);

		/*this.position = new Phaser.Point();
		this.positionVar = new Phaser.Point();
		this.angle = 0;
		this.angleVar = Math.PI;
		this.speed = 100;
		this.speedVar = 0;
		this.life = 2;
		this.lifeVar = 0;
		this.duration = 0;
		this.durationTimer = 0;
		this.rate = 0.1;
		this.rateTimer = 0;
		this.count = 10;
		this.active = true;
		this.velRotate = 0;
		this.velRotateVar = 0;
		this.rotate = 0;
		this.rotateVar = 0;
		this.startAlpha = 1;
		this.endAlpha = 0;
		this.startScale = 1;
		this.startScaleVar = 0;
		this.endScale = 1;
		this.endScaleVar = 0;
		this.accelAngle = Math.PI/2;
		this.accelAngleVar = 0;
		this.accelSpeed = 0;
		this.accelSpeedVar = 0;
		this.color = 0xFFFFFF;*/

		this.makeParticles(texture);
		console.log(this);
	}

	getVariance(value) {
    	return (Math.random() * value) * (Math.random() > 0.5 ? -1 : 1);
	}

	setVeloctity(angle, speed) {
        this.velocity.x = Math.cos(angle) * speed;
    	this.velocity.y = Math.sin(angle) * speed;
	}

	setAccel(angle, speed) {
    	this.accel.x = Math.cos(angle) * speed;
    	this.accel.y = Math.sin(angle) * speed;
	}

	start(duration = 0)
	{
		this.on = true;
	}

}
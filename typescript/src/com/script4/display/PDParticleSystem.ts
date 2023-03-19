import { Script4 } from '../Script4';
import { Sprite } from './Sprite';
import { Point } from '../geom/Point';
import { Particle } from './Particle';

export class PDParticleSystem extends Sprite {

    static _emitterID: number = 0;

	static get emitterID(): number { return PDParticleSystem._emitterID; }
	static set emitterID(_value: number) { PDParticleSystem._emitterID = _value; }

    target: any;

    texture: string;
    counter: number;
    positionVar: Point;
    emitterX: number;
    emitterY: number;
    angleVar: number;
    speed: number;
    speedVar: number;
    life: number;
    lifeVar: number;
    duration: number;
    durationTimer: number;
    rate: number;
    rateTimer: number;
    active: boolean;
    velRotate: number;
    velRotateVar: number;
    rotate: number;
    rotateVar: number;
    startAlpha: number;
    endAlpha: number;
    startScale: number;
    startScaleVar: number;
    endScale: number;
    endScaleVar: number;
    targetForce: number;
    accelAngle: number;
    accelAngleVar: number;
    accelSpeed: number;
    accelSpeedVar: number;
    blendMode: number;
    velocityLimit: Point;
    startColor: number[];
    endColor: number[];

	constructor(texture: string) {
		super(0, 0);
		var settings = Script4.core.cache.getJSON(texture + 'Settings');
		this.texture = texture;

		if (PDParticleSystem.emitterID === undefined) { PDParticleSystem.emitterID = 0; }

		PDParticleSystem.emitterID++;
        
		this.name = 'emitter' + PDParticleSystem.emitterID;
		this.position = new Point(settings.positionX, settings.positionY);
		this.positionVar = new Point(settings.positionVarX, settings.positionVarY);
		this.emitterX = 0;
		this.emitterY = 0;
		this.angle = ((settings['angle'] / 180) * Math.PI) - Math.PI;
		this.angleVar = (settings['angleVar'] / 360) * Math.PI;
		this.speed = settings.speed;
		this.speedVar = settings.speedVar;
		this.life = settings.life;
		this.lifeVar = settings.lifeVar;
		this.duration = settings.duration;
		this.durationTimer = 0;
		this.rate = settings.rate;
		this.rateTimer = 0;
		this.counter = settings.count;
		this.active = false;
		this.velRotate = settings.velRotate;
		this.velRotateVar = settings.velRotateVar;
		this.rotate = settings.rotate;
		this.rotateVar = settings.rotateVar;
		this.startAlpha = settings.startAlpha;
		this.endAlpha = settings.endAlpha;
		this.startScale = settings.startScale;
		this.startScaleVar = settings.startScaleVar;
		this.endScale = settings.endScale;
		this.endScaleVar = settings.endScaleVar;
		this.target = null;
		this.targetForce = 0;
		this.accelAngle = settings.accelAngle;//Math.PI / 2
		this.accelAngleVar = settings.accelAngleVar;
		this.accelSpeed = settings.accelSpeed;
		this.accelSpeedVar = settings.accelSpeedVar;
		this.velocityLimit = new Point();
		this.startColor = settings.startColor;
		this.endColor = settings.endColor;
		this.blendMode = settings.blendMode;
	}

	getVariance(value: number): number {
		return (Math.random() * value) * (Math.random() > 0.5 ? -1 : 1);
	}

	addParticle() {
		var particle: Particle = new Particle();

		particle.position.x = this.emitterX + this.getVariance(this.positionVar.x);
		particle.position.y = this.emitterY + this.getVariance(this.positionVar.y);

		var angleVar = this.getVariance(this.angleVar);
		var angle = this.angle + angleVar;
		var speed = this.speed + this.getVariance(this.speedVar);

		particle.setVelocity(angle, speed);

		if (this.angleVar !== this.accelAngleVar) {
            angleVar = this.getVariance(this.accelAngleVar);
        }

		angle = this.accelAngle + angleVar;
		speed = this.accelSpeed + this.getVariance(this.accelSpeedVar);

		particle.setAccel(angle, speed);

		particle.life = this.life + this.getVariance(this.lifeVar);

		particle.sprite = new Phaser.Sprite(
            Script4.core,
            particle.position.x,
            particle.position.y,
            this.texture
        );
		particle.sprite.anchor.set(0.5);
		particle.sprite.particle = particle;
		particle.sprite.blendMode = Phaser.blendModes[this.blendMode];
		particle.sprite.tint = Phaser.Color.getColor(
            this.startColor[0],
            this.startColor[1],
            this.startColor[2]
        );

		particle.rotate = this.rotate + this.getVariance(this.rotateVar);
		particle.velRotate = this.velRotate + this.getVariance(this.velRotateVar);

		particle.deltaColor = [0,0,0];

		for (var i = 0; i < this.startColor.length; i++) {
			if (this.startColor[i] !== this.endColor[i]) {
				particle.deltaColor[i] = this.endColor[i]-this.startColor[i];
				particle.deltaColor[i] /= particle.life;
			} else {
				particle.deltaColor[i] = 0;
			}
		}

		particle.sprite.tint = Phaser.Color.getColor(
            this.startColor[0],
            this.startColor[1],
            this.startColor[2]
        );

		if (this.startAlpha !== this.endAlpha) {
			particle.deltaAlpha = this.endAlpha - this.startAlpha;
			particle.deltaAlpha /= particle.life;
		} else {
			particle.deltaAlpha = 0;
		}

		particle.sprite.alpha = this.startAlpha;

		var startScale = this.startScale + this.getVariance(this.startScaleVar);

		if (this.startScale !== this.endScale) {
			particle.deltaScale = (this.endScale + this.getVariance(this.endScaleVar)) - startScale;
			particle.deltaScale /= particle.life;
		} else {
			particle.deltaScale = 0;
		}

		particle.sprite.scale.x = particle.sprite.scale.y = startScale;

		this.addChild(particle.sprite);
	}

	updateParticle(particle: Particle, delta: number): any {
		if (particle.life > 0) {
            particle.life -= delta;

            if (particle.life <= 0) {
                return this.removeParticle(particle);
            }
        }

        if (this.targetForce > 0) {
            particle.accel.set(this.target.x - particle.position.x, this.target.y - particle.position.y);
            particle.accel.normalize().multiply(this.targetForce, 0);
        }

        particle.velocity.multiplyAdd(particle.accel, delta);

        if (this.velocityLimit.x > 0 || this.velocityLimit.y > 0)  {
            particle.velocity.limit(this.velocityLimit.x);
        }

        if (particle.velRotate) {
            particle.velocity.rotate(particle.velRotate * delta, 0, 0);
        }

        particle.position.multiplyAdd(particle.velocity, 1 * delta);

        if (particle.deltaColor) {
        	var currentColor = Phaser.Color.valueToColor(particle.sprite.tint);
        	var colorValue0 = Math.max(0, currentColor.r + particle.deltaColor[0] * delta);
        	var colorValue1 = Math.max(0, currentColor.g + particle.deltaColor[1] * delta);
        	var colorValue2 = Math.max(0, currentColor.b + particle.deltaColor[2] * delta);
        	particle.sprite.tint = Phaser.Color.getColor(colorValue0, colorValue1, colorValue2);
        }

        if (particle.deltaAlpha) {
            particle.sprite.alpha = Math.max(
                0,
                particle.sprite.alpha + particle.deltaAlpha * delta
            );
        }

        if (particle.deltaScale) {
            particle.sprite.scale.x = particle.sprite.scale.y += particle.deltaScale * delta;
        }

        particle.sprite.rotation += particle.rotate * delta;
        particle.sprite.position.x = particle.position.x;
        particle.sprite.position.y = particle.position.y;
	}

	removeParticle(particle: Particle) {
        particle.sprite.destroy();
	}

	emit(count: number = 1) {
		for (var i = 0; i < count; i++) {
			this.addParticle();
		}
	}

    override update(): void {
        var delta = Script4.core.time.elapsed / 1000;

		this.durationTimer += delta;
        
		if (this.duration > 0) { this.active = this.durationTimer < this.duration; }

		if (this.rate && this.active) {
			this.rateTimer += delta;
			if (this.rateTimer >= this.rate) {
				this.rateTimer = 0;
				this.emit(this.counter);
			}
		}

		for (var i = this.children.length - 1; i >= 0; i--) {
            let obj: any = this.children[i];

			this.updateParticle(obj.particle, delta);
		}

        super.update();
    }

	start(duration = 1.0) {
		this.active = true;
		this.duration = duration;
		this.durationTimer = 0;
		this.emit();
	}

	stop(clearParticles = false) {
		this.active = false;

		if (clearParticles) {
            this.removeChildren();
        }
	}

    override removeFromParent(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }

        super.removeFromParent();
    }

}

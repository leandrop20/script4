import { Matrix } from './Matrix';

export class Transform {

    x: number;
    y: number;
    skewX: number;
    skewY: number;
    scaleX: number;
    scaleY: number;

	constructor(
        x: number = 0,
        y: number = 0,
        skewX: number = 0,
        skewY: number = 0,
        scaleX: number = 1,
        scaleY: number = 1
    ) {
        this.x = x;
        this.y = y;
        this.skewX = skewX;
        this.skewY = skewY;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
	}

	get rotation(): any {
		return this.skewY;
	}

	set rotation(value: any) {
		var dValue = value - this.skewY;
        this.skewX += dValue;
        this.skewY += dValue;
	}

	static normalizeRadian(value: any): any {
        value = (value + Math.PI) % (Math.PI * 2);
        value += value > 0 ? -Math.PI : Math.PI;

        return value;
    }
    
    toString() {
        return "[object Transform] x:"
            + this.x
            + " y:"
            + this.y
            + " skewX:"
            + this.skewX * 180 / Math.PI
            + " skewY:"
            + this.skewY * 180 / Math.PI
            + " scaleX:"
            + this.scaleX
            + " scaleY:"
            + this.scaleY;
    }
    
    copyFrom(value: Transform) {
        this.x = value.x;
        this.y = value.y;
        this.skewX = value.skewX;
        this.skewY = value.skewY;
        this.scaleX = value.scaleX;
        this.scaleY = value.scaleY;

        return this;
    }
    
    clone(): Transform {
        var value = new Transform();
        value.copyFrom(this);

        return value;
    }
    
    identity(): Transform {
        this.x = this.y = this.skewX = this.skewY = 0;
        this.scaleX = this.scaleY = 1;

        return this;
    }
    
    add(value: Transform): Transform {
        this.x += value.x;
        this.y += value.y;
        this.skewX += value.skewX;
        this.skewY += value.skewY;
        this.scaleX *= value.scaleX;
        this.scaleY *= value.scaleY;

        return this;
    }
    
    minus(value: Transform): Transform {
        this.x -= value.x;
        this.y -= value.y;
        this.skewX = Transform.normalizeRadian(this.skewX - value.skewX);
        this.skewY = Transform.normalizeRadian(this.skewY - value.skewY);
        this.scaleX /= value.scaleX;
        this.scaleY /= value.scaleY;

        return this;
    }
    
    fromMatrix(matrix: Matrix): Transform {
        var PI_Q = Math.PI * 0.25;
        var backupScaleX = this.scaleX, backupScaleY = this.scaleY;
        this.x = matrix.tx;
        this.y = matrix.ty;
        this.skewX = Math.atan(-matrix.c / matrix.d);
        this.skewY = Math.atan(matrix.b / matrix.a);

        if (this.skewX != this.skewX)
            this.skewX = 0;
        if (this.skewY != this.skewY)
            this.skewY = 0;
        this.scaleY = (this.skewX > -PI_Q && this.skewX < PI_Q) ? matrix.d / Math.cos(this.skewX) : -matrix.c / Math.sin(this.skewX);
        this.scaleX = (this.skewY > -PI_Q && this.skewY < PI_Q) ? matrix.a / Math.cos(this.skewY) : matrix.b / Math.sin(this.skewY);

        if (backupScaleX >= 0 && this.scaleX < 0) {
            this.scaleX = -this.scaleX;
            this.skewY = this.skewY - Math.PI;
        }

        if (backupScaleY >= 0 && this.scaleY < 0) {
            this.scaleY = -this.scaleY;
            this.skewX = this.skewX - Math.PI;
        }

        return this;
    }

    /**
     * @version DragonBones 3.0
     */
    toMatrix(matrix: Matrix): Transform {
        matrix.a = this.scaleX * Math.cos(this.skewY);
        matrix.b = this.scaleX * Math.sin(this.skewY);
        matrix.c = -this.scaleY * Math.sin(this.skewX);
        matrix.d = this.scaleY * Math.cos(this.skewX);
        matrix.tx = this.x;
        matrix.ty = this.y;
        
        return this;
    }

}
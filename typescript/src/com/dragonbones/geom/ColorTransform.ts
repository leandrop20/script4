export class ColorTransform {

    alphaMultiplier: number;
    redMultiplier: number;
    greenMultiplier: number;
    blueMultiplier: number;
    alphaOffset: number;
    redOffset: number;
    greenOffset: number;
    blueOffset: number;

	constructor(
        alphaMultiplier: number = 1,
        redMultiplier: number = 1,
        greenMultiplier: number = 1,
        blueMultiplier: number = 1, 
		alphaOffset: number = 0,
        redOffset: number = 0,
        greenOffset: number = 0,
        blueOffset: number = 0
    ) {

		this.alphaMultiplier = alphaMultiplier;
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaOffset = alphaOffset;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
	}

	copyFrom(value: ColorTransform) {
        this.alphaMultiplier = value.alphaMultiplier;
        this.redMultiplier = value.redMultiplier;
        this.greenMultiplier = value.greenMultiplier;
        this.blueMultiplier = value.blueMultiplier;
        this.alphaOffset = value.alphaOffset;
        this.redOffset = value.redOffset;
        this.redOffset = value.redOffset;
        this.greenOffset = value.blueOffset;
    }

    identity() {
        this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1;
        this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
    }

}
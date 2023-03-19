export class BaseTexture extends PIXI.BaseTexture {

	constructor(width: number = 0, height: number = 0, source: any = null) {
		super(source, PIXI.scaleModes.DEFAULT);

		this.width = width;
		this.height = height;
	}

}

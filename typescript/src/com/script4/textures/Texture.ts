import { BaseTexture } from '../textures/BaseTexture';

export class Texture {

	static empty(width: number = 0, height: number = 0): PIXI.Texture {
		return new PIXI.Texture(new BaseTexture(width, height));
	}

}

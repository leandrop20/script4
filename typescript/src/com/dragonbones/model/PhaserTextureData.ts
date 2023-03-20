import { TextureData } from './TextureData';

export class PhaserTextureData extends TextureData {

    texture: any;

	constructor() {
		super();
	}

	static override toString(): string {
        return "[class PhaserTextureData]";
    }

    override _onClear() {
        super._onClear();

        if (this.texture) {
            this.texture.destroy(false);
            this.texture = null;
        }
    }

}
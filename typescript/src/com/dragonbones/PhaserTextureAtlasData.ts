import { TextureAtlasData } from './TextureAtlasData';
import { PhaserTextureData } from './PhaserTextureData';
import { BaseObject } from './BaseObject';

export class PhaserTextureAtlasData extends TextureAtlasData {

    texture: any;

	constructor() {
		super();
	}

	static override toString() {
        return "[class PhaserTextureAtlasData]";
    }

    override _onClear() {
        super._onClear();
        if (this.texture) {
            this.texture = null;
        }
    }

    generateTextureData() {
        return BaseObject.borrowObject(PhaserTextureData);
    }

}
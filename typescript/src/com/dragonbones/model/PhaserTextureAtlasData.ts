import { TextureAtlasData } from './TextureAtlasData';
import { PhaserTextureData } from './PhaserTextureData';
import { BaseObject } from '../core/BaseObject';

export class PhaserTextureAtlasData extends TextureAtlasData {

    texture: any;

	constructor() {
		super();
	}

	static override toString(): string {
        return "[class PhaserTextureAtlasData]";
    }

    override _onClear() {
        super._onClear();

        if (this.texture) {
            this.texture = null;
        }
    }

    generateTextureData(): any {
        return BaseObject.borrowObject(PhaserTextureData);
    }

}
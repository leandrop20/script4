import TextureData from './TextureData';

export default class PhaserTextureData extends TextureData {

	constructor() {
		super();
	}

	static toString() {
        return "[class PhaserTextureData]";
    }

    _onClear() {
        super._onClear();
        if (this.texture) {
            this.texture.destroy(false);
            this.texture = null;
        }
    }

}
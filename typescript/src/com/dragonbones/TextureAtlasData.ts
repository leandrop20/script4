import { BaseObject } from './BaseObject';

export class TextureAtlasData extends BaseObject {

    textures: any;
    autoSearch!: boolean;
    scale!: number;
    name: any;
    imagePath: any;

	constructor() {
		super();

		this.textures = {};
	}

	override _onClear() {
        for (var i in this.textures) {
            this.textures[i].returnToPool();
            delete this.textures[i];
        }
        this.autoSearch = false;
        this.scale = 1;
        this.name = null;
        this.imagePath = null;
    }

    addTexture(value: any) {
        if (value && value.name && !this.textures[value.name]) {
            this.textures[value.name] = value;
            value.parent = this;
        }
        else {
            throw new Error();
        }
    }

    getTexture(name: string) {
        return this.textures[name];
    }

}
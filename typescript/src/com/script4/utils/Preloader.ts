import { Assets } from '../../../Assets';
import { AssetType } from '../enums/AssetType';

export class Preloader {

    world: any;
    game: any;
    add: any;
    load: any;
    ready: any;

    logo: any;
    boxBar: any;
    bar: any;
    bgBar: any;

    preload() {
        this.logo = this.add.sprite(
            this.world.width * 0.5,
            (this.world.height * 0.5) - 15,
            'imgLoad'
        );
		this.logo.anchor.set(0.5);

        this.boxBar = this.add.group();
		this.boxBar.position.set(this.world.width * 0.5, (this.world.height * 0.5) + 60);

        this.bar = this.boxBar.create(0, 0, 'imgBar');
		this.bar.anchor.set(0.0, 0.5);
		this.bar.width = 208;
		this.bar.position.set(-(this.bar.width * 0.5) -3, -3);
		this.bar.scale.set((0.0 * this.bar.width) / 8, 1.0);

        this.bgBar = this.boxBar.create(0, 0, 'imgBgBar');
		this.bgBar.anchor.set(0.5);

        this.load.onFileComplete.add(this.fileComplete, this);
		this.load.onLoadComplete.add(this.loadComplete, this);
    }

    create() {
        for (let asset of Assets.ASSETS) {
            switch (asset.type) {
                case AssetType.IMAGE: this.load.image(asset.name, asset.path); break;
                case AssetType.AUDIO: this.load.audio(asset.name, asset.path); break;
                case AssetType.SPINE: this.load.spine(asset.name, asset.path); break;
                case AssetType.SPRITE_SHEET: this.load.spritesheet(asset.name, asset.path); break;
				case AssetType.ATLAS:
					this.load.atlas(
						asset.name,
						asset.path.substring(0, asset.path.length - 4) + 'png',
						asset.path
					);
					this.load.json(
						asset.name + "Data",
						asset.path.substring(0, asset.path.length - 4) + 'json',
						asset.path
					);
					break;
				case AssetType.BITMAP_FONT:
					this.load.bitmapFont(
						asset.name, 
						asset.path.substring(0, asset.path.length - 3) + 'png',
						asset.path
					);
					break;
				case AssetType.PARTICLE:
					this.load.image(asset.name, asset.path);
					this.load.json(
						asset.name + 'Settings',
						asset.path.substring(0, asset.path.length - 3) + 'json',
						asset.path
					);
					break;
				case AssetType.XML: this.load.xml(asset.name, asset.path); break;
				case AssetType.DRAGONBONES: this.load.dragonbones(asset.name, asset.path); break;
				case AssetType.TILE_MAP:
					this.load.tilemap(asset.name, asset.path, null, Phaser.Tilemap.TILED_JSON);
					this.load.image(
						asset.name,
						asset.path.substring(0, asset.path.length - 4) + 'png'
					);
					break;
            }
        }

        this.load.start();
    }

    fileComplete(progress: number) {
        if (this.bar) {
			this.bar.scale.set(((progress / 100) * 208) / 8, 1.0);
		}
    }

    loadComplete() {
        this.ready = true;
		this.world.removeAll();
		new this.game.rootClass();
    }

}

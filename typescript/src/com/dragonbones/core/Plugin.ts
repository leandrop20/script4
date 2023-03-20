export default class Plugin extends Phaser.Plugin {

	constructor(game: any, parent: any) {
		super(game, parent);
		this.addLoader();
	}

	addLoader() {
		let phaserLoader: any = Phaser.Loader;

		phaserLoader.prototype.dragonbones =
			function (key: any, url: any, scalingVariant: any, group: any) {
				var path = url.substr(0, url.lastIndexOf("."));

				this.image(key, path + ".png");
				this.json(key, path + ".json");
				this.json(key + "Ske", path + "Ske.json");
			};
	}

}
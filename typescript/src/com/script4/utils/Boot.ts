declare var PhaserSpine: any;

import '@azerion/phaser-spine/build/phaser-spine';
import DragonBonesPlugin from '../../dragonbones/Plugin';
import { Assets } from '../../../Assets';
import { Script4 } from '../Script4';

export class Boot {

    game: any;
    load: any;
    state: any;

    preload() {
        // this.game.plugins.add(PhaserSpine.SpinePlugin);
        this.game.plugins.add(DragonBonesPlugin);
        this.game.load.baseURL = Assets.BASE_PATH;

        if (this.game.config.crossOrigin) {
			this.game.load.crossOrigin = this.game.config.crossOrigin;
		}

        for (let image of Script4.imageToPreloader) {
            this.load.image(image.name, image.url);
        }
    }

    create() {
        this.state.start(Script4.customPreloader.name);
    }

}

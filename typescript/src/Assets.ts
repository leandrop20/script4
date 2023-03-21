import { AssetType } from './com/script4/enums/AssetType';
import { IAsset } from './com/script4/interface/IAsset';

export class Assets {

    static readonly BASE_PATH: string = '';

    /**
	*    name string
	*   path string
	*   type AssetType
	*/
    static readonly ASSETS: IAsset[] = [
        { name: 'imgExample', path: 'assets/images/gameExample.png', type: AssetType.IMAGE },
        { name:'coin', path:'assets/sounds/coin.mp3', type: AssetType.AUDIO },
        { name:'spineboy', path:'assets/animations/spineboy.json', type: AssetType.SPINE },
        { name:'pipoqueiro', path:'assets/animations/pipoqueiro.json', type: AssetType.SPINE },
        { name: 'dragon', path:'assets/animations/dragon.json', type: AssetType.DRAGONBONES },
        { name: 'demon', path:'assets/animations/demon.json', type: AssetType.DRAGONBONES },
        { name:'btExample', path:'assets/images/btExample.png', type: AssetType.IMAGE },
        { name: 'atlas', path:'assets/images/sprites.json', type: AssetType.ATLAS },
        { name: 'bitmapFont', path:'assets/fonts/bitmapfont.xml', type: AssetType.BITMAP_FONT },
        { name:'particle', path:'assets/particles/starParticle.png', type: AssetType.PARTICLE },
        { name:'particle2', path:'assets/particles/starParticle2.png', type: AssetType.PARTICLE }
    ];

}

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
        // { name:'coin', path:'assets/sounds/coin.mp3', type:'audio' },
        // { name:'spineboy', path:'assets/animations/spineboy.json', type:'spine'},
        // { name:'pipoqueiro', path:'assets/animations/pipoqueiro.json', type:'spine'},
        { name: 'dragon', path:'assets/animations/dragon.json', type: AssetType.DRAGONBONES },
        // { name:'btExample', path:'assets/images/btExample.png', type:'image'},
        // { name: 'atlas', path:'assets/images/sprites.json', type:'atlas' },
        // { name: 'bitmapFont', path:'assets/fonts/bitmapfont.xml', type:'bitmapfont' },
        // { name:'particle', path:'assets/particles/starParticle.png', type:'particle'},
        // { name:'particle2', path:'assets/particles/starParticle2.png', type:'particle'}
    ];

}

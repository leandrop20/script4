export default class Assets {

	static get basePath() { return ''; }

	/**
	* name string
	* path string
	* type string (image, audio, spine, atlas, bitmapfont, particle, dragonbones)
	*/
	static get ASSETS() {
		return [
			{ name:'imgExample', path:'assets/images/gameExample.png', type:'image' },
			// { name:'coin', path:'assets/sounds/coin.mp3', type:'audio' },
			// { name:'spineboy', path:'assets/animations/spineboy.json', type:'spine'},
			// { name:'pipoqueiro', path:'assets/animations/pipoqueiro.json', type:'spine'},
			{ name:'dragon', path:'assets/animations/dragon.json', type:'dragonbones'},
			// { name:'btExample', path:'assets/images/btExample.png', type:'image'},
			// { name: 'atlas', path:'assets/images/sprites.json', type:'atlas' },
			// { name: 'bitmapFont', path:'assets/fonts/bitmapfont.xml', type:'bitmapfont' },
			// { name:'particle', path:'assets/particles/starParticle.png', type:'particle'},
			// { name:'particle2', path:'assets/particles/starParticle2.png', type:'particle'}
		];
	}

}
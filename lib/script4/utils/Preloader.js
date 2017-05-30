class Preloader
{
	preload()
	{
		this.logo = this.add.sprite(this.world.width*0.5, (this.world.height*0.5)-15, 'imgLoad');
		this.logo.anchor.set(0.5);

		this.boxBar = this.add.group();
		this.boxBar.position.set(this.world.width*0.5, (this.world.height*0.5)+60);

		this.bar = this.boxBar.create(0, 0, 'imgBar');
		this.bar.anchor.set(0.0, 0.5);
		this.bar.width = 208;
		this.bar.position.set(-(this.bar.width*0.5)-3, -3);
		this.bar.scale.set((0.0*this.bar.width)/8, 1.0);

		this.bgBar = this.boxBar.create(0, 0, 'imgBgBar');
		this.bgBar.anchor.set(0.5);

		this.load.onFileComplete.add(this.fileComplete, this);
		this.load.onLoadComplete.add(this.loadComplete, this);
	}

	create()
	{
		for (var i=0;i<ASSETS.length;i++) {
			switch(ASSETS[i].type) {
				case 'image':
					this.load.image(ASSETS[i].name, ASSETS[i].path);
					break;
				case 'audio':
					this.load.audio(ASSETS[i].name, ASSETS[i].path);
					break;
				case 'spine':
					this.load.spine(ASSETS[i].name, ASSETS[i].path);
					break;
				case 'spritesheet':
					this.load.spritesheet(ASSETS[i].name, ASSETS[i].path);
					break;
				case 'atlas':
					this.load.atlas(ASSETS[i].name, ASSETS[i].path.substr(0, ASSETS[i].path.length-4) + 'png', ASSETS[i].path);
					break;
				case 'bitmapfont':
					this.load.bitmapFont(ASSETS[i].name, ASSETS[i].path.substr(0, ASSETS[i].path.length-3) + 'png', ASSETS[i].path);
					 break;
				case 'particle':
					this.load.image(ASSETS[i].name, ASSETS[i].path);
					this.load.json(ASSETS[i].name + 'Settings', ASSETS[i].path.substr(0, ASSETS[i].path.length-3) + 'json', ASSETS[i].path);
					break;
			}
		}

		this.load.start();
	}

	fileComplete(progress)
	{
		this.bar.scale.set(((progress/100)*208)/8, 1.0);
	}

	loadComplete()
	{
		this.ready = true;
		this.world.removeAll();
		new this.game.rootClass();
	}
}
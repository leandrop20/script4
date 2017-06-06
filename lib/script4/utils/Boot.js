class Boot
{
	preload()
	{
		this.game.plugins.add(PhaserSpine.SpinePlugin);

		this.load.image('imgBar', Core.basePath + 'assets/images/imgBar.png');
		this.load.image('imgBgBar', Core.basePath + 'assets/images/imgBgBar.png');
		this.load.image('imgLoad', Core.basePath + 'assets/images/imgLoad.png');
	}

	create()
	{
		this.state.start('Preloader');
	}
}
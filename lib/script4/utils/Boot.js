class Boot
{
	preload()
	{
		this.game.plugins.add(PhaserSpine.SpinePlugin);

		this.load.image('imgBar', 'assets/images/imgBar.png');
		this.load.image('imgBgBar', 'assets/images/imgBgBar.png');
		this.load.image('imgLoad', 'assets/images/imgLoad.png');
	}

	create()
	{
		this.state.start('Preloader');
	}
}
class Main extends Phaser.Game
{
	constructor()
	{
		super(768, 450, Phaser.AUTO);

		this.state.add('PreLoader', new Preloader);
		this.state.start('PreLoader');
	}

	create()
	{
		console.log('sd');
	}
}
new Main();
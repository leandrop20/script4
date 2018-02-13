class Boot {
	
	preload() {
		this.game.plugins.add(PhaserSpine.SpinePlugin);

		for (var i=0;i<Script4.imagesToPreLoader.length;i++) {
			this.load.image(Script4.imagesToPreLoader[i].name, Core.basePath + Script4.imagesToPreLoader[i].url);
		}
	}

	create()
	{
		this.state.start(Script4.customPreloader.name);
	}

}
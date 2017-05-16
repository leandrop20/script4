class Root extends Container
{
	constructor()
	{
		super();

		var t = new Sprite('imgExample');
		t.position.set(130, 110);
		t.scale.set(0.37);
		this.addChild(t);

		var t2 = new Sprite('imgLoad');
		t2.position.set(Script4.width-90, 40);
		this.addChild(t2);

		var spine = new Spine('spineboy', Script4.width*0.5, Script4.height);
		spine.scale.set(0.6);
		spine.play('walk', true);
		this.addChild(spine);

		var bt = new SimpleButton('btExample', 100, 350);
		this.addChild(bt);

		bt.addEventListener(Event.TRIGGERED, onTest);
		function onTest()
		{
			console.log('TRIGGERED');
		}

		var atlasImg = new Sprite('atlas.coin', 600, 400);
		this.addChild(atlasImg);

		var atlasImg = new Sprite('atlas.danger', 660, 400);
		this.addChild(atlasImg);

		var atlasImg = new Sprite('atlas.super', 660, 300);
		this.addChild(atlasImg);

		var atlasImg = new Sprite('atlas.world', 660, 350);
		this.addChild(atlasImg);

		var tf = new TextField(200, 100, 'bitmapFont', 'Hello World! É Ã Ô');
		tf.position.set(600, 200);
		// tf.appendText('mais isso');
		tf.text = 'asdasdasd as asdas';
		this.addChild(tf);
	}
}
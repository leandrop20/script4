class Root extends Container
{
	constructor()
	{
		super();

		/*var t = new Sprite('imgExample');
		t.position.set(130, 110);
		t.scale.set(0.37);
		this.addChild(t);*/

		/*var t2 = new Sprite('imgLoad');
		t2.position.set(Script4.width-90, 40);
		this.addChild(t2);*/

		/*var spine = new Spine('pipoqueiro', Script4.width*0.5, Script4.height);
		spine.play('walk', true);
		this.addChild(spine);
		spine.addEventListener(TouchEvent.TOUCH, onTouch);
		function onTouch(e)
		{
			if (e.phase == TouchPhase.BEGAN) {
				trace('BEGAN');
			} else if (e.phase == TouchPhase.MOVED) {
				trace('MOVED');
			} else if (e.phase == TouchPhase.ENDED) {
				trace('ENDED');
			}
		}

		var bt = new SimpleButton('btExample', 100, 350);
		this.addChild(bt);
		bt.addEventListener(Event.TRIGGERED, onTest);
		function onTest()
		{
			console.log('TRIGGERED');
		}*/

		/*var atlasImg = new Sprite('atlas.coin', 600, 400);
		this.addChild(atlasImg);

		var atlasImg = new Sprite('atlas.danger', 660, 400);
		this.addChild(atlasImg);

		var atlasImg = new Sprite('atlas.super', 660, 300);
		this.addChild(atlasImg);

		var atlasImg = new Sprite('atlas.world', 660, 350);
		this.addChild(atlasImg);*/

		// var tf = new TextField(280, 60, 'bitmapFont', 'Hello á World!');
		// tf.hAlign = Align.CENTER;
		// tf.vAlign = Align.BOTTOM;
		// tf.align(Align.CENTER, Align.MIDDLE);
		// tf.position.set(480, 180);
		// tf.appendText(' mais isso');
		// tf.text = 'ÁÂÃáâãÉéÓÔÕô';
		// tf.border = true;
		// this.addChild(tf);

		var container = new Container();
		container.name = 'container';
		this.addChild(container);

		var b1 = new Sprite('imgExample');
		b1.name = 'b1';
		b1.position.set(200, 280);
		b1.scale.set(0.2);
		container.addChild(b1);

		var b2 = new Sprite('imgExample');
		b2.name = 'b2';
		b2.position.set(400, 280);
		b2.scale.set(0.2);
		container.addChild(b2);

		var b3 = new TextField(280, 60, 'bitmapFont', 'Hello Touch');
		b3.align(Align.CENTER, Align.MIDDLE);
		b3.border = true;
		b3.position.set(500, 150);
		container.addChild(b3);

		var b4 = new Spine('pipoqueiro');
		b4.position.set(600, 320);
		b4.play('walk', true);
		container.addChild(b4);

		container.addEventListener(TouchEvent.TOUCH, onTouch);
		function onTouch(e) {
			var touch = e.getTouch(b4);
			if (touch) {
				if (touch.phase == TouchPhase.MOVED) {
					touch.target.x = touch.globalX;
					touch.target.y = touch.globalY;
				}
			}
		}
	}
}
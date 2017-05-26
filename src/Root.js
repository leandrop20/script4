class Root extends Sprite
{
	constructor()
	{
		super();

		var t = new ImageSuper('imgExample');
		t.position.set(130, 110);
		t.scale.set(0.37);
		this.addChild(t);

		var t2 = new ImageSuper('imgLoad');
		t2.position.set(Script4.width-90, 40);
		this.addChild(t2);

		var spine = new Spine('pipoqueiro', Script4.width*0.5, Script4.height);
		spine.play('walk', true);
		this.addChild(spine);

		var bt = new ButtonSuper('btExample', 100, 350);
		this.addChild(bt);
		bt.addEventListener(Event.TRIGGERED, onTest);
		function onTest()
		{
			console.log('TRIGGERED');
		}

		var atlasImg = new ImageSuper('atlas.coin', 600, 400);
		this.addChild(atlasImg);

		var atlasImg = new ImageSuper('atlas.danger', 660, 400);
		this.addChild(atlasImg);

		var atlasImg = new ImageSuper('atlas.super', 660, 300);
		this.addChild(atlasImg);

		var atlasImg = new ImageSuper('atlas.world', 660, 350);
		this.addChild(atlasImg);

		var tf = new TextField(280, 60, 'bitmapFont', 'Hello á World!');
		// tf.hAlign = Align.CENTER;
		// tf.vAlign = Align.BOTTOM;
		tf.align(Align.CENTER, Align.MIDDLE);
		tf.position.set(480, 180);
		// tf.appendText(' mais isso');
		// tf.text = 'ÁÂÃáâãÉéÓÔÕô';
		tf.border = true;
		this.addChild(tf);

		var container = new Sprite();
		container.name = 'container';
		this.addChild(container);

		var b1 = new ImageSuper('imgExample');
		b1.name = 'b1';
		b1.position.set(200, 280);
		b1.scale.set(0.2);
		container.addChild(b1);

		var b2 = new ImageSuper('imgExample');
		b2.name = 'b2';
		b2.position.set(400, 280);
		b2.scale.set(0.2);
		container.addChild(b2);

		var b3 = new TextField(280, 60, 'bitmapFont', 'Hello Touch');
		b3.align(Align.CENTER, Align.MIDDLE);
		b3.border = true;
		b3.position.set(500, 110);
		container.addChild(b3);

		var b4 = new Spine('pipoqueiro');
		b4.position.set(600, 320);
		b4.play('walk', true);
		container.addChild(b4);

		var objDrag;
		this.addEventListener(TouchEvent.TOUCH, onTouch);
		function onTouch(e) {
			var touch = e.getTouch(t2);
			if (touch) {
				if (touch.phase == TouchPhase.BEGAN) {
					objDrag = touch.target;
				} else if (touch.phase == TouchPhase.MOVED) {
					if (objDrag) {
						objDrag.position.set(touch.globalX, touch.globalY);
						for (var i=0;i<container.numChildren;i++) {
							if (objDrag.getBounds().intersects(container.getChildAt(i).getBounds())) {
								container.removeChild(container.getChildAt(i));
							}
						}
					}
				} else if (touch.phase == TouchPhase.ENDED) {
					objDrag = null;
				}
			}
		}

		this.addEventListener(Event.ENTER_FRAME, loop);
		function loop(e) {
			spine.position.x -= 2;
			if (spine.position.x <= 0) {
				spine.position.x = 770;
			}
			if (spine.position.x == 600) {
				this.removeEventListener(Event.ENTER_FRAME, loop);
			}
		}

		var tile = new TileSprite('atlas.world', 250, 20, 200, 150);
		this.addChild(tile);

		Script4.juggler.tween(bt, 1.5, { alpha:0.0 });
	}
}
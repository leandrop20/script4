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
	}
}
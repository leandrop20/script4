class Root extends Sprite
{
	constructor()
	{
		super();

		var t = new Image4('imgExample');
		t.position.set(130, 110);
		t.scale.set(0.37);
		this.addChild(t);

		var t2 = new Image4('imgLoad');
		t2.position.set(Script4.width-90, 40);
		this.addChild(t2);

		var spine = this.game.add.spine(Script4.width*0.5, Script4.height, 'spineboy');
		spine.scale.set(0.6);
		spine.setAnimationByName(0, 'walk', true);
	}
}
class Spine extends PhaserSpine.Spine
{
	constructor(armatureName, x = 0, y = 0)
	{
		super(core, armatureName);
		this.position.set(x, y);
		this.inputEnableChildren = true;

		this.box = new Graphics(-(this.width*0.5), -(this.height));
		this.box.name = 'null';
		this.box.inputEnabled = true;
		this.box.beginFill(0x428B36);
		this.box.drawRect(0, 0, this.width, this.height);
		this.box.endFill();
		this.box.alpha = 0.3;
		this.addChild(this.box);
		var _this = this;
		this.box.events.onDragUpdate.add(function(e) {
			// if (e.input.isDragged) {
			// 	_this.x = pointer.playerStart.x - pointer.positionDown.x + pointer.x;
   //  			_this.y = pointer.playerStart.y - pointer.positionDown.y + pointer.y;
			// }
			_this.x = e.x;
		    // call the generic implementation:
		    Phaser.InputHandler.prototype.updateDrag.call(this,e);
		});

		addEventListener('onEnterFrame', function(){ console.log('frame	'); })
	}

	set name(value)
	{
		if (this.box) { this.box.name = value; }
	}

	play(animationName, isLoop = false)
	{
		this.setAnimationByName(0, animationName, isLoop);
	}

	addEventListener(type, listener)
	{
		if (type == 'touch') {
			this['onChildInputDown'].add(listener);
			this['onChildInputUp'].add(listener);
		}
	}

	removeEventListener(type, listener)
	{
		if (type == 'touch') {
			this['onChildInputDown'].remove(listener);
			this['onChildInputUp'].remove(listener);
		}
	}
}
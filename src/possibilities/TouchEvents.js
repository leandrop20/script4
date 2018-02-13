class TouchEvents extends Sprite {

	constructor() {
		super();

		this.imgSelected;

		var img = new ImageSuper('atlas.tree');
		img.position.set(Script4.width * 0.5, Script4.height * 0.5);
		this.addChild(img);

		this.addEventListener(TouchEvent.TOUCH, this.getTouch);
	}

	getTouch(e) {
		var touch = e.getTouch(this);

		if (touch) {
			if (touch.phase == TouchPhase.BEGAN) {
				this.imgSelected = touch.target;
				if (this.numChildren < 5) {
					this.newImage = new ImageSuper('atlas.tree');
					this.newImage.x = Math.random() * (Script4.width + 100) - 50;
					this.newImage.y = Math.random() * (Script4.height + 100) - 50;
					this.addChild(this.newImage);
				}
			}
			if (touch.phase == TouchPhase.MOVED) {
				if (this.imgSelected) {
					this.imgSelected.x = touch.globalX;
					this.imgSelected.y = touch.globalY;
				}
			}
			if (touch.phase == TouchPhase.ENDED) {
				this.imgSelected = null;
			}
		}
	}

}
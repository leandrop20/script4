class ImageSuper extends Phaser.Image
{
	/**
	* texture = if atlas (atlas.textureName) or textureName only!
	*/
	constructor(texture, x = 0, y = 0)
	{
		var atlas = texture;
		if (texture.indexOf('.') != -1) {
			var parts = texture.split('.');
			atlas = parts[0];
			texture = parts[1] + '.png';
		} else {
			texture = null;
		}
		super(core, x, y, atlas, texture);
		this.inputEnabled = true;
		this.anchor.set(0.5);
	}
}
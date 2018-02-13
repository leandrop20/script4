class Main extends Script4
{
	static get imports() { return [
		'src/Assets',
		'src/Root',
		//IMPORT YOUR CLASSES HERE!
		'src/possibilities/TouchEvents'
	]; };

	constructor()
	{
		super(Root);
		this.setShowStats = true;
		this.start();
	}
}
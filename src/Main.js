class Main extends Script4
{
	static get imports() { return [
		'src/Assets',
		'src/Root'
		//IMPORT YOUR CLASSES HERE!
	]; };

	constructor()
	{
		super(Root);
		this.setShowStats = true;
		this.start();
	}
}
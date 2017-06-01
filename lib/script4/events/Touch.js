class Touch
{
	static get previous(){ return this._previous; }
	static set previous(target){ this._previous = target; }

	constructor(target, phase, globalX, globalY)
	{
		this.target = target;
		this.phase = phase;
		this.globalX = globalX;
		this.globalY = globalY;
	}
}
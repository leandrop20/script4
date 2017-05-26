class Juggler
{
	constructor(core)
	{
		this.core = core;
		this.tween = function(target, time, properties) {
			this.core.add.tween(target).to(properties, time*1000, properties.transition, true);
		}
	}
}
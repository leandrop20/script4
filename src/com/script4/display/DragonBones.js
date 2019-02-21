import Script4 from '../Script4';
import PhaserDragonBones from '../../dragonbones/DragonBones';

export default class DragonBones extends PhaserDragonBones {

	/**
	*
	* @param armatureName String
	* @param x Number
	* @param y Number
	* @param _args Array [{ anime:, func: }]
	*/
	constructor(armatureName, x = 0, y = 0, _args = []) {
		super(Script4.core, armatureName);

		this.position.set(x, y);
	}

	play(animationName, playTimes = -1) {
		this.armature.animation.play(animationName, playTimes);
	}

	set debug(value) {
		this.armature.debugDraw = value;
	}

}
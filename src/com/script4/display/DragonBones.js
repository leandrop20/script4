import Script4 from '../Script4';
import PhaserDragonBones from '../../dragonBones';

export default class DragonBones extends PhaserDragonBones.DragonBones {

	/**
	*
	* @param armatureName String
	* @param x Number
	* @param y Number
	* @param _args Array [{ anime:, func: }]
	*/
	constructor(armatureName, x = 0, y = 0, _args = []) {
		super(Script4.core, armatureName);
	}

}
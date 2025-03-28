import { Script4 } from '../Script4';
import { PhaserDragonBones } from '../../dragonbones/PhaserDragonBones';
import { Event } from '../enums/Event';
import { IAnimationArg } from '../interface/IAnimationArg';
import { Graphics } from './Graphics';
import { ImageSuper } from './ImageSuper';

export class DragonBones extends PhaserDragonBones {

    args: IAnimationArg[];
    ID: string;

	/**
	*
	* @param armatureName String
	* @param x Number
	* @param y Number
	* @param _args Array [{ anime:, func: }]
	*/
	constructor(armatureName: string, x = 0, y = 0, _args: IAnimationArg[] = []) {
		super(Script4.core, armatureName);
		this.args = _args;
		this.ID = armatureName;

		this.position.set(x, y);
		this.debug = true;
		this.smoothed = true;

		this.addEventListener(Event.ENTER_FRAME, this.onUpdate);
		
		// console.log("Animations " + armatureName + ": " + this.armature.animation.animationNames);
	}

	animationNames(): any {
		return this.armature.animation.animationNames;
	}

	play(animationName: string, playTimes = -1): void {
		this.armature.animation.play(animationName, playTimes);
	}

	set debug(bool: boolean) {
		DragonBones.debug = DragonBones.debugDraw = bool;
	}

	set smoothed(bool: boolean) {
		for (let slot of this.armature._armature._slots) {
			slot.display.smoothed = bool;
		}
	}

	getBone(name: string): any {
		return this.armature._armature.getBone(name);
	}

	getSlot (name: string): any {
		return this.armature._armature.getSlot(name);
	}

	factoryImage(name: string, dragonName: any = null): Phaser.Sprite | null {
		dragonName = (dragonName) ? dragonName : this.ID;
		return this.factory.getTextureDisplay(name, dragonName);
	}

	onUpdate(e: any): void {		
		if (this.armature.animation.isCompleted) {
			if (this.args != null) {
				for (let i = 0; i < this.args.length; i++) {
					if (this.armature.animation.lastAnimationState.name == this.args[i].anime) {
						this.args[i].func();
						break;
					}
				}
			}
		}
	}

	removeEvent(): void {
		this.removeEventListener(Event.ENTER_FRAME, this.onUpdate);
		this.armature.dispose();
		this.factory.removeTextureAtlasData(this.ID, true);
		this.factory.removeDragonBonesData(this.ID, true);
		this.removeFromParent();
	}

}

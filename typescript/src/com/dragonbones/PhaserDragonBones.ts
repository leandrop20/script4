import { PhaserFactory } from './factory/PhaserFactory';
import { Sprite } from '../script4/display/Sprite';

export class PhaserDragonBones extends Sprite {

    static GAME: any;
    static debug: boolean = false;
    static debugDraw: boolean = false;
    static _armatures: any[] = [];

    static PI_D: number = Math.PI * 2;
    static PI_H: number = Math.PI / 2;
    static PI_Q: number = Math.PI / 4;
    static ANGLE_TO_RADIAN: number = Math.PI / 180;
    static RADIAN_TO_ANGLE: number = 180 / Math.PI;
    static SECOND_TO_MILLISECOND: number = 1000;
    static NO_TWEEN: number = 100;
    static VERSION: string = '4.7.2';

    static hasArmature(value: any): any {
        return PhaserDragonBones._armatures.indexOf(value) >= 0;
    }
    
    static addArmature(value: any) {
        if (value && PhaserDragonBones._armatures.indexOf(value) < 0) {
            PhaserDragonBones._armatures.push(value);
        }
    }

    static removeArmature(value: any) {
        if (value) {
            var index = PhaserDragonBones._armatures.indexOf(value);
            if (index >= 0) {
                PhaserDragonBones._armatures.splice(index, 1);
            }
        }
    }

    factory: PhaserFactory;
    skeleton: any;
    armature: any;

	constructor(game: any, armatureName: string) {
		super(game);

		PhaserDragonBones.GAME = game;

		var key: string = armatureName.toLowerCase();

		var skeletonData: any = this.game.cache.getJSON(key + "Ske");
        var textureData: any = this.game.cache.getJSON(key);
		var texture: any = this.game.cache.getImage(key);

        this.factory = new PhaserFactory();
		this.skeleton = this.factory.parseDragonBonesData(skeletonData);
		this.factory.parseTextureAtlasData(textureData, texture);
        
		this.armature = this.factory.buildArmatureDisplay(armatureName);
        
		this.refreshClock();
        
		this.addChild(this.armature);
	}

	refreshClock() {
		var hasEvent = false;
        var callback = PhaserFactory._clockHandler;

        this.game.time.events.events.forEach(function (event, index, array) {
            if (event.callback == callback) {
                hasEvent = true;
                return;
            }
        });

        if (!hasEvent) {
            this.game.time.events.loop(20, PhaserFactory._clockHandler, PhaserFactory);
        }
	}

}

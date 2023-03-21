import { BaseFactory } from './BaseFactory';
import { PhaserArmatureDisplay } from '../armature/PhaserArmatureDisplay';
import { WorldClock } from '../animation/WorldClock';
import { BaseObject } from '../core/BaseObject';
import { PhaserTextureAtlasData } from '../model/PhaserTextureAtlasData';
import { Armature } from '../armature/Armature';
import { Animation } from '../animation/Animation';
import { PhaserSlot } from '../armature/PhaserSlot';
import { PhaserDragonBones } from '../PhaserDragonBones';

export class PhaserFactory extends BaseFactory {

    static _factory: any = null;
    static _eventManager: any = null;
 	static _clock: any = null;

	constructor(dataParser = null) {
		super(dataParser);

		if (!PhaserFactory._eventManager) {
			PhaserFactory._eventManager = new PhaserArmatureDisplay();
			PhaserFactory._clock = new WorldClock();
		}
	}

	static _clockHandler(passedTime: number) {
        PhaserFactory._clock.advanceTime(-1); // passedTime !?
    }

    get factory() {
    	if (!PhaserFactory._factory) {
            PhaserFactory._factory = new PhaserFactory();
        }

        return PhaserFactory._factory;
    }

    override _generateTextureAtlasData(textureAtlasData: any, textureAtlas: any): any {
        if (textureAtlasData) {
            textureAtlasData.texture = textureAtlas;
        } else {
            textureAtlasData = BaseObject.borrowObject(PhaserTextureAtlasData);
        }

        return textureAtlasData;
    }
    
    override _generateArmature(dataPackage: any): Armature {
        var armature = BaseObject.borrowObject(Armature);
        var armatureDisplayContainer: PhaserArmatureDisplay = new PhaserArmatureDisplay();
        armature._armatureData = dataPackage.armature;
        armature._skinData = dataPackage.skin;
        armature._animation = BaseObject.borrowObject(Animation);
        armature._display = armatureDisplayContainer;
        armature._eventManager = PhaserFactory._eventManager;
        armatureDisplayContainer._armature = armature;
        armature._animation._armature = armature;
        armature.animation.animations = dataPackage.armature.animations;

        return armature;
    }
    
    override _generateSlot(dataPackage: any, slotDisplayDataSet: any): any {
        var slot = BaseObject.borrowObject(PhaserSlot);
        var slotData = slotDisplayDataSet.slot;
        var displayList: any[] = [];
        slot.name = slotData.name;
        slot._rawDisplay = new Phaser.Sprite(PhaserDragonBones.GAME, 0, 0);
        slot._meshDisplay = null;

        for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
            var displayData = slotDisplayDataSet.displays[i];
            
            switch (displayData.type) {
                case 0 /* Image */:
                    if (!displayData.texture) {
                        displayData.texture = this._getTextureData(
                            dataPackage.dataName,
                            displayData.name
                        );
                    }
                    displayList.push(slot._rawDisplay);
                    break;
                case 2 /* Mesh */:
                    if (!displayData.texture) {
                        displayData.texture = this._getTextureData(
                            dataPackage.dataName,
                            displayData.name
                        );
                    }
                    displayList.push(slot._meshDisplay);
                    break;
                case 1 /* Armature */:
                    var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);

                    if (childArmature) {
                        if (!slot.inheritAnimation) {
                            var actions = slotData.actions.length > 0
                                ? slotData.actions
                                : childArmature.armatureData.actions;
                            
                            if (actions.length > 0) {
                                for (var i_1 = 0, l_1 = actions.length; i_1 < l_1; ++i_1) {
                                    childArmature._bufferAction(actions[i_1]);
                                }
                            } else {
                                childArmature.animation.play();
                            }
                        }
                        displayData.armature = childArmature.armatureData; // 
                    }
                    displayList.push(childArmature);
                    break;
                default:
                    displayList.push(null);
                    break;
            }
        }

        slot._setDisplayList(displayList);

        return slot;
    }

    buildArmatureDisplay(armatureName: string, dragonBonesName: any = null, skinName: any = null) {
        var armature = this.buildArmature(armatureName, dragonBonesName, skinName);
        var armatureDisplay = armature ? armature._display : null;

        if (armatureDisplay) {
            armatureDisplay.advanceTimeBySelf(true);
        }

        return armatureDisplay;
    }

    getTextureDisplay(textureName: string, dragonBonesName: any = null) {
        var textureData = this._getTextureData(dragonBonesName, textureName);

        if (textureData) {
            if (!textureData.texture) {
                var textureAtlasTexture = textureData.parent.texture;
                var originSize = new Phaser.Rectangle(
                    0,
                    0,
                    textureData.region.width,
                    textureData.region.height
                );
                textureData.texture = new PIXI.Texture(
                    textureAtlasTexture,
                    textureData.region,
                    originSize
                );
            }

            return new Phaser.Sprite(PhaserDragonBones.GAME, 0, 0, textureData.texture);
        }
        
        return null;
    }

    get soundEventManater() {
    	return PhaserFactory._eventManager;
    }

}
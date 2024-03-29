import { Script4 } from '../../script4/Script4';
import { ImageSuper } from '../../script4/display/ImageSuper';
import { Slot } from './Slot';

export class PhaserSlot extends Slot {

    _renderDisplay: any;

	constructor() {
		super();
	}

	static override toString(): string {
        return "[class PhaserSlot]";
    }

    set_game() {}

    override _onClear() {
        super._onClear();
        this._renderDisplay = null;
    }

    override _initDisplay(value: any) {}

    override _disposeDisplay(value: any) {
        value.destroy();
    }

    override _onUpdateDisplay() {
        if (!this._rawDisplay) {
            this._rawDisplay = new Phaser.Sprite(Script4.core, 0, 0);
        }
        
        this._renderDisplay = (this._display || this._rawDisplay);
    }

    override _addDisplay() {
        var container = this._armature._display;
        container.addChild(this._renderDisplay);
    }

    override _replaceDisplay(value: any) {
        var container = this._armature._display;
        var prevDisplay = value;
        container.addChild(this._renderDisplay);
        container.swapChildren(this._renderDisplay, prevDisplay);
        container.removeChild(prevDisplay);
    }

    override _removeDisplay() {
        this._renderDisplay.parent.removeChild(this._renderDisplay);
    }

    _updateVisible() {
        this._renderDisplay.visible = this._parent.visible;
    }

    override _updateBlendMode() {}

    override _updateColor() {
        this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
    }

    _updateFilters() { };

    override _updateFrame() {
        var frameDisplay = this._renderDisplay;
        
        if (this._display) {
            var rawDisplayData = this._displayIndex < this._displayDataSet.displays.length
                ? this._displayDataSet.displays[this._displayIndex]
                : null;
            var replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length
                ? this._replacedDisplayDataSet[this._displayIndex]
                : null;
            var currentDisplayData = replacedDisplayData || rawDisplayData;
            var currentTextureData = currentDisplayData.texture;
            
            if (currentTextureData) {
                var textureAtlasTexture = currentTextureData.parent.texture;
                let baseTexture = textureAtlasTexture;

                if (!(textureAtlasTexture instanceof PIXI.BaseTexture)) {
                    baseTexture = new PIXI.BaseTexture(textureAtlasTexture, 1);
                }

                if (!currentTextureData.texture && textureAtlasTexture) {
                    var originSize = new PIXI.Rectangle(
                        0,
                        0,
                        currentTextureData.region.width,
                        currentTextureData.region.height
                    );
                    
                    currentTextureData.texture = new PIXI.Texture(
                        baseTexture,
                        currentTextureData.region, // No need to set frame.
                        currentTextureData.region,
                        originSize,
                    );
                }

                var texture = (this._armature._replacedTexture || currentTextureData.texture);
                this._updatePivot(rawDisplayData, currentDisplayData, currentTextureData);
                
                if (texture && texture.frame) {
                    if (frameDisplay.texture) {
                        frameDisplay.setTexture(texture);
                        frameDisplay.width = texture.frame.width;
                        frameDisplay.height = texture.frame.height;
                        frameDisplay.texture.baseTexture.skipRender = false;
                    }
                }
                
                texture.baseTexture.resolution = 1;
                texture.baseTexture.source = textureAtlasTexture;

                if (frameDisplay.texture) {
                    this._updateVisible();
                }
                
                return;
            }
        }

        this._pivotX = 0;
        this._pivotY = 0;
        frameDisplay.visible = false;
        frameDisplay.texture = null;
        frameDisplay.x = this.origin.x;
        frameDisplay.y = this.origin.y;
    }

    override _updateMesh() {
        var meshDisplay: any = null; //<PIXI.mesh.Mesh>this._meshDisplay;
        var hasFFD = this._ffdVertices.length > 0;

        if (this._meshData.skinned) {
            for (var i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                var iH = i / 2;
                var boneIndices = this._meshData.boneIndices[iH];
                var boneVertices = this._meshData.boneVertices[iH];
                var weights = this._meshData.weights[iH];
                var xG = 0, yG = 0;

                for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                    var bone = this._meshBones[boneIndices[iB]];
                    var matrix = bone.globalTransformMatrix;
                    var weight = weights[iB];
                    var xL = 0, yL = 0;

                    if (hasFFD) {
                        xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                        yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                    } else {
                        xL = boneVertices[iB * 2];
                        yL = boneVertices[iB * 2 + 1];
                    }

                    xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                    yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                    iF += 2;
                }

                meshDisplay.vertices[i] = xG;
                meshDisplay.vertices[i + 1] = yG;
            }
        } else if (hasFFD) {
            var vertices = this._meshData.vertices;
            
            for (var i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                var xG: number = vertices[i] + this._ffdVertices[i];
                var yG: number = vertices[i + 1] + this._ffdVertices[i + 1];
                meshDisplay.vertices[i] = xG;
                meshDisplay.vertices[i + 1] = yG;
            }
        }
    }

    override _updateTransform() {
        this._renderDisplay.x = this.global.x;
        this._renderDisplay.y = this.global.y;
        this._renderDisplay.rotation = this.global.skewX;
        this._renderDisplay.scale.x = this.global.scaleX;
        this._renderDisplay.scale.y = this.global.scaleY;
        this._renderDisplay.pivot.x = this._pivotX;
        this._renderDisplay.pivot.y = this._pivotY;
    }

}
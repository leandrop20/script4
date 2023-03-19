/*!
 * phaser-nineslice - version 2.0.1 
 * NineSlice plugin for Phaser.io!
 *
 * Azerion
 * Build at 19-03-2019
 * Released under MIT License 
 */

var __extends = (this && this.__extends) || (function() {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] }
            instanceof Array && function(d, b) { d.__proto__ = b; }) ||
        function(d, b) { for (var p in b)
                if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function(d, b) {
        extendStatics(d, b);

        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

class NineSlicePlugin extends Phaser.Plugin {

    constructor(game, parent) {
        super(game, parent);
        this.addNineSliceCache();
        this.addNineSliceFactory();
        this.addNineSliceLoader();
    }

    addNineSliceCache() {
        Phaser.Cache.prototype.nineSlice = {};
        Phaser.Cache.prototype.addNineSlice = function(key, data) {
            this.nineSlice[key] = data;
        };
        Phaser.Cache.prototype.getNineSlice = function(key) {
            var data = this.nineSlice[key];
            if (undefined === data) {
                console.warn('Phaser.Cache.getNineSlice: Key "' + key + '" not found in Cache.');
            }
            return data;
        };
    }

    addNineSliceFactory() {
        Phaser.GameObjectFactory.prototype.nineSlice = function(x, y, key, frame, width, height, group) {
            if (group === undefined) {
                group = this.world;
            }
            var nineSliceObject = new PhaserNineSlice.NineSlice(this.game, x, y, key, frame, width, height);
            return group.add(nineSliceObject);
        };
        Phaser.GameObjectCreator.prototype.nineSlice = function(x, y, key, frame, width, height) {
            return new PhaserNineSlice.NineSlice(this.game, x, y, key, frame, width, height);
        };
    }

    addNineSliceLoader() {
        Phaser.Loader.prototype.nineSlice = function(key, url, top, left, right, bottom) {
            var cacheData = {
                top: top
            };
            if (left) {
                cacheData.left = left;
            }
            if (right) {
                cacheData.right = right;
            }
            if (bottom) {
                cacheData.bottom = bottom;
            }
            this.addToFileList('image', key, url);
            this.game.cache.addNineSlice(key, cacheData);
        };
    }

}

class NineSlice extends Phaser.Sprite {

    constructor(game, x, y, key, frame, width, height, data) {
        super(game, x, y, key, frame);

        this.baseTexture = this.texture.baseTexture;
        this.baseFrame = this.texture.frame;
        if (frame !== null && !data) {
            data = game.cache.getNineSlice(frame);
        } else if (!data) {
            data = game.cache.getNineSlice(key);
        }
        if (undefined === data) {
            return this;
        }
        this.topSize = data.top;
        if (!data.left) {
            this.leftSize = this.topSize;
        } else {
            this.leftSize = data.left;
        }
        if (!data.right) {
            this.rightSize = this.leftSize;
        } else {
            this.rightSize = data.right;
        }
        if (!data.bottom) {
            this.bottomSize = this.topSize;
        } else {
            this.bottomSize = data.bottom;
        }
        this.loadTexture(new Phaser.RenderTexture(this.game, this.localWidth, this.localHeight));
        this.resize(width, height);
    }

    renderTexture() {
        this.texture.resize(this.localWidth, this.localHeight, true);
        var textureXs = [0, this.leftSize, this.baseFrame.width - this.rightSize, this.baseFrame.width];
        var textureYs = [0, this.topSize, this.baseFrame.height - this.bottomSize, this.baseFrame.height];
        var finalXs = [0, this.leftSize, this.localWidth - this.rightSize, this.localWidth];
        var finalYs = [0, this.topSize, this.localHeight - this.bottomSize, this.localHeight];
        this.texture.clear();
        for (var yi = 0; yi < 3; yi++) {
            for (var xi = 0; xi < 3; xi++) {
                var s = this.createTexturePart(textureXs[xi], textureYs[yi], textureXs[xi + 1] - textureXs[xi], textureYs[yi + 1] - textureYs[yi]);
                s.width = finalXs[xi + 1] - finalXs[xi];
                s.height = finalYs[yi + 1] - finalYs[yi];
                this.texture.renderXY(s, finalXs[xi], finalYs[yi]);
            }
        }
    }

    resize(width, height) {
        this.localWidth = width;
        this.localHeight = height;
        this.renderTexture();
    }

    destroy() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        super.destroy();
        // _super.prototype.destroy.call(this, args[0]);
        this.texture.destroy(true);
        this.texture = null;
        this.baseTexture = null;
        this.baseFrame = null;
    }

    createTexturePart(x, y, width, height) {
        var frame = new PIXI.Rectangle(this.baseFrame.x + this.texture.frame.x + x, this.baseFrame.y + this.texture.frame.y + y, Math.max(width, 1), Math.max(height, 1));
        return new Phaser.Sprite(this.game, 0, 0, new PIXI.Texture(this.baseTexture, frame));
    }

}

export default class PhaserNineSlice {

    static get NineSlicePlugin() { return NineSlicePlugin; }
    static get NineSlice() { return NineSlice; }

}
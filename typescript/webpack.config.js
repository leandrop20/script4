const path = require('path');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

const gsapPath = path.join(__dirname, '/src/com/greensock/');
const tweenmax = path.join(gsapPath, 'TweenMax.min.js');
const tweenlite = path.join(gsapPath, 'TweenLite.min.js');
const throwpropsplugin = path.join(gsapPath, 'plugins/ThrowPropsPlugin.min.js');

module.exports = {
    entry: './src/Main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'script4.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/')
        },
        compress: true,
        port: 8080
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
            {
                test: /(pixi)\.js/,
                use: { loader: 'expose-loader', options: { exposes: 'PIXI' } }
            },
            {
                test: /(p2)\.js/,
                use: { loader: 'expose-loader', options: { exposes: 'p2' } }
            },
            {
                test: /(phaser)\.js/,
                use: { loader: 'expose-loader', options: { exposes: 'Phaser' } }
            },
            { test: /(tweenmax).js$/, use: 'expose-loader' },
			{ test: /(tweenlite).js$/, use: 'expose-loader' },
			{ test: /(throwpropsplugin).js$/, use: 'expose-loader' }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'pixi': pixi,
            'p2': p2,
            'phaser': phaser,
            'TweenMax': tweenmax,
            'TweenLite': tweenlite,
            'ThrowPropsPlugin': throwpropsplugin
        }
    }
};
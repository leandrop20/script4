const path = require('path');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
	entry: './src/Main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'script4.js'
	},
	module: {
		rules: [
			{ test: /(pixi).js$/, use: 'script-loader' },
			{ test: /(phaser-split).js$/, use: 'script-loader' },
			{ test: /(p2).js$/, use: 'script-loader' },
		]
	},
	resolve: {
		alias: { 'phaser': phaser, 'pixi': pixi, 'p2': p2 }
	}
}
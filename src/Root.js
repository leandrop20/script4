import Script4 from './com/script4/Script4';
import Transitions from './com/script4/animation/Transitions';
import Tween from './com/script4/animation/Tween';
import DelayedCall from './com/script4/animation/DelayedCall';
import Sprite from './com/script4/display/Sprite';
import ImageSuper from './com/script4/display/ImageSuper';
import Spine from './com/script4/display/Spine';
import ButtonSuper from './com/script4/display/ButtonSuper';
import SimpleButton from './com/script4/display/SimpleButton';
import TextField from './com/script4/text/TextField';
import TileSprite from './com/script4/display/TileSprite';
import PDParticleSystem from './com/script4/display/PDParticleSystem';

import Event from './com/script4/events/Event';
import TouchEvent from './com/script4/events/TouchEvent';
import TouchPhase from './com/script4/events/TouchPhase';
import Sound from './com/script4/media/Sound';
import SoundMixer from './com/script4/media/SoundMixer';

import Align from "./com/script4/utils/Align";

export default class Root extends Sprite {

	constructor() {
		super();

		// this.addChild(new TouchEvents());

		var t = new ImageSuper('imgExample');
		t.position.set(130, 110);
		t.scale.set(0.37);
		this.addChild(t);

		var t2 = new ImageSuper('imgLoad');
		t2.position.set(Script4.width - 90, 40);
		this.addChild(t2);

		var spine = new Spine('pipoqueiro', Script4.width * 0.5, Script4.height);
		spine.play('walk', true);
		this.addChild(spine);

		// var spine2 = new Spine('pipoqueiro', Script4.width * 0.5, 200);
		// spine2.play('walk', true);
		// spine2.play('hitLaser', false);
		// spine2.play('killLaser', false);
		// spine2.play('hitPoison', true);
		// spine2.play('killPoison', false);
		// spine2.play('killDefense', false);
		// spine2.play('freeze', false);
		// spine2.play('unfreeze', false);
		// this.addChild(spine2);

		// var spine3 = new Spine('pipoqueiro', Script4.width * 0.5, 300);
		// spine3.play('walk', true);
		// this.addChild(spine3);

		var bt2 = new SimpleButton('atlas.danger', 500, 50);
		this.addChild(bt2);

		var bt = new ButtonSuper('btExample', 100, 350);
		this.addChild(bt);
		bt.addEventListener(Event.TRIGGERED, onTest);
		var channel;
		function onTest() {
			console.log('TRIGGERED');
			channel = Sound.play('coin', 1.0, false);
			channel.addEventListener(Event.SOUND_COMPLETE, onSoundComplete);
			// SoundMixer.stopAll();
		}

		function onSoundComplete(e) {
			console.log('soundComplete');
		}

		var atlasImg = new ImageSuper('atlas.coin', 600, 400);
		this.addChild(atlasImg);

		var atlasImg = new ImageSuper('atlas.danger', 660, 400);
		this.addChild(atlasImg);

		var atlasImg = new ImageSuper('atlas.super', 660, 300);
		this.addChild(atlasImg);

		var atlasImg = new ImageSuper('atlas.world', 660, 350);
		this.addChild(atlasImg);

		var tf = new TextField(280, 60, 'bitmapFont', 'Hello á World!');
		// tf.hAlign = Align.CENTER;
		// tf.vAlign = Align.BOTTOM;
		tf.align(Align.CENTER, Align.MIDDLE);
		tf.position.set(480, 180);
		// tf.appendText(' mais isso');
		// tf.text = 'ÁÂÃáâãÉéÓÔÕô';
		tf.border = true;
		this.addChild(tf);

		var container = new Sprite();
		container.name = 'container';
		this.addChild(container);

		var b1 = new ImageSuper('imgExample');
		b1.name = 'b1';
		b1.position.set(200, 280);
		b1.scale.set(0.2);
		container.addChild(b1);

		var b2 = new ImageSuper('imgExample');
		b2.name = 'b2';
		b2.position.set(400, 280);
		b2.scale.set(0.2);
		container.addChild(b2);

		var b3 = new TextField(280, 60, 'bitmapFont', 'Hello Touch');
		b3.align(Align.CENTER, Align.MIDDLE);
		b3.border = true;
		b3.position.set(500, 110);
		container.addChild(b3);

		var b4 = new Spine('pipoqueiro');
		b4.position.set(600, 320);
		b4.play('hitPoison', true);
		container.addChild(b4);

		container.addEventListener(TouchEvent.TOUCH, onTouch);
		var objDrag;
		function onTouch(e) {
			var touch = e.getTouch(b4);
			if (touch) {
				if (touch.phase == TouchPhase.BEGAN) {
					objDrag = touch.target;
				} else if (touch.phase == TouchPhase.MOVED) {
					if (objDrag) {
						objDrag.position.set(touch.globalX, touch.globalY);
						/*for (var i=0;i<container.numChildren;i++) {
							if (objDrag.getBounds().intersects(container.getChildAt(i).getBounds())) {
								container.removeChild(container.getChildAt(i));
							}
						}*/
					}
				} else if (touch.phase == TouchPhase.ENDED) {
					objDrag = null;
				}
			}
		}

		this.addEventListener(Event.ENTER_FRAME, loop);
		function loop(e) {
			spine.position.x -= 2;
			if (spine.position.x <= 0) {
				spine.position.x = 770;
			}
			if (spine.position.x == 600) {
				this.removeEventListener(Event.ENTER_FRAME, loop);
			}
		}

		var tile = new TileSprite('atlas.world', 250, 20, 200, 150);
		this.addChild(tile);

		var particle = new PDParticleSystem('particle');
		particle.x = Script4.width*0.5;
		particle.y = Script4.height*0.5;
		this.addChild(particle);
		particle.start(0.0);

		// var particle2 = new PDParticleSystem('particle2');
		// particle2.x = 200;
		// particle2.y = Script4.height - 100;
		// this.addChild(particle2);
		// particle2.start(0.0);

		// Script4.juggler.tween(bt, 0.3, {
		// 	alpha: 0.2,
		// 	scaleX:0.5,
		// 	scaleY:0.5,
		// 	transition:Transitions.LINEAR,
		// 	delay:0.2,
		// 	onComplete:onComplete,
		// 	onCompleteArgs:['argTween', 'arg2'],
		// 	repeatCount:1,
		// 	reverse: true
		// });

		// function onComplete(a, b) {
		// 	console.log(a);
		// 	console.log(b);
		// }

		// var tween = new Tween(t, 0.3, { scaleX:0.3, scaleY:0.3, reverse:true, repeatCount:-1, delay:1.0, 
		// 	transition:Transitions.EASE_IN });
		// Script4.juggler.add(tween);

		// Script4.juggler.delayedCall(onDelayedCall, 3.0, ['arg1', 'arg2']);
		// function onDelayedCall(a, b) {
		// 	console.log('delayedCallCompleted: ' + a + ', ' + b);
		// 	Script4.juggler.remove(delayedCall);
		// }

		// var delayedCall = new DelayedCall(onDelayedCall, 1.0, ['test2', 'test3']);
		// delayedCall.repeatCount = 3;
		// Script4.juggler.add(delayedCall);
	}

}
import { Script4 } from '../Script4';
import { Event } from '../enums/Event';

export class Sound extends Phaser.Sound {

	constructor(soundName: string) {
		super(Script4.core, soundName);

		Script4.core.sound._sounds.push(this);
	}

	static play(soundName: string, vol: number = 1.0, loop: boolean = false) {
		var channel = new Sound(soundName);
		channel.volume = vol;
		channel.loop = loop;
		channel.play();

		return channel;
	}

	addEventListener(type: Event, listener: Function) {
		if (!type) throw('event type not found!');

		if (type === Event.SOUND_COMPLETE) {
			this.onStop.add(listener, this);
		}
	}

	removeEventListener(type: Event, listener: Function) {
		if (!type) throw('event type not found!');

		if (type === Event.SOUND_COMPLETE) {
			this.onStop.remove(listener, this);
		}
	}
	
}
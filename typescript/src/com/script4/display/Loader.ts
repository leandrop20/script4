import { Script4 } from '../Script4';

export class Loader extends Phaser.Loader {

    target: any;
    content: any;
    onProgress!: Function;
    onComplete!: Function;
    onIOError!: Function;

	constructor(target: any) {
		super(Script4.core);

		this.target = target;
	}

	load(url: string, name: string = 'default') {
		if (name == 'default') {
			let parts: any[] = url.split('/');
			name = parts[parts.length - 1];
			name = name.substring(0, name.indexOf('.'));
		}

		if (url.indexOf('.png') != -1 || url.indexOf('.jpg') != -1) {
			this.image(name, url);
		}

		this.start();
	}

	_onProgress(progress: any, cacheKey: any, success: any, totalLoaded: any, totalFiles: any) {
		this.onProgress({
			progress: progress,
			cacheKey: cacheKey,
			success: success,
			totalLoaded: totalLoaded,
			totalFiles: totalFiles,
			target: this.target
		});
		this.content = cacheKey;
	}

	_onComplete(e: any) {
		this.onComplete({
			content: this.content,
			target: this.target
		});
	}

	_onIOError(e: any) {
		this.onIOError({
			name: e,
			target: this.target
		});
	}

	addEventListener(type: string, listener: Function) {
		if (!type) throw('event type not found!');

		if (type == 'progress') {
			this.onProgress = listener;
			this.onFileComplete.add(this._onProgress, this);
		} else if (type == 'complete') {
			this.onComplete = listener;
			this.onLoadComplete.add(this._onComplete, this);
		} else if (type == 'ioError') {
			this.onIOError = listener;
			this.onFileError.add(this._onIOError, this);
		}
	}

	removeEventListener(type: string, listener: Function) {
		if (!type) throw('event type not found!');

		if (type == 'progress') {
			this.onFileComplete.remove(this._onProgress, this);
		} else if (type == 'complete') {
			this.onLoadComplete.remove(this._onComplete, this);
		} else if (type == 'ioError') {
			this.onFileError.remove(this._onIOError, this);
		}
	}

}

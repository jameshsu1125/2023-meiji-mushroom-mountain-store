import { Howl } from 'howler';
import bamboo from './mp3/bamboo.mp3';
import bgm from './mp3/bgm.mp3';
import falling from './mp3/falling.mp3';
import move from './mp3/move.mp3';
import mushroom from './mp3/mushroom.mp3';

export default class Sounds {
	constructor(SoundsTrackName) {
		this.onLoaded = () => {};
		this.tracks = {};
		this.sounds = [
			{ url: bgm, name: SoundsTrackName.bgm, loop: true, volume: 0 },
			{ url: bamboo, name: SoundsTrackName.bamboo, loop: false, volume: 1 },
			{ url: mushroom, name: SoundsTrackName.mushroom, loop: false, volume: 1 },
			{ url: falling, name: SoundsTrackName.falling, loop: false, volume: 1 },
			{ url: move, name: SoundsTrackName.move, loop: true, volume: 1 },
		];
		this.isMute = false;
	}

	eachSoundLoad(name) {
		this.tracks[name].loaded = true;
		const loadedTrack = Object.values(this.tracks).filter((data) => data.loaded);

		if (loadedTrack.length === this.sounds.length) {
			this.onLoaded();
		}
	}

	loadSound(onLoaded) {
		this.onLoaded = onLoaded;
		this.tracks = Object.fromEntries(
			this.sounds.map((data) => {
				const sound = new Howl({
					src: [data.url],
					autoplay: false,
					loop: data.loop,
					volume: data.volume,
					onload: () => this.eachSoundLoad(data.name),
				});

				return [data.name, { sound, loaded: false }];
			}),
		);
	}

	mute() {
		Object.values(this.tracks).forEach((item) => {
			const { sound } = item;
			sound.volume(0);
		});
	}

	unmute() {
		Object.entries(this.tracks).forEach((item) => {
			const [name, data] = item;
			const [track] = this.sounds.filter((each) => String(each.name) === name);
			const { volume } = track;
			data.sound.volume(volume);
		});
	}

	switch() {
		this.isMute = !this.isMute;
		if (this.isMute) this.mute();
		else this.unmute();
	}
}

import { CONTROL_MODE } from '../../../settings/constant';

export default class Controller {
	constructor({ character, bamboo, mushroom, cubes, onCollide }) {
		this.character = character;
		this.bamboo = bamboo;
		this.mushroom = mushroom;
		this.cubes = cubes;
		this.onCollide = onCollide;

		this.enabled = true;
		this.mode = CONTROL_MODE.unset;
		this.direct = {};
		this.addEvents();
	}

	reset() {
		this.enabled = true;
		this.mode = CONTROL_MODE.unset;
		this.direct = {};
	}

	stop() {
		this.enabled = false;
	}

	moveJoystick(property) {
		if (!this.enabled) return;

		this.mode = CONTROL_MODE.joystick;
		this.angle = property.angle;
		this.distance = property.distance;
	}

	stopJoystick() {
		if (!this.enabled) return;

		this.mode = CONTROL_MODE.unset;
		this.angle = 0;
		this.distance = 0;
	}

	addEvents() {
		window.addEventListener('keydown', (e) => {
			if (!this.enabled) return;
			this.mode = CONTROL_MODE.keyboard;

			const { key } = e;
			switch (key) {
				case 'ArrowLeft':
					this.direct[key] = 1;
					break;

				case 'ArrowUp':
					this.direct[key] = 1;
					break;

				case 'ArrowRight':
					this.direct[key] = 1;
					break;

				case 'ArrowDown':
					this.direct[key] = 1;
					break;

				default:
			}
		});

		window.addEventListener('keyup', (e) => {
			if (!this.enabled) return;

			const { key } = e;
			switch (key) {
				case 'ArrowLeft':
					this.direct[key] = 0;
					break;

				case 'ArrowUp':
					this.direct[key] = 0;
					break;

				case 'ArrowRight':
					this.direct[key] = 0;
					break;

				case 'ArrowDown':
					this.direct[key] = 0;
					break;

				default:
			}
		});
	}
}

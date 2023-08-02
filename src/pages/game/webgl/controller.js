export default class Controller {
	constructor({ character, bamboo, mushroom, cubes, onCollide }) {
		this.character = character;
		this.bamboo = bamboo;
		this.mushroom = mushroom;
		this.cubes = cubes;
		this.onCollide = onCollide;

		this.enabled = true;
		this.direct = {};
		this.speed = 1;
		this.addEvents();
	}

	stop() {
		this.enabled = false;
	}

	addEvents() {
		window.addEventListener('keydown', (e) => {
			if (!this.enabled) return;
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

export default class Controller {
	constructor({ character, bamboo, mushroom, cubes }) {
		this.character = character;
		this.bamboo = bamboo;
		this.mushroom = mushroom;
		this.cubes = cubes;

		this.direct = {};
		this.speed = 1;
		this.addEvents();
	}

	addEvents() {
		window.addEventListener('keydown', (e) => {
			this.character.walk();
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

/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import loadTexture from '../../../components/loadTexture';
import TopImage from './texture/cube-top.jpg';
import SizeImage from './texture/cube-side.jpg';
import { CubeGapSize, CubeSize, gameRule } from './config';
import { easingDelta } from './misc';

export default class Cubes {
	constructor({ webgl, collector, onGameCountDown, onGameOver, stopRender, onload }) {
		this.webgl = webgl;
		this.collector = collector;
		this.onGameCountDown = onGameCountDown;
		this.onGameOver = onGameOver;
		this.stopRender = stopRender;
		this.onload = onload;
		this.name = 'box';

		this.serial = gameRule.startCountDown + 1;
		this.countdownSerial = false;
		this.enabled = true;
		this.currentDropIndex = 999;

		this.boxes = [];
		this.bodies = [];

		this.numberOfBox = collector.data.length;
		this.size = CubeSize;
		this.gapSize = CubeGapSize;

		this.addTexture();
	}

	addPhysics({ col, row, i }) {
		const { world, physicsStaticMaterial } = this.webgl;
		const size = CubeSize * 0.5;
		const halfExtents = new CANNON.Vec3(size, size, size);
		const shape = new CANNON.Box(halfExtents);
		const body = new CANNON.Body({
			mass: 0,
			shape,
			type: CANNON.Body.STATIC,
			material: physicsStaticMaterial,
			collisionFilterGroup: gameRule.collideGroup.box,
			collisionFilterMask:
				gameRule.collideGroup.bamboo |
				gameRule.collideGroup.mushroom |
				gameRule.collideGroup.character,
		});

		const offsetX = 1 * (this.size + this.gapSize);
		const offsetZ = 1 * (this.size + this.gapSize);
		const x = (i % 3) * this.size + row * this.gapSize - offsetX;
		const z = Math.floor(i / 3) * this.size + col * this.gapSize - offsetZ;
		body.position.set(x, 0, z);
		body.name = this.name + i;
		world.addBody(body);
		this.bodies.push(body);
	}

	async addTexture() {
		this.topTexture = await loadTexture(TopImage);
		this.sideTexture = await loadTexture(SizeImage);

		this.topTexture.wrapS = THREE.RepeatWrapping;
		this.topTexture.wrapT = THREE.RepeatWrapping;
		this.topTexture.repeat.set(1, 1 / 10);
		this.topTexture.encoding = THREE.sRGBEncoding;

		this.addBox();
	}

	addBox(replay) {
		const { sideTexture, topTexture } = this;
		const { scene } = this.webgl;
		const group = new THREE.Group();
		const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
		const underSideMaterial = new THREE.MeshLambertMaterial({ color: 0x190e05 });
		const sideMaterial = new THREE.MeshStandardMaterial({ map: sideTexture });
		this.bodies = [];
		this.boxes = [...new Array(this.numberOfBox).keys()].map((i) => {
			const topMaterial = new THREE.MeshBasicMaterial({ map: topTexture.clone() });
			topMaterial.map.offset.set(0, (1 / 10) * (this.numberOfBox - this.collector.data[i].number));
			const mesh = new THREE.Mesh(geometry, [
				sideMaterial,
				sideMaterial,
				topMaterial,
				underSideMaterial,
				sideMaterial,
				sideMaterial,
			]);

			const col = Math.floor(i / 3);
			const row = i % 3;
			const x = (i % 3) * this.size + row * this.gapSize;
			const z = Math.floor(i / 3) * this.size + col * this.gapSize;

			mesh.receiveShadow = true;
			mesh.position.set(x, 0, z);
			group.add(mesh);
			group.name = 'boxes';

			this.addPhysics({ col, row, i });
			return mesh;
		});

		group.position.x = 0 - 1 * (this.size + this.gapSize);
		group.position.z = 0 - 1 * (this.size + this.gapSize);
		scene.add(group);
		if (!replay) {
			this.onload(this.name);
			this.addShadow();
		}
	}

	addShadow() {
		const { scene } = this.webgl;
		const geometry = new THREE.BoxBufferGeometry(6.22, 6.22, 0.01);
		const material = new THREE.ShadowMaterial({ opacity: 0.2 });
		const ground = new THREE.Mesh(geometry, material);
		ground.position.y = 1;
		ground.rotation.x = Math.PI / 2;
		ground.receiveShadow = true;
		scene.add(ground);
	}

	visible(v) {
		this.boxes.forEach((box) => {
			box.visible = v;
		});
	}

	stop() {
		this.enabled = false;
		this.bodies.forEach((body, index) => {
			if (index !== this.currentDropIndex) body.position.y = -100;
		});
	}

	out() {
		this.onGameOver('cube');
		this.stopRender(this.currentDropIndex);
	}

	reset() {
		this.serial = gameRule.startCountDown + 1;
		this.countdownSerial = false;
		this.enabled = true;
		this.currentDropIndex = 999;

		const { scene } = this.webgl;

		const selectedObject = scene.getObjectByName('boxes');
		scene.remove(selectedObject);
		this.addBox(true);
	}

	updateMaterial() {
		this.boxes.forEach((box, i) => {
			const { map } = box.material[2];
			const data = this.collector.data[i];
			const { number } = data;
			const n = Math.round(this.numberOfBox - number);
			map.offset.setY(n / 10);

			if (n === this.numberOfBox) {
				const { stay } = this.collector;
				if (stay === i) {
					this.collector.data[i].drop = true;
					const body = this.bodies[i];

					body.type = CANNON.Body.DYNAMIC;
					body.velocity.set(0, -10, 0);
					this.currentDropIndex = i;
					this.out();
				} else {
					this.collector.data[i].number = 10;
					map.offset.setY(1);
				}
			}
		});
	}

	setMaterialByIndex() {
		this.collector.data.forEach((item) => {
			const { number } = item;
			const currentNumber = number - 1;
			if (currentNumber < 0) item.number = 0;
			else item.number = currentNumber;
		});
		this.updateMaterial();
	}

	update(delta) {
		if (this.bodies.length === this.numberOfBox) {
			const currentDelta = easingDelta(delta, 'linear');
			if (currentDelta > this.serial) {
				this.serial = currentDelta;
				if (this.enabled) this.setMaterialByIndex();
			}
			if (currentDelta !== this.countdownSerial) {
				if (this.countdownSerial < gameRule.startCountDown + 1) {
					this.countdownSerial = currentDelta;
					this.onGameCountDown(gameRule.startCountDown - currentDelta);
				}
			}

			[...new Array(this.numberOfBox).keys()].forEach((index) => {
				const body = this.bodies[index];
				const box = this.boxes[index];
				const { position } = body;
				const correction = {
					x: -this.size - this.gapSize,
					z: -this.size - this.gapSize,
					y: 0,
				};
				if (this.enabled) {
					box.position.copy({
						x: position.x - correction.x,
						y: position.y - correction.y,
						z: position.z - correction.z,
					});
					box.quaternion.copy(body.quaternion);
				} else if (index === this.currentDropIndex) {
					box.position.copy({
						x: position.x - correction.x,
						y: position.y - correction.y,
						z: position.z - correction.z,
					});
				}
			});
		}
	}
}

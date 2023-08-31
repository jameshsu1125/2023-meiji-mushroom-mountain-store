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

		this.boxes = [];
		this.bodies = [];

		this.numberOfBox = collector.data.length;
		this.size = CubeSize;
		this.gapSize = CubeGapSize;

		this.addBoxes();
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

	async addBoxes() {
		const topTexture = await loadTexture(TopImage);
		const sideTexture = await loadTexture(SizeImage);
		topTexture.wrapS = THREE.RepeatWrapping;
		topTexture.wrapT = THREE.RepeatWrapping;
		topTexture.repeat.set(1, 1 / 10);
		topTexture.encoding = THREE.sRGBEncoding;

		const { scene } = this.webgl;
		const group = new THREE.Group();
		const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
		const underSideMaterial = new THREE.MeshLambertMaterial({ color: 0x190e05 });
		const sideMaterial = new THREE.MeshStandardMaterial({ map: sideTexture });

		this.boxes = [...new Array(this.numberOfBox).keys()].map((i) => {
			const topMaterial = new THREE.MeshBasicMaterial({
				map: topTexture.clone(),
				// color: 0x7cbd28,
			});
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

			this.addPhysics({ col, row, i });
			return mesh;
		});

		group.position.x = 0 - 1 * (this.size + this.gapSize);
		group.position.z = 0 - 1 * (this.size + this.gapSize);
		scene.add(group);
		this.onload(this.name);
		this.addShadow();
	}

	addShadow() {
		const { scene } = this.webgl;
		const geometry = new THREE.BoxBufferGeometry(6.22, 6.22, 0.01);
		// const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
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
	}

	out() {
		this.onGameOver();
		this.stopRender();
	}

	updateMaterial() {
		this.boxes.forEach((box, i) => {
			const { map } = box.material[2];
			const data = this.collector.data[i];
			const { number } = data;
			const n = Math.round(this.numberOfBox - number);
			map.offset.setY(n / 10);

			if (n === this.numberOfBox) {
				// const { stay } = this.collector;
				// if (stay === i) {
				// 	this.collector.data[i].drop = true;
				// 	const body = this.bodies[i];
				// 	body.mass = 10000;
				// 	body.updateMassProperties();
				// 	body.type = CANNON.Body.DYNAMIC;
				// 	body.velocity.set(0, -10, 0);
				// 	this.out();
				// } else {
				this.collector.data[i].number = 10;
				map.offset.setY(1);
				// }
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
				box.position.copy({
					x: position.x - correction.x,
					y: position.y - correction.y,
					z: position.z - correction.z,
				});
			});
		}
	}
}

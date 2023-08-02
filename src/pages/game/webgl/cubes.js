/* eslint-disable no-param-reassign */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import loadTexture from '../../../components/loadTexture';
import TopImage from './texture/cube-top.jpg';
import SizeImage from './texture/cube-side.jpg';
import { CubeGapSize, CubeSize } from './config';
import { easingDelta } from './misc';

export default class Cubes {
	constructor({ webgl, collector, onload }) {
		this.webgl = webgl;
		this.collector = collector;
		this.onload = onload;
		this.name = 'box';

		this.serial = 0;
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
		});

		const offsetX = 1 * (this.size + this.gapSize);
		const offsetZ = 1 * (this.size + this.gapSize);
		const x = (i % 3) * this.size + row * this.gapSize - offsetX;
		const z = Math.floor(i / 3) * this.size + col * this.gapSize - offsetZ;
		body.position.set(x, 0, z);
		body.name = 'box';
		world.addBody(body);
		this.bodies.push(body);
	}

	async addBoxes() {
		const topTexture = await loadTexture(TopImage);
		const sideTexture = await loadTexture(SizeImage);
		topTexture.wrapS = THREE.RepeatWrapping;
		topTexture.wrapT = THREE.RepeatWrapping;
		topTexture.repeat.set(1, 1 / 10);

		const { scene } = this.webgl;
		const group = new THREE.Group();

		this.boxes = [...new Array(this.numberOfBox).keys()].map((i) => {
			const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
			const underSideMaterial = new THREE.MeshLambertMaterial({ color: 0x190e05 });
			const topMaterial = new THREE.MeshStandardMaterial({ map: topTexture.clone() });
			const sideMaterial = new THREE.MeshStandardMaterial({ map: sideTexture });
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
	}

	visible(v) {
		this.boxes.forEach((box) => {
			box.visible = v;
		});
	}

	updateMaterial() {
		this.boxes.forEach((box, i) => {
			const { map } = box.material[2];
			const data = this.collector.data[i];
			const { number } = data;
			const n = Math.round(this.numberOfBox - number);
			map.offset.setY(n / 10);

			if (n === this.numberOfBox) {
				const body = this.bodies[i];
				body.mass = 100000;
				body.updateMassProperties();
				body.type = CANNON.Body.DYNAMIC;
				body.velocity.y = -10;
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
			if (currentDelta !== this.serial) {
				this.serial = currentDelta;
				this.setMaterialByIndex();
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

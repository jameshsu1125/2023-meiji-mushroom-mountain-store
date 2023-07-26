/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import * as THREE from 'three';
import loadTexture from '../../../components/loadTexture';
import TopImage from './texture/cube-top.jpg';
import SizeImage from './texture/cube-side.jpg';
import { CubeSize } from './config';

export default class Cubes {
	constructor({ webgl }) {
		this.webgl = webgl;
		this.numberOfBox = 9;
		this.size = CubeSize;
		this.gapSize = 0.1;
		this.data = [...new Array(this.numberOfBox).keys()].map(() =>
			Math.floor(Math.random() * this.numberOfBox),
		);

		this.addBox();
	}

	async addBox() {
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
			topMaterial.map.offset.set(0, (1 / 10) * this.data[i]);

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
			return mesh;
		});

		group.position.x = 0 - 1 * (this.size + this.gapSize);
		group.position.z = 0 - 1 * (this.size + this.gapSize);
		scene.add(group);
	}
}

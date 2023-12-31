/* eslint-disable no-param-reassign */
import { cubeData, currentArray, gameRule } from './config';

export default class DataCollector {
	constructor() {
		this.data = [...gameRule.cubes];
		this.stay = 4;
		this.bambooName = 'bamboo';
		this.mushroomName = 'mushroom';
		this.mushroomData = [];
	}

	reset() {
		this.data = [...new Array(9).keys()].map((index) => {
			const cloneData = { ...cubeData };
			if (index === 4) cloneData.number = 5 + Math.floor(Math.random() * 5);
			else {
				cloneData.number =
					currentArray[index] <= 0 ? 5 + Math.floor(Math.random() * 5) : currentArray[index];
			}
			cloneData.index = index;
			return cloneData;
		});
		this.stay = 4;
		this.mushroomData = [];
	}

	setBambooIndex(index) {
		this.data.forEach((item) => {
			if (item.hasItem === this.bambooName) item.hasItem = '';
		});
		this.data.forEach((item) => {
			if (item.index === index) item.hasItem = this.bambooName;
		});
	}

	setMushroomIndex(index) {
		this.data.forEach((item) => {
			if (this.mushroomData.length > 2) {
				const [firstItem] = this.mushroomData;
				if (item.index === firstItem.index) {
					item.hasItem = '';
					this.mushroomData.shift();
				}
			}
		});
		this.data.forEach((item) => {
			if (item.index === index) {
				item.hasItem = this.mushroomName;
				this.mushroomData.push(item);
			}
		});
	}
}

/* eslint-disable no-param-reassign */
import { gameRule } from './config';

export default class DataCollector {
	constructor() {
		this.data = [...gameRule.cubes];
		this.stay = 4;
		this.bambooName = 'bamboo';
		this.mushroomName = 'mushroom';
		this.mushroomData = [];
	}

	reset() {
		this.data = [...gameRule.cubes];
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

export class Collection {
	list: string[];

	constructor(list: string[]) {
		this.list = list;
	}

	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}
}

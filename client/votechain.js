import { vote } from "./vote.js";

export class Votechain {
	constructor(vote) {
		this.head = vote;
		this.prev = null;
		this.next = null;
	}
}
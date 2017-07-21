exports.linkedList = class {
	constructor(data) {
		this.head = null;
		this.tail = null;
		this._length = 0;
		this._election = "";
	}
	set setElection(election) {
		this._election = election;
	}
	get getElection() {
		return this._election;
	}
	get getLength() {
		return this._length;
	}
	insert(data) {
		let node = new Node(data);
		if(this._length) {
			this.tail.next = node;
			node.prev = this.tail;
			this.tail = node;
		} else {
			this.tail = node;
			this.head = node;
		}
		this._length++;
		return node.getData;
	}
	iterate() {
		var currentNode = this.head;
		while(currentNode !== null) {
			console.log(currentNode.getData + '\n');
			currentNode = currentNode.next;
		}
	}
	search(data) {
		var currentNode = this.head;
		while(currentNode !== null) {
			if(data === currentNode.data) {
				return currentNode;
			}
			currentNode = currentNode.next;
		}
		return false;
	}
	remove(data) {
		let currentNode = this.search(data);
		console.log("lista completa: ");
		this.iterate();
		console.log("entra em remove. currentNode: " + currentNode.getData);
		console.log("this.head: " + this.head);
		console.log("currentNode: " + currentNode);
		console.log("this.head === currentNode : " +  (this.head === currentNode));
		if(!currentNode) return false;
		if(currentNode === this.head) {
			/* there is no block after this.head, therefore this.head === this.tail */
			if(this.head.next === null) {
				this.head.setData = "";
				this._length = 0;
			} 
			else if (this.head.next != null) {
				this.head = currentNode.next;
				currentNode.prev = null;
				this._length--;
			}
		} else if(currentNode === this.tail && (this.tail !== this.head)) {
			this.tail = this.tail.prev;
			this.tail.next = null;
			this._length--;
		} else {
			let nodeBeforeTheOneToDelete  = currentNode.prev;
			let nodeAfterTheOneToDelete   = currentNode.next;
			let nodeToDelete   			      = currentNode;
			nodeBeforeTheOneToDelete.next = nodeAfterTheOneToDelete;
			nodeAfterTheOneToDelete.prev  = nodeBeforeTheOneToDelete;
			nodeToDelete 			            = null;
			this._length--;
		}
		return true; 
	}
}
class Node {
	constructor(data){
		this.prev = null;
		this.next = null;
		this.data = data;
	}
	get getData() {
		return this.data;
	}
	set setData(data) {
		this.data = data;
	}
}

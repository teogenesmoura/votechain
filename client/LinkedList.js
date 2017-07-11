exports.linkedList = class {
	constructor(data) {
		this.head = null;
		this.tail = null;
		this._length = 0;
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
	iterate(){
		var currentNode = this.head;
		while(currentNode !== null) {
			console.log(currentNode.data);
			currentNode = currentNode.next;
		}
	}
	search(data) {
		var currentNode = this.head;
		while(currentNode !== null) {
			if(data === currentNode.data) {
				return currentNode;
			}
		}
		return false;
	}
	remove(data) {
		let currentNode = this.search(data);
		if(!currentNode) return false;
		if(currentNode === this.head) {
			this.head = currentNode.next;
			if(this.head) {
				this.head.previous = null;
			} else {
				this.tail = null;
			}
		}
		if(currentNode === this.tail) {
			this.tail = this.tail.prev;
			this.tail.prev = null;
		} else {
			let nodeBeforeTheOneToDelete = currentNode.prev;
			let nodeAfterTheOneToDelete  = currentNode.next;
			let nodeToDelete   			 = currentNode;

			nodeBeforeTheOneToDelete.next = nodeAfterTheOneToDelete;
			nodeAfterTheOneToDelete.prev  = nodeBeforeTheOneToDelete;
			nodeToDelete 			      = null;
		}
		this._length--;
		return true; 
	}
}
class Node{
	constructor(data){
		this.prev = null;
		this.next = null;
		this.data = data;
	}
	get getData() {
		return this.data;
	}
}

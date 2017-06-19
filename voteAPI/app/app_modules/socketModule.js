let webSocket = require("ws");
let MessageType = {
	QUERY_LATEST: 0,
	QUERY_ALL: 1,
	RESPONSE_BLOCKCHAIN: 2		
};

class socketModule {
	constructor(p2p_port) {
		this.sockets = [];
		this.p2p_port = p2p_port;
	}
	initP2PServer(initialPeers) {
		this.connectToPeers(initialPeers);
		let server = new webSocket.Server({port: this.p2p_port});
		server.on('connection', ws => this.initConnection(ws));
		console.log('listening WebSocket p2p port on ' + this.p2p_port);
	}
	initMessageHandler(ws) {
		ws.on('message', (data) => {
			let message = JSON.parse(data);
			console.log('Received message' + JSON.stringify(message));
			switch(message.type) {
				case MessageType.QUERY_LATEST:
					write(ws, this.responseLatestMsg());
					break;
				case MessageType.QUERY_ALL:
					console.log("QUERY_ALL");
					write(ws, this.responseChainMsg());
					break;
				case MessageType.RESPONSE_BLOCKCHAIN:
					console.log("RESPONSE_BLOCKCHAIN");
					//this.handleBlockchainResponse(message);
					break;
			}
		});
	}
	responseLatestMsg() {
		return 'k';
	}
	responseChainMsg() {
		return 'k';
	}
	initConnection(ws) {
		this.sockets.push(ws);
		this.initMessageHandler(ws);
	}
	connectToPeers(newPeers) {
		newPeers.forEach((peer) => {
			//console.log(peer);
			let ws = new webSocket(peer);
			ws.on('open', () => {
				this.initConnection(ws);				
			});
			ws.on('error', () => {
				return ('connection failed');
			});	
		});
		return "peers added with sucess";
	}
	addPeer(peers) {
		return this.connectToPeers(peers);
	}
	get connectedPeers() {
		return this.sockets;
	}
	write(ws, message) {
		ws.send(JSON.stringify(message));
	}
	broadcast(message) {
		this.sockets.forEach(socket => write(socket, message));
	}
}
module.exports = socketModule;
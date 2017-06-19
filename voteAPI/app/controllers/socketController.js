let p2p_port = process.env.P2P_PORT || 6001;
let socketModule = require('../app_modules/socketModule');
let mSocket = new socketModule(p2p_port);

function newSocketConn(req,res) {
	console.log(m_socket);
}
function initP2PServer(initialPeers) {
	mSocket.initP2PServer(initialPeers);
}
function getPeers(req,res) {
	return mSocket.connectedPeers();
}
function addPeer(req,res) {
	res.send(mSocket.addPeer([req.body.peer]));
}
module.exports = { newSocketConn, initP2PServer, getPeers, addPeer };
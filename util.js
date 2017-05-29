var CryptoJS = require('crypto-js');
module.exports = exports = {};

exports.generate_publicID = function(name){ 
	return CryptoJS.SHA256(name).toString();
}


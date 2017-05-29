var CryptoJS = require('crypto-js');
module.exports = exports = {};

exports.generatePublicID = function(name){ 
	return CryptoJS.SHA256(name).toString();
}


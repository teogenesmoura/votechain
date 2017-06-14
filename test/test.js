process.env.NODE_ENV = 'test';
let app = require('../index.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
var assert = require('assert');
let should = chai.should();

chai.use(chaiHttp);

describe('/POST election', () => {
	it('it should return the ID of a new Election', (done) => {
		chai.request(server)
			.post('/createElection')
			.field('name','testname')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
			done();
		});
	});
});

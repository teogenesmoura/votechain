process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Vote = require('../models/vote');
let server = require('../../server.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Votes', () => {
	beforeEach((done) => {
		Vote.remove({}, (err) => {
			done();
		});
	});
});

/*
  * Test the /GET route
  */
  describe('/GET votes', () => {
      it('it should GET all the books', (done) => {
        chai.request(server)
            .get('/vote')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
        });
    });
});

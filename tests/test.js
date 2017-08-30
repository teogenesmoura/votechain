process.env.NODE_ENV = 'test';
let Vote = require('../models/vote');
let server = require('../server.js');
let chai = require('chai'),
    chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
chai.use(require('chai-json-schema'));

describe('get Votes', () => {
    it('should get votes', (done) => {
        chai.request('https://localhost')
            .get('/vote')
            .end(function (err, res) {    
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.an('Object');
                done();
            });
    });
    it('should create a new election', (done) => {
      let electionData = {
        name: 'election1'
      };
      chai.request('https://localhost')
          .post('/election', electionData)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.an('Object');
            done();
          });
    });
    it('should retrieve all votechains', (done) => {
      let votechainSchema = {
        required: ['_id', 'election','votes'],
        properties: {
          _id: {
            type: 'string'
          },
          election: {
            type: 'string'
          },
          votes: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      };
      chai.request('https://localhost')
          .get('/votechain')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.text).to.be.jsonSchema(votechainSchema);
            done();
          });
    });
    it('should cast a vote in a given election', (done) => {
      let electionData = {
        election: 'election1',
        voter: 'teogenes',
        candidate: 'Barack Obama'
      };
      chai.request('https://localhost')
          .post('/election/castVote')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.an('Object');
            done();
          }); 
    });

});
// let chakram = require('chakram');
// let expect = chakram.expect;

// describe("HTTP get votes", function() {
//   it("should get votes", function() {
//     var voteSchema = {
//       _id: "string",
//       candidate: "string",
//       voter: "string",
//     };
//     var response = chakram.get("http://localhost:3000/vote");
//     expect(response).to.have.status(200);
//     expect(response).to.have.schema(voteSchema);
//     return chakram.wait();
//   });
//   it("should cast a vote to an election", function() {
//     let electionData = {
//       election: "election1",
//       voter: "teogenes",
//       candidate: "Barack Obama"
//     };
//     let expectedResponse = "Voter,Election or Candidate not found";
//     let response = chakram.post('http://localhost:3000/election/castVote',electionData);
//     expect(response).to.have.status(200);
//     expect(response).to.be.an('array')
//     //expect(response).to.equal(expectedResponse);
//     return chakram.wait();
//   });
// });


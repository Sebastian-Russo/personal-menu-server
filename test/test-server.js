const chai = require('chai'); 
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const should = chai.should();
const expect = chai.expect; 

chai.use(chaiHttp);

describe('API', function() {

    it('should 200 on GET requests', function() {
        return chai.request(app)
        .get('/api/')
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
        });
    });
});


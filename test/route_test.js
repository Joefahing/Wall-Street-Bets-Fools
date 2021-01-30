const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const should = require('chai').should();

describe('Exress server /stock', function () {
    describe('/rank', function () {
        it('Should return a object of top stock when request is successful', function (done) {
            this.timeout(4000);
            chai.request(server)
                .get('/stock/rank/week/10')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('object');
                    done();
                });
        });

        it('Should return status 400 when the interval parameter are not valid', function (done) {
            chai.request(server)
                .get('/stock/rank/abc/10')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    done();
                });

        });

        it('Should return status 400 when the counter parameter are not valid', function (done) {
            chai.request(server)
                .get('/stock/rank/week/abc')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    done();
                });
        });
    });
})

describe('Express server /post', function () {
    describe('/profit', function () {
        it('Should return a object of posts containing all the posts with flair of gain and loss when request is successful', function (done) {
            this.timeout(4000);
            chai.request(server)
                .get('/post/profit/week')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('object');
                    done();
                });
        });

        it('Should return status 400 when the interval parameter are not valid', function (done) {
            chai.request(server)
                .get('/post/profit/abc')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    done();
                });
        });
    });
});

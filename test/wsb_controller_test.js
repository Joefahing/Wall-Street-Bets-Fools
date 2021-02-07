const chai = require('chai');
const expect = chai.expect;
const chaiPromise = require('chai-as-promised');
const wsb_controller = require('../controllers/wsb_controller.js');
const ftp_controller = require('../controllers/ftp_controller')

chai.use(chaiPromise);

describe('Function getHistoricalIndex() WSB Controller', function () {
    it('should return json object with time and points when called successfully', function (done) {
        const promise = wsb_controller.historicalIndex();
        expect(promise).to.eventually.have.property('data_used').notify(done);
    });

    it('should return error and reject if anything goes wrong', function (done) {
        const promise = wsb_controller.historicalIndex();
        expect(promise).to.eventually.have.property('dates').notify(done);
    });
});

describe('Function getIndex() WSB Controller', function () {
    it('should return base index', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('base_index').notify(done);
    });

    it('should return current index', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('current_index').notify(done);
    });

    it('should return base date', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('base_date').notify(done);
    });

    it('should return current date', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('current_date').notify(done);
    });
});

describe('Function removeStock () FTP Controller', function () {
    it('should it should return delete count of 0 when document was already deleted', function (done) {
        const stock = "DD";
        ftp_controller.removeSymbol(stock).then((result) => {
            expect(result.delete_count).equal(0);
            done();
        });
    });

    it('should it should return delete count of 0 when random string is entered', function (done) {
        const stock = "fadfava1fd";
        ftp_controller.removeSymbol(stock).then((result) => {
            expect(result.delete_count).equal(0);
            done();
        });
    });

    it('should it should throw error if non string is entered', function (done) {
        const stock = {
            count: 123
        };
        ftp_controller.removeSymbol(stock).catch((error) => {
            expect(error).to.be.an('error');
            done();
        })
    });
});
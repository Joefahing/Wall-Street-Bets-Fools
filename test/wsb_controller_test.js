const chai = require('chai');
const expect = chai.expect;
const chaiPromise = require('chai-as-promised');
const wsb_controller = require('../controllers/wsb_controller');

chai.use(chaiPromise);

describe('Function getHistoricalIndex()', function () {
    it('should return json object with time and points when called successfully', function (done) {
        const promise = wsb_controller.historicalIndex();
        expect(promise).to.eventually.have.property('data_used').notify(done);
    });

    it('should return error and reject if anything goes wrong', function (done) {
        const promise = wsb_controller.historicalIndex();
        expect(promise).to.eventually.have.property('dates').notify(done);
    });
});

describe('Function getIndex()', function () {
    it('should return base index', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('base_index').notify(done);
    });

    it('should return current index', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('current_index').notify(done);
    });

    it('should return  base date', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('base_date').notify(done);
    });

    it('should return current date', function (done) {
        const promise = wsb_controller.getIndex();
        expect(promise).to.eventually.have.property('current_date').notify(done);
    });

})
const chai = require('chai');
const expect = chai.expect;
const chaiPromise = require('chai-as-promised');
const wsb_controller = require('../controllers/wsb_controller');

chai.use(chaiPromise);

describe('Function getHistoricalIndex()', function () {
    it('should return json object with time and points when called successfully', function (done) {
        const promise = wsb_controller.historicalIndex();
        expect(promise).to.eventually.have.property('data_used').notify(done);
    })

    it('should return error and reject if anything goes wrong', function (done) {
        const promise = wsb_controller.historicalIndex();
        expect(promise).to.eventually.have.property('dates').notify(done);
    })
});
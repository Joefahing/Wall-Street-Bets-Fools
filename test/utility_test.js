const expect = require('chai').expect;
const utility = require('../modules/utility');

describe('Utility function trimTimeFromDate', function () {
    it('Return date value in string with time trim off in yyyy-mm-dd format', function () {
        const firstDate = utility.trimTimeFromDate(new Date('2020-01-01T03:21:00'));
        const secondDate = utility.trimTimeFromDate();

        const date = new Date();
        const secondExpectString = date.toISOString();

        expect(firstDate).to.equal('2020-01-01', 'with arguments');
        expect(secondDate).to.equal(secondExpectString.substring(0, secondExpectString.indexOf('T')), 'without arguments');

    });
});
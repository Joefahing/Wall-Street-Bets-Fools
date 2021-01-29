const expect = require('chai').expect;
const should = require('chai').should();
const utility = require('../modules/utility');

describe('Utility Module', function () {
    describe('Function trimTimeFromDate', function () {
        it('Return date value in string with time trim off in yyyy-mm-dd format', function () {
            const firstDate = utility.trimTimeFromDate(new Date('2020-01-01T03:21:00'));
            expect(firstDate).to.equal('2020-01-01T08:00:00', 'with arguments');

        });

        it('trimTimeFormDate Without Arguments', function () {
            const secondDate = utility.trimTimeFromDate();
            const date = new Date();
            const isoString = date.toISOString();
            const expectedString = isoString.substring(0, isoString.indexOf('T', 0) + 3) + ':00:00'

            expect(secondDate).to.equal(expectedString, 'without arguments');

        })
    });

    describe('Function isInterval', function () {
        it('should return true if interval is month, week, day', function () {
            const resultMonth = utility.isInterval('month');
            const resultWeek = utility.isInterval('week');
            const resultDay = utility.isInterval('day');

            resultMonth.should.be.true;
            resultWeek.should.be.true;
            resultDay.should.be.true;
        });

        it('should return false if anything else is passed in as arguments', function () {
            const result = utility.isInterval('hello');
            result.should.be.false;
        })
    });
})

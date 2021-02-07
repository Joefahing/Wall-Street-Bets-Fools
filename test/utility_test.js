const expect = require('chai').expect;
const should = require('chai').should();
const utility = require('../modules/utility');

describe('Utility Module', function () {
    describe('Function trimTimeFromDate', function () {
        it('Return date value in string with time trim off in number format', function () {
            const firstDate = utility.trimTimeFromDate(new Date('2020-01-01T03:21:00Z'));
            expect(firstDate).to.equal(1577836800000);
        });
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

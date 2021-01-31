const should = require('chai').should();
const expect = require('chai').expect;
const ftp = require('../modules/ftp');

describe('FTP Module', function () {

    describe('fetchFromServer Function', function () {
        it('should return a map when complete', async function () {
            const host = 'ftp.nasdaqtrader.com';
            const file = '/SymbolDirectory/nasdaqlisted.txt';
            const stockSymbols = await ftp.fetchFromServer(host, file);
            stockSymbols.should.be.a('array');
        });

        it('should return error when anything goes wrong to fetch function', async function (done) {
            const host = 'ftp.nasdaqtrader.com';
            const file = '/SymbolDirectory/nasdaqlsted.txt';

            try {
                await ftp.fetchFromServer(host, file);
            } catch (error) {
                error.should.be.a('error');
            }
        });
    });

    describe('formatCompanyName Function', function () {
        it('should remove key word at the end of stock name such as Common Stock, Warrant, or Unit with dash in between', function () {
            const name = 'Rocky Mountain Chocolate Factory, Inc. - Common Stock';
            const result = ftp.formatCompanyName(name);

            expect(result.name).to.equal('Rocky Mountain Chocolate Factory, Inc.');
            expect(result.type).to.equal('Common Stock');
        });

        it('should remain the same if there are no key words at the end', function () {
            const name = 'Global X Artificial Intelligence & Technology ETF';
            const result = ftp.formatCompanyName(name);

            expect(result.name).to.equal(name);
            expect(result.type).to.equal('none');
        });

        it('should not remove anything if the dash is part of the name', function () {
            const name = 'First Trust NASDAQ-100 Equal Weighted Index Fund';
            const result = ftp.formatCompanyName(name);

            expect(result.name).to.equal(name);
        });
    });
});


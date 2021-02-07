const ftp = require('../modules/ftp');
const stock = require('../models/stock');

async function fetchStockListings() {
    const host = 'ftp.nasdaqtrader.com';
    const nasdaqFile = '/SymbolDirectory/nasdaqlisted.txt';
    const nyseFile = '/SymbolDirectory/otherlisted.txt';
    const nasdaqListings = await ftp.fetchFromServer(host, nasdaqFile);
    const nyseListings = await ftp.fetchFromServer(host, nyseFile);
    const allListings = nasdaqListings.concat(nyseListings);

    return allListings
}

exports.addIndex = async function () {
    try {
        const listings = await fetchStockListings();
        const newListings = [];

        for (const listing of listings) {
            const { name, symbol } = listing;
            const symbolExist = await stock.symbolExists(symbol);

            if (!symbolExist) {
                const newListing = await stock.addSymbol(symbol, name);
                newListings.push(newListing);
            }
        }

        return newListings;
    } catch (error) {
        throw error
    }
}


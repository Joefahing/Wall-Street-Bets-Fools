const common_words = require('../modules/common_words');
const ftp = require('../modules/ftp');
const Stock = require('../models/stock');
const Word = require('../models/word');


async function fetchStockListings() {
    const host = 'ftp.nasdaqtrader.com';
    const nasdaqFile = '/SymbolDirectory/nasdaqlisted.txt';
    const nyseFile = '/SymbolDirectory/otherlisted.txt';
    const nasdaqListings = await ftp.fetchFromServer(host, nasdaqFile);
    const nyseListings = await ftp.fetchFromServer(host, nyseFile);
    const allListings = nasdaqListings.concat(nyseListings);

    return allListings
}

exports.addSymbol = async function () {
    try {
        const listings = await fetchStockListings();
        const filterWords = await Word.getWordSet();
        const newListings = [];

        for (const listing of listings) {
            const { name, symbol } = listing;
            const symbolExist = await Stock.symbolExists(symbol);
            const isFilterWord = filterWords.has(symbol);

            if (!symbolExist && !isFilterWord) {
                const newListing = await Stock.addSymbol(symbol, name);
                newListings.push(newListing);
            }
        }

        return newListings;
    } catch (error) {
        throw error
    }
}

async function removeSymbol(removeStock = '') {
    try {
        const result = await Stock.deleteOne({})
            .where({ symbol: removeStock })
            .exec();

        return {
            delete_count: result.deletedCount
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.removeInvalidSymbols = async function () {
    try {
        const wordsRemoved = [];
        const filterWords = await Word.getAllWords();
        console.log('searching for words to delete');

        for (const word of filterWords) {
            const symbolExists = await Stock.exists({ symbol: word });

            if (symbolExists) {
                await removeSymbol(word);
                console.log(`This word has been deleted: ${word}`)
                wordsRemoved.push(word);
            }
        }

        return wordsRemoved;

    } catch (error) {
        console.log('Error Occured during delete operation');
        console.log(error);
        throw (error);
    }
}

exports.removeSymbol = removeSymbol
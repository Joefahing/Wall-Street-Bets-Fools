const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

const mongoose = require('./dbhelper').mongoose;
const StockSchema = require('../models/stock');
const Stock = mongoose.model('Stock', StockSchema);

const nasdaq_csv = path.join('/Users/joefacao/Desktop/Express/ProjectRedditFools', 'assets', 'NASDAQ.csv');
const nyse_csv = path.join('/Users/joefacao/Desktop/Express/ProjectRedditFools', 'assets', 'NYSE.csv');

function getAllStockSymbolFromCSV() {
    const stocks = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(nasdaq_csv)
            .pipe(csv.parse({ headers: true }))
            .on('data', (stock_data) => {
                stocks.push({
                    Symbol: stock_data.Symbol,
                    Name: stock_data.Name,
                    Sector: stock_data.Sector
                });
            })
            .on('end', () => {
                fs.createReadStream(nyse_csv)
                    .pipe(csv.parse({ headers: true }))
                    .on('data', (stock_data) => {
                        stocks.push({
                            Symbol: stock_data.Symbol,
                            Name: stock_data.Name,
                            Sector: stock_data.Sector
                        });
                    })
                    .on('end', () => resolve(stocks))
            })
    })
}

async function addStockSymbols(allStocksInput) {
    const allStocksFromCSV = allStocksInput;

    const stocksAdded = []

    try {
        const allStocksFromDatabase = await Stock.find();
        const allSymbolFromDatabase = allStocksFromDatabase.map(stock => stock.symbol);

        const stockDict = new Set(allSymbolFromDatabase);

        for (let index = 0; index < allStocksFromCSV.length; index++) {
            const { Symbol, Name, Sector } = allStocksFromCSV[index];

            if (!stockDict.has(Symbol)) {
                const newStock = new Stock({
                    symbol: Symbol,
                    name: Name,
                    sector: Sector
                });
                const savedStock = await newStock.save();
                stocksAdded.push(savedStock.symbol);
            }
        }
    } catch (error) {
        console.log('error ocurred during database extraction');
        throw error;
    }
    return stocksAdded;
}

exports.addStockSymbols = addStockSymbols;

async function findSymbol(stock_symbol) {
    try {
        const stock_info = await Stock.find({
            symbol: stock_symbol,
        });

        return stock_info;

    } catch (error) {
        return error;
    }
}

exports.findSymbol = findSymbol;



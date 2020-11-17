const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

const nasdaq_csv = path.join(__dirname, 'assets', 'NASDAQ.csv');
const nyse_csv = path.join(__dirname, 'assets', 'NYSE.csv');


function getAllStockSymbol() {
    const stocks = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(nasdaq_csv)
            .pipe(csv.parse({ headers: true }))
            .on('data', (stock_data) => {
                stock_datas.push({
                    Symbol: stock_data.Symbol,
                    Name: stock_data.Name,
                    Sector: stock_data.Sector
                });
            })
            .on('end', () => {
                fs.createReadStream(nyse_csv)
                    .pipe(csv.parse({ headers: true }))
                    .on('data', (stock_data) => {
                        stock_datas.push({
                            Symbol: stock_data.Symbol,
                            Name: stock_data.Name,
                            Sector: stock_data.Sector
                        });
                    })
                    .on('end', () => resolve(stocks))
            })
    })
}

module.exports = getAllStockSymbol();
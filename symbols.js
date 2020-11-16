const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

const nasdaq_csv = path.join(__dirname, 'assets', 'NASDAQ.csv');
const nyse_csv = path.join(__dirname, 'assets', 'NYSE.csv');


function getAllStockSymbol() {
    const chunks = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(nasdaq_csv)
            .pipe(csv.parse({ headers: true }))
            .on('data', (chunk) => {
                chunks.push({
                    Symbol: chunk.Symbol,
                    Name: chunk.Name,
                    Sector: chunk.Sector
                });
            })
            .on('end', () => {
                fs.createReadStream(nyse_csv)
                    .pipe(csv.parse({ headers: true }))
                    .on('data', (chunk) => {
                        chunks.push({
                            Symbol: chunk.Symbol,
                            Name: chunk.Name,
                            Sector: chunk.Sector
                        });
                    })
                    .on('end', () => resolve(chunks))
            })
    })
}

module.exports = getAllStockSymbol();
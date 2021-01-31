const ls = require('readline');
const Client = require('ftp');

function formatCompanyName(name = '') {
    const indexOfDash = name.lastIndexOf('-');
    const notFound = -1;
    const result = {
        name: '',
        type: 'none'
    }

    if (indexOfDash === notFound || (name.charAt(indexOfDash - 1) !== ' ' && name.charAt(indexOfDash + 1) !== ' ')) {
        result.name = name;
    } else {
        result.name = name.substring(0, indexOfDash).trimEnd();
        result.type = name.substring(indexOfDash + 1, name.length).trimStart();
    }
    return result;
}

/***
 * The pop is called once before resolving promises because last line is timestamp
 */
function fetchFromServer(host = '', file = '') {
    return new Promise((resolve, reject) => {
        const client = new Client();
        const symbols = [];

        client.connect({
            host: host,
        });

        client.on('ready', () => {
            client.get(file, (error, readStream) => {
                if (error) reject(error);

                const readLine = ls.createInterface({ input: readStream });

                readLine.on('line', (line) => {
                    const column = line.split("|");
                    const symbol = column[0];
                    const company_info = formatCompanyName(column[1]);
                    const stock_info = {
                        symbol,
                        name: company_info.name,
                        type: company_info.type
                    };

                    symbols.push(stock_info);
                });

                readLine.on('close', () => {
                    client.end();
                    symbols.pop();
                    resolve(symbols);
                });

            });
        });

        client.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports.fetchFromServer = fetchFromServer;
module.exports.formatCompanyName = formatCompanyName;

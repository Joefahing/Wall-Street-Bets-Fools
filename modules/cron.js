const CronJob = require('cron').CronJob;
const wsb_controller = require('../controllers/wsb_controller');
const ftp_controller = require('../controllers/ftp_controller');

const wsbGetPost = new CronJob('*/30 * * * *', () => {
    wsb_controller.addPostAndPostSymbol(250)
        .then(result => console.log(`Added ${result.length} Posts`))
}, null);

const wsbAddIndex = new CronJob('2 */1 * * *', () => {
    wsb_controller.addIndex()
        .then(result => console.log(`Added ${result.length} indexes`))
        .catch(error => console.log(`error from addIndex Cron Job ${error}`));
}, null);

const ftpAddSymbol = new CronJob('10 1 1 * *', async () => {
    try {
        const addedSymbols = await ftp_controller.addSymbol();
        const deletedSymbols = await ftp_controller.removeInvalidSymbols();

        console.log(`Symbols added: `);
        console.log(addedSymbols);
        console.log('Symbols removed:');
        console.log(deletedSymbols);

    } catch (error) {
        console.log(`Error on ftp cron job \n${error}`);
    }
}, null);

function startJobs() {
    wsbGetPost.start();
    wsbAddIndex.start();
    ftpAddSymbol.start();
}

exports.startJobs = startJobs;
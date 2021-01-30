const CronJob = require('cron').CronJob;
const wsb_controller = require('../controllers/wsb_controller');

const wsbGetPost = new CronJob('*/30 * * * *', () => {
    wsb_controller.addPostAndPostSymbol(250)
        .then(result => console.log(`Added ${result.length} Posts`))
}, null);

const wsbAddIndex = new CronJob('5 */1 * * *', () => {
    wsb_controller.addIndex()
        .then(result => console.log(result.length))
        .catch(error => console.log(`error from addIndex Cron Job ${error}`));
}, null);

function startJobs() {
    wsbGetPost.start();
    wsbAddIndex.start();
}
exports.startJobs = startJobs;
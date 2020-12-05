const CronJob = require('cron').CronJob;
const wsb_controller = require('../controllers/wsb_controller');

const wsbGetPost = new CronJob('0 */1 * * *', () => {
    wsb_controller.addPostAndPostSymbol(250).then(result => console.log(`Added ${result.length} Posts`))
}, null);

function startJobs() {
    wsbGetPost.start();
}
exports.startJobs = startJobs;
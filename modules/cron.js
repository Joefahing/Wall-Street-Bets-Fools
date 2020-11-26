const CronJob = require('cron').CronJob;
const wsb = require('./wsb');

const cron_wsb_get_post = new CronJob('0 */1 * * *', () => {
    wsb.addPostAndStockPost(250).then(result => console.log(`Added ${result.length} Posts`))
}, null);

function startJobs() {
    cron_wsb_get_post.start();
}
exports.startJobs = startJobs;
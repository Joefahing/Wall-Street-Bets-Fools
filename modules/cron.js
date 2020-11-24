const Cron = require('cron').CronJob;
const wsb = require('./wsb');

const cron_wsb_get_post = new Cron('0 */3 * * *', wsb.addPostAndStockPost(100));

function startJobs() {
    cron_wsb_get_post.start();
}

exports.startJobs = startJobs;
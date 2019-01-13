var CronJob = require('cron').CronJob;
var Cron = require('./backupGenerator.js');

new CronJob('0 0 0 * * *', function () {
    Cron.dbAutoBackUp();
}, null, true, 'America/New_York');
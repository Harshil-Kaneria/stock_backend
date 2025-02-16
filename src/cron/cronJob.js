const cron = require("node-cron");
import { handleSubscriptionForAndroid, handleSubscriptionForApple, handleFreeTrialsForUsers } from "./controllers/cronHelpers";

cron.schedule("0 0 * * *", () => {
    console.log('Running cron job at 00:00 for update subscription');
    handleSubscriptionForAndroid()
    handleSubscriptionForApple()
});

cron.schedule('15 * * * *', () => {
    console.log('Running cron job every 15 min for update free trial ends');
    handleFreeTrialsForUsers()
});
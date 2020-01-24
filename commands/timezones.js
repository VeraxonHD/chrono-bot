module.exports = {
    name: "timezones",
    description: "Lists available timezones and their member size.",
    alias: [],
    usage: `timezones`,
    permissions: "NONE",
    execute(message, args) {
        const moment = require("moment");
        const common = require("../store/common.js");

        const timezones = common.getTimeZoneList();

        message.channel.send(`# Time Zone List\n${timezones}`, {code: "md"});
    }
}
module.exports = {
    name: "time",
    description: "Displays the time.",
    alias: ["t"],
    usage: `time [timezone|registeredUserMentioned]`,
    permissions: "NONE",
    execute(message, args) {
        const moment = require("moment");
        const momentTimeZone = require("moment-timezone");
        const common = require("../store/common.js");
        const registered = require("../store/registered.json");

        const timezones = common.getTimeZoneList();
        var time = momentTimeZone().format("HH:mm:ss ZZ");

        if(message.mentions.members.first()){
            const target = message.mentions.members.first();
            if(registered[target.id]){
                time = momentTimeZone().tz(registered[target.id].timezone).format("HH:mm:ss ZZ");
                return message.channel.send(`# Current Time for user ${target.user.tag}\n${time}`, {code: "md"});
            }else{
                message.channel.send("That user isn't registered, so let them know that they should do that ASAP! Just type `~help register`!");
            }
        }else if(args[0]){
            if(timezones.indexOf(args[0]) != -1){
                time = momentTimeZone().tz(args[0]).format("HH:mm:ss ZZ");
                return message.channel.send(`# Current Time in ${args[0]}\n${time}`, {code: "md"});
            }else{
                return message.channel.send(`**Timezone is not valid. Please type \`~timezones\` for a list of timezones.**`);
            }
        }else{
            return message.channel.send(`# Current Time\n${time}`, {code: "md"});
        }
    }
}
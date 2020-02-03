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
        const gEvents = require(`../store/guilds/${message.guild.id}/guildEvents.json`);

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
            var foundItem = false;
            var user = registered[message.author.id];
            var event = gEvents[args[0]];
            if(event){
                if(event.timezone == user.timezone){
                    time = momentTimeZone(event.timeDestined).format("dddd, MMMM Do YYYY, HH:mm:ss zz");
                }else{
                    time = momentTimeZone(event.timeDestined).tz(user.timezone).format("dddd, MMMM Do YYYY, HH:mm:ss zz");
                } 
                foundItem = true;
                return message.channel.send(`# Current Time in ${args[0]}\n${time}`, {code: "md"});
            }else{
                try{
                    time = momentTimeZone().tz(args[0]).format("HH:mm:ss ZZ");
                }catch(err){
                    time = "Invalid Timezone";
                }
                return message.channel.send(`# Current Time in ${args[0]}\n${time}`, {code: "md"});
            }
        }else if(registered[message.author.id]){
            time = momentTimeZone().tz(registered[message.author.id].timezone).format("HH:mm:ss ZZ");
            return message.channel.send(`# Current Time\n${time}`, {code: "md"});
        }else{
            return message.channel.send("You must be `~register`ed to perform that command. It takes literally less than 5 seconds so go do it!");
        }
    }
}
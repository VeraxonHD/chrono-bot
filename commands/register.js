module.exports = {
    name: "register",
    description: "Registers the user with the system.",
    alias: [],
    usage: `register <timezone> -- type ~timezones for a list.`,
    permissions: "NONE",
    execute(message, args) {
        const moment = require("moment");
        const common = require("../store/common.js");
        const registered = require("../store/registered.json");
        const jsonfile = require("jsonfile");
        
        if(common.checkTimezoneValidity(args[0])){
            if(registered[message.author.id]){
                registered[message.author.id].timezone = args[0];
            }else{
                registered[message.author.id] = {
                    "userID": message.author.id,
                    "timezone": args[0]
                };
            }
            jsonfile.writeFile("./store/registered.json", registered, {spaces: 4}, err =>{
                if(err){
                    return message.reply(`There was an error writing to the file. Please try again later or contact Vex#1337`);
                }else{
                    return message.reply(`Success! You have been registered with timezone **${args[0]}**`);
                }
            });
        }else{
            return message.channel.send(`Unfortunately, that's an invalid timezone. Timezones in Chrono are akin to local identifiers. Go to \`http://kevalbhatt.github.io/timezone-picker/\` to find a list of available ones!`);
        }
    }
}
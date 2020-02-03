exports.missingArgumentsEmbed = (channel, command, args, pos) =>{
    const Discord = require("discord.js");
    var embed = new Discord.RichEmbed()
    .setAuthor("An Error occurred trying to run " + command)
    .addField("ERROR - Missing Arguments", `**${args}** was missing from your command message.\nIt should be the **${pos}** argument.`)
    .setColor("#ff0000")
    .setFooter("CHRONO-ERR_MISSING_ARGS EVENT")
    .setTimestamp(new Date());
    channel.send({embed});
}

module.exports = {
    event: function(message, currentCaseID, title, description, timeCreated, timeDestined, timezone, msgID) {
        var gEvents = require(`../store/guilds/${message.guild.id}/guildEvents.json`);
        const jsonfile = require("jsonfile");
        const Discord = require("discord.js");
        
        this.eventID = currentCaseID;
        this.title = title;
        this.description = description;
        this.timeCreated = timeCreated;
        this.timeDestined = timeDestined;
        this.msgID = msgID;
        this.timezone = timezone;
        
        var embedMSG = message.channel.messages.get(this.msgID);
        if(!embedMSG){
            Console.log(`[CHRONO] [event.event().save()] [ERROR] - embed message could not be found`);
        }else{
            embedMSG.react("⏰");
        }

        this.save = async function () {
            gEvents[this.eventID] = {
                "title": this.title,
                "description": this.description,
                "timeCreated": this.timeCreated,
                "timeDestined": this.timeDestined,
                "timezone": this.timezone,
                "msgID": this.msgID,
                "eventID": this.eventID,
                "members": []
            };
            jsonfile.writeFileSync(`./store/guilds/${message.guild.id}/guildEvents.json`, gEvents, { spaces: 4 }, (err) => {
                if (err) {
                    return console.log(`[CHRONO] [event.event().save()] [ERROR] - jsonfile failed to write to file ${gEventFile} with new event data ${gEvents}`);
                }else{
                    return console.log(`[CHRONO] [event.event().save()] New event added to ${message.guild.name} with data ${gEvents}`);
                }
            });
        };
        this.updateMembers = function (userID) {
            console.log(`[CHRONO] [event.event().updateMembers()] updateMembers triggered`);
            if (gEvents[this.eventID].members.indexOf(userID) != -1) {
                console.log(`[CHRONO] [event.event().updateMembers()] Member already in array - removing...`);
                var pos = gEvents[this.eventID].members.indexOf(userID);
                gEvents[this.eventID].members.splice(pos, 1);
            }else{
                console.log(`[CHRONO] [event.event().updateMembers()] Member not in array - adding...`);
                gEvents[this.eventID].members.push(userID);
            }
            jsonfile.writeFileSync(`./store/guilds/${message.guild.id}/guildEvents.json`, gEvents, { spaces: 4 }, (err) => {
                if(err){
                    return console.log(`[CHRONO] [event.event().updateMembers()] [ERROR] - jsonfile failed to write to file ${gEventFile} with new event subscriber data for event ${this.eventID}.`);
                }else{
                    return console.log(`[CHRONO] [event.event().updateMembers()] Event ${this.eventID} saved with new event subscriber data.`);
                }
            });
        };
    },
    checkTimezoneValidity: function(input){
        const timezones = require("./timezones.json");
        if(timezones[input]){
            return true;
        }else{
            return false;
        }
    },
    invalidPermissions: function(channel, command, permission) {
        const Discord = require("discord.js");
        var embed = new Discord.RichEmbed()
        .setAuthor("An Error occurred trying to run " + command)
        .addField("ERROR - Invalid Permissions", `**${permission}** is required to run this command.\nContact your server Administrator if you believe this to be an error.`)
        .setColor("#ff0000")
        .setFooter("CHRONO-ERR_INVALID_PERMISSIONS EVENT")
        .setTimestamp(new Date());
        channel.send({embed});
    },
    userNotFound: function(channel, user) {
        const Discord = require("discord.js");
        var embed = new Discord.RichEmbed()
            .setAuthor("An Error occurred trying to find " + user)
            .addField("ERROR - User Not Found", `Check that your username is correct and try again.`)
            .setColor("#ff0000")
            .setFooter("CHRONO-ERR_USER_NOT_FOUND EVENT")
            .setTimestamp(new Date());
        channel.send({embed});
    },
    missingArgumentsEmbed: function(channel, command, args, pos) {
        const Discord = require("discord.js");
        var embed = new Discord.RichEmbed()
            .setAuthor("An Error occurred trying to run " + command)
            .addField("ERROR - Missing Arguments", `**${args}** was missing from your command message.\nIt should be the **${pos}** argument.`)
            .setColor("#ff0000")
            .setFooter("CHRONO-ERR_MISSING_ARGS EVENT")
            .setTimestamp(new Date());
        channel.send({embed});
    }
}
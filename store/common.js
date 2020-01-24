exports.getTimeZoneList = () => {
    const timezones = ["GMT", "CEST", "CET", "EET", "ART", "EAT", "MET", "NET", "PLT", "IST", "BST", "VST", "CTT", "JST", "ACT", "AET", "SST", "NST", "MIT", "HST", "AST", "PST", "PNT", "MST", "CST", "EST", "IET", "PRT", "CNT", "AGT", "BET", "CAT"];
    return timezones;
}

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

exports.userNotFound = (channel, user) =>{
    const Discord = require("discord.js");
    var embed = new Discord.RichEmbed()
        .setAuthor("An Error occurred trying to find " + user)
        .addField("ERROR - User Not Found", `Check that your username is correct and try again.`)
        .setColor("#ff0000")
        .setFooter("CHRONO-ERR_USER_NOT_FOUND EVENT")
        .setTimestamp(new Date());
    channel.send({embed});
}

exports.invalidPermissions = (channel, command, permission) =>{
    const Discord = require("discord.js");
    var embed = new Discord.RichEmbed()
        .setAuthor("An Error occurred trying to run " + command)
        .addField("ERROR - Invalid Permissions", `**${permission}** is required to run this command.\nContact your server Administrator if you believe this to be an error.`)
        .setColor("#ff0000")
        .setFooter("CHRONO-ERR_INVALID_PERMISSIONS EVENT")
        .setTimestamp(new Date());
    channel.send({embed});
}
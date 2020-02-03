const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const jsonfile = require("jsonfile");
const common = require("./store/common.js");

const prefix = config.prefix;

client.on("ready", () =>{
    console.log("Bot Loaded. Nice.");
    //client.user.setPresence({ game: { name: 'In Development! C: 1.1.0 |D: 1.2.0', type: "Watching" }, status: 'idle' });
    client.user.setPresence({ game: { name: 'Version 1.2.0', type: "Watching" }, status: 'online' });

    client.commands = new Discord.Collection();
    const commandDirArray = fs.readdirSync("./commands");
    commandDirArray.forEach(e => {
        const commandFile = require(`./commands/${e}`);
        client.commands.set(commandFile.name, commandFile);
    });
});
/*==========================================================================================================================================================================================================================
|| Unfinished. Do not un-comment.                                                                                                                                                                                         ||
|| Issues: figure out a way to loop through each file for each event. May require re-factor of backend for events?                                                                                                        ||
============================================================================================================================================================================================================================
client.setInterval(() => {
    const gEvents = require(`./store/guilds/${guild.id}/guildEvents.json`);
    for(var event in gEvents){
        var currTime = moment();
        if(moment(event.timeDestined) > currTime){
            event.members.forEach(member =>{
                member.send(`Greetings! This is an automated reminder that the event titled **${event.title}** has started in the last 3 or so seconds.\nPlease make your way to the event! Thanks for using Chrono!**`);
            });
        }
    }
}, 3000);
==========================================================================================================================================================================================================================*/
client.on("message", (message) => {
    const guild = message.guild;
    const gConfig = require(`./store/guilds/${guild.id}/guildConfig.json`);

    if(message.channel.type != "dm"){
        if(!message.content.startsWith(prefix) || message.author.id == client.user.id) return;
    
        const args = message.content.slice(prefix.length).split(" ");
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
    
        if(!command){
            return;
        }else{
            try{
                if(gConfig.disabledCommands.indexOf(command.name) != -1){
                    return message.reply("That command has been disabled by your server owner. Contact them for information.");
                }else{
                    command.execute(message, args, prefix, client, Discord);
                }
            }catch(error){
                console.error(error);
                const embed = new Discord.RichEmbed()
                    .addField("An Error Occured.", error.message)
                    .setTimestamp(new Date())
                    .setColor("#ff0000");
                message.channel.send({embed});
            }
        }
    }
});

client.on("guildCreate", (guild) => {
    var dir = `./store/guilds/${guild.id}`;
    var gConfFile = `${dir}/guildConfig.json`;
    var gEventFile = `${dir}/guildEvents.json`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        console.log(`[CHRONO] [guildCreate] ${dir} has been created successfully.`);
    }

    if(!fs.existsSync(gConfFile)){ 

        var gConf = {
            "name": guild.name,
            "owner": guild.owner.id,
            "disabledCommands": [],
            "menus": {
                "mainSelector": {
                    "enabled": false,
                    "channel": ""
                }
            }
        }

        jsonfile.writeFileSync(gConfFile, gConf, {spaces: 4}, err =>{
            if(err){
                return console.log(`[CHRONO] [guildCreate] [ERROR] - jsonfile failed to write to file ${gConfFile}`);
            }else{
                console.log(`[CHRONO] [guildCreate] ${dir} has been populated with default data successfully.`);
                var embed = new Discord.RichEmbed()
                    .setColor("#32a852")
                    .setAuthor(`You added Chrono to ${guild.name}`)
                    .addField(`Welcome to the Chrono family, ${guild.owner.displayName}!`, "Thanks for adding me! Read below for some top tips :)")
                    .addField("Use the help command to get started!", "Just type `~help`.")
                    .addField("Don't be afraid to ask for help!", "If you ever need assistance, just contact `Vex#1337`.\nIf you find a bug, report it on `https://github.com/veraxonhd/chronos-bot`!")
                    .setTimestamp(new Date());
                guild.owner.send({embed});
            }
        });
    }

    if(!fs.existsSync(gEventFile)){ 
        var gEvents = {};
        jsonfile.writeFileSync(gEventFile, gEvents, {spaces: 4}, err =>{
            if(err){
                return console.log(`[CHRONO] [guildCreate] [ERROR] - jsonfile failed to write to file ${gEventFile}`);
            }else{
                console.log(`[CHRONO] [guildCreate] ${dir} has been populated with default data successfully.`);
            }
        });
    }
});

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('raw', async event => {
	if (!events.hasOwnProperty(event.t)) return;

	const { d: data } = event;
	const user = client.users.get(data.user_id);
	const channel = client.channels.get(data.channel_id) || await user.createDM();

	if (channel.messages.has(data.message_id)) return;
	const message = await channel.fetchMessage(data.message_id);

	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
	const reaction = message.reactions.get(emojiKey);

	client.emit(events[event.t], reaction, user);
});

client.on("messageReactionAdd", (messageReaction, user) =>{
    console.log(`Reaction Add Triggered`);
    const message = messageReaction.message;
    const guild = message.guild;

    const gEvents = require(`./store/guilds/${guild.id}/guildEvents.json`);

    if(messageReaction.emoji.name == "⏰" && user.id != client.user.id){
        for(var event in gEvents){
            if(message.id == gEvents[event].msgID){
                var eventID = gEvents[event].eventID;

                if(gEvents[event].members.indexOf(user.id) != -1){
                    return;
                }

                console.log(`[CHRONO] [main.messageReactionAdd] Member not in array - adding...`);
                gEvents[eventID].members.push(user.id);

                jsonfile.writeFileSync(`./store/guilds/${message.guild.id}/guildEvents.json`, gEvents, { spaces: 4 }, (err) => {
                    if(err){
                        return console.log(`[CHRONO] [main.messageReactionAdd] [ERROR] - jsonfile failed to write to file ${gEventFile} with new event subscriber data for event ${eventID}.`);
                    }else{
                        return console.log(`[CHRONO] [main.messageReactionAdd] Event ${eventID} saved with new event subscriber data.`);
                    }
                });
            }
        }
    }else{
        return;
    }
});

client.on("messageReactionRemove", (messageReaction, user) =>{
    console.log(`Reaction Remove Triggered`);
    const message = messageReaction.message;
    const guild = message.guild;

    const gEvents = require(`./store/guilds/${guild.id}/guildEvents.json`);

    if(messageReaction.emoji.name == "⏰" && user.id != client.user.id){
        for(var event in gEvents){
            if(message.id == gEvents[event].msgID){
                var eventID = gEvents[event].eventID;

                if(gEvents[event].members.indexOf(user.id) == -1){
                    return;
                }

                console.log(`[CHRONO] [main.messageReactionAdd] Member already in array - removing...`);
                var pos = gEvents[event].members.indexOf(user.id);
                gEvents[eventID].members.splice(pos, 1);
                
                jsonfile.writeFileSync(`./store/guilds/${message.guild.id}/guildEvents.json`, gEvents, { spaces: 4 }, (err) => {
                    if(err){
                        return console.log(`[CHRONO] [main.messageReactionAdd] [ERROR] - jsonfile failed to write to file ${gEventFile} with new event subscriber data for event ${eventID}.`);
                    }else{
                        return console.log(`[CHRONO] [main.messageReactionAdd] Event ${eventID} saved with new event subscriber data.`);
                    }
                });
            }
        }
    }else{
        return;
    }
});

process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: \n", err);
});

client.login(config.token);
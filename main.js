const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const jsonfile = require("jsonfile");

const prefix = config.prefix;

client.on("ready", () =>{
    console.log("Bot Loaded. Nice.");
    //client.user.setPresence({ game: { name: 'In Development! C: 0.0.0 |D: 0.1.0', type: "Watching" }, status: 'idle' });
    client.user.setPresence({ game: { name: 'Version 1.0.0', type: "Watching" }, status: 'online' });

    client.commands = new Discord.Collection();
    const commandDirArray = fs.readdirSync("./commands");
    commandDirArray.forEach(e => {
        const commandFile = require(`./commands/${e}`);
        client.commands.set(commandFile.name, commandFile);
    });
});

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

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        console.log(`[CHRONO] [guildCreate] ${dir} has been created successfully.`);
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

            jsonfile.writeFile(gConfFile, gConf, {spaces: 4}, err =>{
                if(err){
                    return message.reply(`There was an error writing to the file. Please try again later or contact Vex#1337`);
                }else{
                    console.log(`[CHRONO] [guildCreate] ${dir} has been populated with default data successfully.`);
                    var embed = new Discord.RichEmbed()
                        .setColor("#32a852")
                        .setAuthor(`You added Chrono to ${guild.name}`)
                        .addField(`Welcome to the Chrono family, ${guild.owner.displayName}!`, "Thanks for adding me! Read below for some top tips :)")
                        .addField("Use the help command to get started!", "Just type `~help`.")
                        .addField("Don't be afraid to ask for help!", "If you ever need assistance, just contact `Vex#1337`. If you find a bug, report it on `https://github.com/veraxonhd/chronos-bot`!")
                        .setTimestamp(new Date());
                    return guild.owner.send({embed});
                }
            });
        }
    }
});

process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: \n", err);
});

client.login(config.token);
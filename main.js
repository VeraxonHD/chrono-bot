const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

const prefix = config.prefix;

client.on("ready", () =>{
    console.log("Bot Loaded. Nice.");
    client.user.setPresence({ game: { name: 'In Development! C: 0.0.0 |D: 0.1.0', type: "Watching" }, status: 'idle' });

    client.commands = new Discord.Collection();
    const commandDirArray = fs.readdirSync("./commands");
    commandDirArray.forEach(e => {
        const commandFile = require(`./commands/${e}`);
        client.commands.set(commandFile.name, commandFile);
    });
});

client.on("message", (message) => {
    if(message.channel.type != "dm"){
        if(!message.content.startsWith(prefix) || message.author.id == client.user.id) return;
    
        const args = message.content.slice(prefix.length).split(" ");
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
    
        if(!command){
            return;
        }else{
            try{
                command.execute(message, args, prefix, client, Discord);
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

process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: \n", err);
});

client.login(config.token);
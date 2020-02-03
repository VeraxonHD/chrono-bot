module.exports = {
    name: "event",
    description: "Creates an event, allowing users to RSVP. Also sends a reminder when the event is starting.",
    alias: ["config", "cfg"],
    usage: "configure <-dc disabledCommands | -dl disabledLogs | -lc logchannel> <value> ...\n<-lc channelID>",
    permissions: "ADMINISTRATOR",
    async execute(message, args) {
        const common = require("../store/common.js");
        const registered = require("../store/registered.json");
        const Discord = require("discord.js");
        const moment = require("moment-timezone");

        if(!registered[message.author.id]){
            return message.reply("Sorry! You must be a `~register`ed member to use this command. It takes 5 seconds!");
        }else{
            /*============================================================================================================================================
            ||DEPRECATED METHOD - USE WIZARD INSTEAD                                                                                                    ||
            ==============================================================================================================================================
            var timezone = registered[message.author.id].timezone;
            var eventTitle = args[0];
            var eventDesc = args[1];
            var eventDateCreated = moment().tz(timezone);
            var eventDateDestined = moment(args[2]);

            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXY0123456789";
              
                for (var i = 0; i < 5; i++)
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
              
                return text;
            }
            var currentCaseID = makeid();

            const embed = new Discord.RichEmbed()
                .setAuthor(`New Event: ${args[0]}`)
                .addField("Description", args[1])
                .addField("Created by", message.member.displayName)
                .addField("Time Created", eventDateCreated)
                .addField("Time & Date of Launch", eventDateDestined)
                .setFooter(`Event ID for Lookup: ${currentCaseID}`);

            await message.channel.send({embed}).then(async msg =>{
                var newEvent = new common.event(message, currentCaseID, eventTitle, eventDesc, eventDateCreated, eventDateDestined, timezone, msg.id);
                newEvent.save();
            })
            message.reply("Added a new event and saved data successfully.");
            ============================================================================================================================================*/

            var mCollectorFilter = m => m.author.id == message.author.id;
            var eventTitle;
            var eventDescription;
            var eventDate;
            var eventTime;

            message.reply("Welcome to the Event Creation Wizard! To start, please enter a title for your new event!").then(msg =>{
                const mTitleCollector = message.channel.createMessageCollector(mCollectorFilter, {time: 60000});

                mTitleCollector.on("collect", mTitle =>{
                    mTitleCollector.stop();
                    eventTitle = mTitle.content;
                    mTitle.delete();
                    msg.edit(`${msg.content}\n**[Event Title]**: ${mTitle.content}`);

                    message.channel.send("Okay! Please now enter a description. Something to let other users know what the event is about!").then(msg2 =>{
                        const mDescCollector = message.channel.createMessageCollector(mCollectorFilter, {time: 60000});
    
                        mDescCollector.on("collect", mDesc =>{
                            mDescCollector.stop();
                            eventDescription = mDesc.content;
                            mDesc.delete();
                            msg2.delete();
                            msg.edit(`${msg.content}\n**[Event Description]**: ${mDesc.content}`);

                            message.channel.send("Brilliant. Now enter a Date. Please enter in the format **YYYY-MM-DD** to avoid confusion!").then(msg3 =>{
                                const mDateCollector = message.channel.createMessageCollector(mCollectorFilter, {time: 60000});
            
                                mDateCollector.on("collect", mDate =>{
                                    mDateCollector.stop();
                                    date = mDate.content;
                                    mDate.delete();
                                    msg3.delete();
                                    msg.edit(`${msg.content}\n**[Event Description]**: ${mDate.content}`);

                                    message.channel.send("And now a time! Type it in the format **HH:MM:SS** - if you don't want an exact second, just put `00`!").then(msg4 =>{
                                        const mTimeCollector = message.channel.createMessageCollector(mCollectorFilter, {time: 60000});
                    
                                        mTimeCollector.on("collect", async mTime =>{
                                            var eventRAWDateDestined = `${date} ${mTime.content}`;
                                            console.log(`[Chrono][Event Creation Wizard] Final Destined DateTime: ${eventRAWDateDestined}`);
                                            if(moment(eventRAWDateDestined).isValid()){
                                                mTimeCollector.stop();
                                                time = moment(mTime.content);
                                                mTime.delete();
                                                msg4.delete();
                                                msg.edit(`${msg.content}\n**[Event Description]**: ${mTime.content}`);

                                                //Make Event Identifier
                                                function makeid() {
                                                    var text = "";
                                                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXY0123456789";
                                                    
                                                    for (var i = 0; i < 5; i++)
                                                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                                                    
                                                    return text;
                                                }

                                                var timezone = registered[message.author.id].timezone;
                                                var currentCaseID = makeid();
                                                var eventDateDestined = moment(eventRAWDateDestined).tz(timezone);
                                                var eventDateCreated = moment();
                                                
                                                //Make event notification embed
                                                const embed = new Discord.RichEmbed()
                                                    .setAuthor(`New Event: ${eventTitle}`)
                                                    .addField("Description", eventDescription)
                                                    .addField("Created by", message.member.displayName)
                                                    .addField("Time Created", eventDateCreated)
                                                    .addField("Time & Date of Launch", eventDateDestined)
                                                    .setFooter(`Event ID for Lookup: ${currentCaseID}`);
                                                
                                                //Create instance of event from data
                                                await msg.edit("Here is your event embed!", {embed}).then(async embedMSG =>{
                                                    var newEvent = new common.event(message, currentCaseID, eventTitle, eventDescription, eventDateCreated, eventDateDestined, timezone, embedMSG.id);
                                                    await newEvent.save();
                                                    await newEvent.updateMembers(message.author.id);
                                                })
                                            }else{
                                                console.log(`[CHRONO] [Event Creation Wizard] An invalid time was entered. isInvalid returned ${moment(eventDateDestined).invalidAt()}. Process Halted.`);
                                                msg4.delete();
                                                mTime.delete();
                                                msg.edit("Unfortunately that was an invalid time. Please re-start the process.");
                                            } 
                                        });
                                    });
                                });
                            });

                        });
                    });

                });
            });
        }
    }
}
const Discord = require("discord.js");
const fetch = require('node-fetch');
const bot = new Discord.Client();
 
const config = require("./config.json");
 
const prefix  = config.prefix;
 
bot.on("ready", () => {
    console.log(`I am ready! I am in ${bot.guilds.size} guilds`);
 
    bot.user.setActivity();
});
 
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
 
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
 
    if(command === 'hello') {
        message.reply('Hello!');
    }
 
    if(command === 'ping') {
        const msg = await message.channel.send("Pinging...");
        msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    }
 
    if(command === 'kick') {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply('Sorry you do not have permission!');
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member) return message.reply("Please mention a valid user");
        if(!member.kickable) return message.channel.send("Sorry I cannot kick that person! Do they have a higher role?");
 
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
 
        await member.kick(reason)
            .catch(e => message.reply(`Sorry I couldn't kick them! Error: ${e}`));
        message.reply(`:white_check_mark: User kicked!`);
    }
 
    if(command === 'ban') {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply('Sorry you do not have permission!');
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member) return message.reply("Please mention a valid user");
        if(!member.bannable) return message.channel.send("Sorry I cannot ban that person! Do they have a higher role?");
 
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
 
        await member.ban(reason)
            .catch(e => message.reply(`Sorry I couldn't ban them! Error: ${e}`));
        message.reply(`:white_check_mark: User banned!`);
    }

    if(command === "meme") {
        let msg = await message.channel.send("Fetching a meme, please wait a second!");
        fetch('https://meme-api.herokuapp.com/gimme')
            .then(res => res.json())
            .then(json => {
                let embed = new Discord.RichEmbed()
                    .setTitle(json.title)
                    .setImage(json.url)
                    .setFooter(`Link: ${json.postLink} | Subreddit: ${json.subreddit}`)
                msg.edit(embed)
            });
    }
 
 
});
 
 
bot.login(config.token);
/**
 * @INFO
 * Loading all needed File Information Parameters
 */
const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = (client, member) => { 
  
   if (member.guild.id === '743705988321902643') {
        // Check if the member is the owner of another server
        // const guilds = await client.guilds.fetch(); // Fetch all guilds the bot is in
        const ownerGuild = client.guilds.cache.find(guild => guild.ownerId === member.user.id); // Find the guild owned by the member
        if (ownerGuild) {
          // Give the member the role in the bot support server
          const role = member.guild.roles.cache.get("1009104324137332756")
          if (role) {
  
            member.guild.channels.cache.get("1095555978440740924").send(`${member}, Thanks for joining **${member.guild.name}**. \nAs you are the owner of **${ownerGuild.name}** server, I have given you **VIP** role in the server. \n*Note: You can claim 1 Free Server Premium Code for your server by opening ticket in <#1113133562170974409>*`)
            
            setTimeout(function() {
                member.roles.add(role);
            }, 3000);
            
            
          } else {
            console.log(`Couldn't find the Owner role in ${member.guild.name}`);
          }
        } else {
          member.guild.channels.cache.get("1095555978440740924").send(`${member}, Thanks for joining **${member.guild.name}**.`)
        }
      }
  
}
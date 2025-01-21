/**
 * @INFO
 * Loading all needed File Information Parameters
 */
const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = (client, guild) => {
  const joinembed = new Discord.MessageEmbed()
    .setTitle(`📥 Guild Joined`)
    .setColor(`#0ff020`)
    .addFields({
      name: `Guild Name:`,
      value: `${guild.name}`,
    })
    .addFields({
      name: `Guild Members:`,
      value: ` ${guild.memberCount}`,
    })
    .addFields({
      name: `Guild Id:`,
      value: `${guild.id}`,
    })
    .addFields({
      name: `Guild Owner:`,
      value: `<@${guild.ownerId}> | Id: ${guild.ownerId}`,
    })
    .setFooter({
      text: `New Guild Size: ${client.guilds.cache.size} Servers |`,
    })
    .setTimestamp()
    .setThumbnail(guild.iconURL({ dynamic: true, format: `png` }));

  let botjoinmessagechannel = "1110555913175183400";

  const sendchannel = client.channels.cache.get(botjoinmessagechannel);
  if (!sendchannel) return;

  sendchannel.send({ embeds: [joinembed] });

  let defaultChannel = "";
  guild.channels.cache.forEach((channel) => {
    if (channel.type === "GUILD_TEXT" && defaultChannel == "") {
      if (
        channel
          .permissionsFor(guild.members.me)
          .has(Discord.Permissions.FLAGS.SEND_MESSAGES)
      ) {
        defaultChannel = channel;
      }
    }
  });
  if(defaultChannel == "" || defaultChannel == null) return;
  
    //PERMISSION CHECK-----------------------  
  if(!defaultChannel.permissionsFor(guild.members.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
    return;
  }

  if(!defaultChannel.permissionsFor(guild.members.me).has(Discord.Permissions.FLAGS.VIEW_CHANNEL)) {
    return;
    }

  if(!defaultChannel.permissionsFor(guild.members.me).has(Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY)) {
    return;
  }

  return defaultChannel.send(`**Thanks for inviting Order It to the server! Get a help menu using /help**
  
**__Some of the useful links__:**   
**Support Server:** https://discord.gg/ef7agGvEza
**TOS, Privacy Policy and Official Website:** https://orderitwebsite.netlify.app
**Documentation Website:** https://kristab.gitbook.io/orderit-docs/

**__News:__** 
*Check out Order It new food ordering roleplay feature by using /help command*


*Join our support server to receive 1 free Server Premium Code!*
`);
};

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
  if (!guild.available) return;

  const leaveembed = new Discord.MessageEmbed()
    .setTitle(`📤 Guild Leaved`)
    .setColor(`#e90b0b`)
    .addFields({
      name: `Guild Name:`,
      value: guild.name,
    })
    .addFields({
      name: `Guild Members:`,
      value: ` ${guild.memberCount}`,
    })
    .setFooter({
      text: `New Guild Size: ${client.guilds.cache.size} Servers |`,
    })
    .setTimestamp()
    .setThumbnail(guild.iconURL({ dynamic: true, format: `png` }));

  let botjoinleavemessagechannel = "1110555913175183400";

  const sendchannel = client.channels.cache.get(botjoinleavemessagechannel);
  if (!sendchannel) return;

  return sendchannel.send({ embeds: [leaveembed] });
};

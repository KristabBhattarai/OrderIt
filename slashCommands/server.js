const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const Discord = require("discord.js");
module.exports = {
  name: "server",
  description: "Sends Order It official server link.",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

  run: async (client, interaction) => {
    try {
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
      } = interaction;
      const { guild } = member;

     
      const Embed = new Discord.MessageEmbed()
        .setColor(0x236edf)
        .setTitle("Join our official server!")
        .setDescription(
          "1. Get support directly from the developers. \n2. Join different giveaways. \n3. Roleplay with people. \n4. Get a chance to apply for the chef. \n\n**Invite Link:** https://discord.gg/fYzWjSHf9v"
        )
        .setThumbnail(client.user.avatarURL())
        .setFooter({
          text: ee.footertext,
          iconURL: ee.footericon,
        });

      return interaction.reply({ embeds: [Embed] }).catch((err) => { });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

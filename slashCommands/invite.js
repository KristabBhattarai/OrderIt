const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const Discord = require("discord.js");
module.exports = {
  name: "invite",
  description: "Sends the invite link of Order It.",
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

      return interaction.reply({
        content: "Click the link to invite me! \nhttps://discord.com/api/oauth2/authorize?client_id=716257964767445043&permissions=274878024705&scope=applications.commands%20bot",
        ephemeral: true,
      }).catch((err) => { });
      
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

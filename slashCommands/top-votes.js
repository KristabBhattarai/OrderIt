const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const Discord = require("discord.js");
const { User, addVote, getVoteCount, getLeaderboard, displayLeaderboard } = require('../models/Votes');

module.exports = {
  name: "top-votes",
  description: "Sends the top 10 Users Vote leaderboard.",
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

      const result = await getLeaderboard();

          if (result.success) {
           
             const embed = await displayLeaderboard(result.leaderboard, client);
             
            return interaction.reply({embeds: [embed]}).catch((err) => {});
          
          } else {
            return interaction.reply('Something went wrong. [Error Code: 409]');
          }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

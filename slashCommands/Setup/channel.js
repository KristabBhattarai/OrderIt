const {
  MessageEmbed,
  MessageActionRow,
  Modal,
  TextInputComponent,
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const questionsave = require("../../rotues/questionsave.route");
const removeQuestion = require("../../rotues/removeQuestion.route");
const getQuestion = require("../../rotues/getQuestions.route");
const saveChannel = require("../../rotues/saveChannel.route");
const getChannel = require("../../rotues/getChannels.route");
const removeChannel = require("../../rotues/removeChannel.route");

module.exports = {
  name: "channel",
  description: "To setup channel for different module.",
  cooldown: 1,
  memberpermissions: ["MANAGE_GUILD"],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      StringChoices: {
        name: "module-name",
        description: "Select the module you want to modify.",
        required: true,
        choices: [
          ["Ordering", "ordering"],
          ["Buying", "buying"],
          ["Selling", "selling"],
          ["Hiring", "hiring"],
          ["Advertising", "advertising"],
        ],
      },
    },
    {
      StringChoices: {
        name: "modify-type",
        description: "Select the type of modify you want to do.",
        required: true,
        choices: [
          ["Set new channel", "set"],
          ["Reset old channel", "reset"],
        ],
      },
    },
    {
      Channel: {
        name: "channel",
        description: "Select the channel to set.",
        required: false,
      },
    },
  ],

  run: async (client, interaction) => {
    try {
      //things u can directly access in an interaction!
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

      const moduleName = options.getString("module-name");
      const modifyType = options.getString("modify-type");
      const moduleChannel = options.getChannel("channel");
      let serverid = String(guildId);

      if (modifyType == "set") {
        if (!moduleChannel)
          return interaction.reply("Please provide the channel too.");
        let channelID = String(moduleChannel.id);

        let channelCheck = await getChannel(serverid, moduleName);
        if (channelCheck)
          return interaction.reply(
            "This server already have this module channel. \n*Reset and Set new channel using* `/setup channel`"
          );

        saveChannel(serverid, moduleName, channelID);

        return interaction.reply(
          `**__Updated Module Channel__** \n**Module Name:** ${moduleName} \n**Modify Type:** Set \n**Channel:** ${moduleChannel}`
        );
      }

      if (modifyType == "reset") {
        let channelCheck = await getChannel(serverid, moduleName);
        if (!channelCheck)
          return interaction.reply(
            "This server dont have any channel for this module. \n*Set new channel using* `/setup channel`"
          );

        removeChannel(serverid, moduleName);

        return interaction.reply(`**__Updated Module Channel__** \n**Module Name:** ${moduleName} \n**Modify Type:** Reset`);
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

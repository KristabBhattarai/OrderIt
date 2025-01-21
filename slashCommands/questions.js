const {
  MessageEmbed,
  MessageActionRow,
  Modal,
  TextInputComponent,
} = require("discord.js");
const Discord = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const questionsave = require("../rotues/questionsave.route");
const removeQuestion = require("../rotues/removeQuestion.route");
const getQuestion = require("../rotues/getQuestions.route");

module.exports = {
  name: "questions",
  description: "Sends the embed with all module questions.",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      StringChoices: {
        name: "module-name",
        description: "Select the module you want to modify.",
        required: true,
        choices: [
          ["Ordering", "Ordering"],
          ["Buying", "Buying"],
          ["Selling", "Selling"],
          ["Hiring", "Hiring"],
          ["Advertising", "Advertising"],
        ],
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

      let serverid = String(guildId);

      let mName = options.getString("module-name");

      let dbname;
      if (mName == "Advertising") dbname = "advertising";
      if (mName == "Ordering") dbname = "ordering";
      if (mName == "Selling") dbname = "selling";
      if (mName == "Buying") dbname = "buying";
      if (mName == "Hiring") dbname = "hiring";

      if (dbname == null || dbname == undefined)
        return interaction.reply(
          `Error fetching database name of the module! [Error Code: 101]`
        );

      if (mName) {
        let question1 = await getQuestion(serverid, dbname, 1);

        let question2 = await getQuestion(serverid, dbname, 2);

        let question3 = await getQuestion(serverid, dbname, 3);

        let question4 = await getQuestion(serverid, dbname, 4);

        let question5 = await getQuestion(serverid, dbname, 5);

        let q1icon = "<:On:870351185083785267>";
        let q2icon = "<:On:870351185083785267>";
        let q3icon = "<:On:870351185083785267>";
        let q4icon = "<:On:870351185083785267>";
        let q5icon = "<:On:870351185083785267>";

        if (!question1) {
          q1icon = "<:Off:870351567264559125>";
        }

        if (!question2) {
          q2icon = "<:Off:870351567264559125>";
        }

        if (!question3) {
          q3icon = "<:Off:870351567264559125>";
        }
        if (!question4) {
          q4icon = "<:Off:870351567264559125>";
        }

        if (!question5) {
          q5icon = "<:Off:870351567264559125>";
        }

        if (!question1) question1 = "`Empty...`";

        if (!question2) question2 = "`Empty...`";

        if (!question3) question3 = "`Empty...`";

        if (!question4) question4 = "`Empty...`";

        if (!question5) question5 = "`Empty...`";

        const embed = new Discord.MessageEmbed()
          .setTitle(`__${mName} Form Questions__`)
          .setColor(`#2f3136`)
          .setDescription(
            `
          ${q1icon} 1. **${question1}**
          ${q2icon} 2. **${question2}**
          ${q3icon} 3. **${question3}**
          ${q4icon} 4. **${question4}**
          ${q5icon} 5. **${question5}**
          `
          )
          .setThumbnail(
            interaction.user.avatarURL({ dynamic: true, format: `png` })
          )
          .setTimestamp(interaction.createdTimestamp)
          .setFooter({ text: interaction.guild.name });

        return interaction.reply({ embeds: [embed] });
      }

      //need to put collector end function
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

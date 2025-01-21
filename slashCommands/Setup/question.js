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
const { getGuildPremiumStatus } = require('../../models/Guild');

module.exports = {
  name: "question",
  description: "To setup question for different module.",
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
          ["Set new question", "set"],
          ["Reset old question", "reset"],
        ],
      },
    },
    {
      StringChoices: {
        name: "question-number",
        description: "Select the question number to modify.",
        required: true,
        choices: [
          ["Question Number 1", "1"],
          ["Question Number 2", "2"],
          ["Question Number 3", "3"],
          ["Question Number 4", "4"],
          ["Question Number 5", "5"],
        ],
      },
    },
    {
      String: {
        name: "question",
        description: "Give the question to set.",
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
      const qNo = options.getString("question-number");
      const question = options.getString("question");

      const qno = parseInt(qNo);
      let serverid = String(guildId);

      let q1 = undefined;
      let q2 = undefined;
      let q3 = undefined;
      let q4 = undefined;
      let q5 = undefined;


      if (qno == "1") q1 = question;
      if (qno == "2") q2 = question;
      if (qno == "3") q3 = question;
      if (qno == "4") q4 = question;
      if (qno == "5") q5 = question;


      // questionsave(serverid, module, q1, q2, q3, q4, q5);

      if (modifyType == "reset") {
        const checkq = await getQuestion(serverid, moduleName, qno);
        if (!checkq)
          return interaction.reply(
            `This server does not have Question in Question Number ${qno}!`
          );

        removeQuestion(serverid, moduleName, qno);

        return interaction.reply(
          `**__Updated Module Setting!__** \n **Module Name:** ${moduleName} \n**Modify Type:** Reset \n**Question Number:** ${qno}`
        );
      }

      if (modifyType == "set") {
        // let mQuestion = args[3];
//         let premium = false;
//         let checkStatus = await getGuildPremiumStatus(guildId);
//         if(checkStatus.success) {
//             premium = true;
//         }

//         if(qno === 6 || qno === 7 || qno === 8 || qno === 9 || qno === 10) {
//           if(premium !== true ) {
//             return interaction.reply(`**Question number 6, 7, 8, 9, 10 is a premium feature!** \n **Requires:** *User Voting* \n *Obtain by voting Order It on top.gg for total of 15 times [ https://top.gg/bot/716257964767445043/vote ]*`)
//           }
//         }
          const checkq = await getQuestion(serverid, moduleName, qno);
                  if (checkq)
                    //!= undefined || checkq != ""
                    return interaction.reply(
                      `This server already have Question in Question Number ${qno}!`
                    );

        if (!question)
          return interaction.reply(`Please provide the question to set!`);
          if(question.length > 45) return interaction.reply("Question must be 45 or fewer in length.")

        questionsave(guildId, moduleName, q1, q2, q3, q4, q5);

        return interaction.reply(
          `**__Updated Module Setting!__** \n **Module Name:** ${moduleName} \n**Modify Type:** Set \n**Question Number:** ${qno} \n**Question:** ${question}`
        );
      }

      return interaction.reply("Given module's modify type is incorrect!");
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

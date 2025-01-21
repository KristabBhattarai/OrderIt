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
const saveShopOwner = require("../../rotues/saveShopOwner.route");
const removeShopOwner = require("../../rotues/removeShopOwner.route");
const getShopOwner = require("../../rotues/getShopsOwner.route");
const getShopInfo = require("../../rotues/getShopsInfo.route");
const removeShopInfo = require("../../rotues/removeShopInfo.route");
const saveShopInfo = require("../../rotues/saveShopInfo.route");

module.exports = {
  name: "shop-owner",
  description: "To modify owner for the shop.",
  cooldown: 1,
  memberpermissions: ["MANAGE_GUILD"],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      StringChoices: {
        name: "shop-number",
        description: "Select the shop number to modify.",
        required: true,
        choices: [
          ["shop-number-1", "1"],
          ["shop-number-2", "2"],
          ["shop-number-3", "3"],
          ["shop-number-4", "4"],
          ["shop-number-5", "5"],
          ["shop-number-6", "6"],
          ["shop-number-7", "7"],
          ["shop-number-8", "8"],
          ["shop-number-9", "9"],
          ["shop-number-10", "10"],
        ],
      },
    },
    {
      StringChoices: {
        name: "modify-type",
        description: "Select the type of modify you want to do.",
        required: true,
        choices: [
          ["Set new owner", "set"],
          ["Reset old owner", "reset"],
        ],
      },
    },
    {
      User: {
        name: "owner",
        description: "Select the user to set as owner.",
        required: false,
      },
    },
  ],

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

      const shopNo = options.getString("shop-number");
      const modifyType = options.getString("modify-type");
      let User = options.getUser("owner");
      let serverid = String(guildId);

      if (modifyType == "reset") {
        const check = await getShopOwner(serverid, shopNo);
        if (!check)
          return interaction.reply(`This shop dont have any owner yet!`);

        removeShopOwner(serverid, shopNo);
        removeShopInfo(serverid, shopNo);

        return interaction.reply(
          `**__Updated Shop Owner__** \n**Modify Type:** Reset \n**Shop Number:** ${shopNo} `
        );
      }

      if (modifyType == "set") {
        const check = await getShopOwner(serverid, shopNo);
        if (check) return interaction.reply(`This shop already have a owner!`);

        let ownerid;
        if (User) {
          ownerid = String(User.id);
        }

        if (!User)
          return interaction.reply(
            `Please provide the user to set as the owner of the shop!!`
          );

        const checku = interaction.guild.members.cache.get(ownerid);
        if (!checku)
          return interaction.reply(`Given user cant be found in this server!`);

        saveShopOwner(serverid, ownerid, shopNo);

        return interaction.reply(
          `**__Updated Shop Owner__** \n**Modify Type:** Set \n**Shop Number:** ${shopNo} \n**Owner:** ${checku.user.tag}`
        );
      }

      return interaction.reply("Given modify type is incorrect!");
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

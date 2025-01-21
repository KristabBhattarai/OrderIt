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
const saveShopInfo = require("../../rotues/saveShopInfo.route");
const removeShopInfo = require("../../rotues/removeShopInfo.route");
const getShopInfo = require("../../rotues/getShopsInfo.route");

module.exports = {
  name: "shop-info",
  description: "To modify the info of the certain shop.",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      StringChoices: {
        name: "shop-number",
        description: "Select the shop number to modify. [Must be Shop Owner]",
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
          ["Set new info", "set"],
          ["Reset old info", "reset"],
        ],
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
      let serverid = String(guildId);

      if (modifyType == "set") {
        const check = await getShopOwner(serverid, shopNo);
        if (check !== interaction.user.id)
          return interaction.reply(
            `You must be the shop owner to Set the shop info!`
          );

        const cInfo = await getShopInfo(serverid, shopNo);
        if (cInfo) {
          return interaction.reply({
            content: "You already have the shop info! \n*Use `/setup shop-info` and select `reset_old_info` to reset the old info and again use same command and select `set_new_info` to set new info for your shop.*"
          })
        }

        const modal = new Modal()
          .setCustomId("dataForm")
          .setTitle("Configuring Shop Info");

        const question1Input = new TextInputComponent()
          .setCustomId("question1Input")
          .setLabel(`Please provide the Shop Info below:`)
          .setRequired(true)
          .setStyle("PARAGRAPH");

        const firstActionRow = new MessageActionRow().addComponents(
          question1Input
        );
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);

        const filter = (interaction) => {
          return interaction.customId === "dataForm";
        };
        interaction
          .awaitModalSubmit({ filter, time: 300000 })
          .then((interaction) => {
            let Data = String(
              interaction.fields.getTextInputValue("question1Input")
            );

            saveShopInfo(serverid, shopNo, Data);
            return interaction.reply(
              `**__Updated Shop Info__** \n**Modify Type:** Set \n**Shop Number:** ${shopNo}`
            );
          })

          .catch((err) => { });
      }

      if (modifyType == "reset") {
        const check = await getShopOwner(serverid, shopNo);
        if (check !== interaction.user.id)
          return interaction.reply(
            `You must be the shop owner to Reset the shop info!`
          );

        const cInfo = await getShopInfo(serverid, shopNo);
        if (!cInfo) {
          return interaction.reply({
            content: "You dont have shop info to reset! \n*Use `/setup shop-info` to set new info for your shop.*"
          })
        }

        removeShopInfo(serverid, shopNo);
        return interaction.reply(
          `**__Updated Shop Info__** \n**Modify Type:** Reset \n**Shop Number:** ${shopNo}`
        );
      }

    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

const {
  MessageEmbed,
  MessageActionRow,
  Modal,
  TextInputComponent,
  MessageSelectMenu,
} = require("discord.js");

const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const getQuestion = require("../rotues/getQuestions.route");
const getChannel = require("../rotues/getChannels.route");

module.exports = {
  name: "module-list",
  description:
    "Sends a dropdown menu from which user can directly access modules which are fully setup.",
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

      let serverid = String(guildId);

      await interaction.deferReply()


      let menu = new MessageSelectMenu()
        .setCustomId("modulelist-menu")
        .setPlaceholder("Select the module you want to access.")
        .setMinValues(0)
        .setMaxValues(1)
;
      let ordering = false;
      let buying = false;
      let selling = false;
      let hiring = false;
      let advertising = false;

      let ocheckChannel = await getChannel(serverid, "ordering");
      if (ocheckChannel) {
        let finalChannel = interaction.guild.channels.cache.get(ocheckChannel);
        if (finalChannel) {
          let moduleName = "ordering";
          let q1 = await getQuestion(serverid, moduleName, 1);
          let q2 = await getQuestion(serverid, moduleName, 2);
          let q3 = await getQuestion(serverid, moduleName, 3);
          let q4 = await getQuestion(serverid, moduleName, 4);
          let q5 = await getQuestion(serverid, moduleName, 5);

          if (q1 || q2 || q3 || q4 || q5) {
            menu.addOptions([
              {
                label: "Ordering",
                description: "Sends a Ordering Form. [Expires in 5min]",
                value: "ordering",
                emoji: "🛒",
              },
            ]);
            ordering = true;
          }
        }
      }

      let bcheckChannel = await getChannel(serverid, "buying");
      if (bcheckChannel) {
        let finalChannel = interaction.guild.channels.cache.get(bcheckChannel);
        if (finalChannel) {
          let moduleName = "buying";
          let q1 = await getQuestion(serverid, moduleName, 1);
          let q2 = await getQuestion(serverid, moduleName, 2);
          let q3 = await getQuestion(serverid, moduleName, 3);
          let q4 = await getQuestion(serverid, moduleName, 4);
          let q5 = await getQuestion(serverid, moduleName, 5);

          if (q1 || q2 || q3 || q4 || q5) {
            menu.addOptions([
              {
                label: "Buying",
                description: "Sends a Buying Form. [Expires in 5min]",
                value: "buying",
                emoji: "🛍",
              },
            ]);
            buying = true;
          }
        }
      }

      let scheckChannel = await getChannel(serverid, "selling");
      if (scheckChannel) {
        let finalChannel = interaction.guild.channels.cache.get(scheckChannel);
        if (finalChannel) {
          let moduleName = "selling";
          let q1 = await getQuestion(serverid, moduleName, 1);
          let q2 = await getQuestion(serverid, moduleName, 2);
          let q3 = await getQuestion(serverid, moduleName, 3);
          let q4 = await getQuestion(serverid, moduleName, 4);
          let q5 = await getQuestion(serverid, moduleName, 5);

          if (q1 || q2 || q3 || q4 || q5) {
            menu.addOptions([
              {
                label: "Selling",
                description: "Sends a Selling Form. [Expires in 5min]",
                value: "selling",
                emoji: "📃",
              },
            ]);
            selling = true;
          }
        }
      }

      let hcheckChannel = await getChannel(serverid, "hiring");
      if (hcheckChannel) {
        let finalChannel = interaction.guild.channels.cache.get(hcheckChannel);
        if (finalChannel) {
          let moduleName = "hiring";
          let q1 = await getQuestion(serverid, moduleName, 1);
          let q2 = await getQuestion(serverid, moduleName, 2);
          let q3 = await getQuestion(serverid, moduleName, 3);
          let q4 = await getQuestion(serverid, moduleName, 4);
          let q5 = await getQuestion(serverid, moduleName, 5);

          if (q1 || q2 || q3 || q4 || q5) {
            menu.addOptions([
              {
                label: "Hiring",
                description: "Sends a Hiring Form. [Expires in 5min]",
                value: "hiring",
                emoji: "👨‍💼",
              },
            ]);
            hiring = true;
          }
        }
      }

      let acheckChannel = await getChannel(serverid, "advertising");
      if (acheckChannel) {
        let finalChannel = interaction.guild.channels.cache.get(acheckChannel);
        if (finalChannel) {
          let moduleName = "advertising";
          let q1 = await getQuestion(serverid, moduleName, 1);
          let q2 = await getQuestion(serverid, moduleName, 2);
          let q3 = await getQuestion(serverid, moduleName, 3);
          let q4 = await getQuestion(serverid, moduleName, 4);
          let q5 = await getQuestion(serverid, moduleName, 5);

          if (q1 || q2 || q3 || q4 || q5) {
            menu.addOptions([
              {
                label: "Advertising",
                description: "Sends a Advertising Form. [Expires in 5min]",
                value: "advertising",
                emoji: "📰",
              },
            ]);
            advertising = true;
          }
        }
      }

      if (
        ordering == true ||
        buying == true ||
        selling == true ||
        hiring == true ||
        advertising == true
      ) {
        const row = new MessageActionRow().addComponents(menu);

        return interaction.editReply({ components: [row] });
      } else {
        return interaction.editReply({
          content:
            "**This server don't have any fully setup module!** \n*Fully setup any module by setting channel using `/setup channel` and by setting questions using `/setup question`*",
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

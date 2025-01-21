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
const getChannel = require("../rotues/getChannels.route");

module.exports = {
  name: "channels",
  description: "Sends the embed with all module channels.",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],

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

      //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
      //const StringOption = options.getString("what_ping"); //same as in StringChoices
      //let UserOption = options.getUser("OPTIONNAME");
      //let ChannelOption = options.getChannel("OPTIONNAME");
      //let RoleOption = options.getRole("OPTIONNAME");

      let serverid = String(guildId);

      let orderingCh = await getChannel(serverid, "ordering");
      let buyingCh = await getChannel(serverid, "buying");
      let sellingCh = await getChannel(serverid, "selling");
      let hiringCh = await getChannel(serverid, "hiring");
      let advertisingCh = await getChannel(serverid, "advertising");

      let ch1 = "`Not set yet...`";
      let ch2 = "`Not set yet...`";
      let ch3 = "`Not set yet...`";
      let ch4 = "`Not set yet...`";
      let ch5 = "`Not set yet...`";

      if (orderingCh) {
        ch1 = guild.channels.cache.get(orderingCh);
        if (ch1 == undefined || null) {
          ch1 = "`Deleted Channel`";
        }
      }

      if (buyingCh) {
        ch2 = guild.channels.cache.get(buyingCh);
        if (ch2 == undefined || null) {
          ch2 = "`Deleted Channel`";
        }
      }

      if (sellingCh) {
        ch3 = guild.channels.cache.get(sellingCh);
        if (ch3 == undefined || null) {
          ch3 = "`Deleted Channel`";
        }
      }

      if (hiringCh) {
        ch4 = guild.channels.cache.get(hiringCh);
        if (ch4 == undefined || null) {
          ch4 = "`Deleted Channel`";
        }
      }

      if (advertisingCh) {
        ch5 = guild.channels.cache.get(advertisingCh);
        if (ch5 == undefined || null) {
          ch5 = "`Deleted Channel`";
        }
      }

      const embed = new Discord.MessageEmbed()
        .setTitle(`__Modules Channel List__`)
        .setColor(`#2f3136`)
        .setDescription(
          `
           **Ordering Module:** ${ch1}
           **Buying Module:** ${ch2}
           **Selling Module:** ${ch3}
           **Hiring Module:** ${ch4}
           **Advertising Module:** ${ch5}
            `
        )
        .setThumbnail(
          interaction.user.avatarURL({ dynamic: true, format: `png` })
        )
        .setTimestamp(interaction.createdTimestamp)
        .setFooter({ text: interaction.guild.name });

      return interaction.reply({ embeds: [embed] });

      //need to put collector end function
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

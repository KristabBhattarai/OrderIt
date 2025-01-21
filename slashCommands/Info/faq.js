const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "faq",
  description: "Provides you will frequently asked question with its answer.",
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

      const embed = new MessageEmbed()
        .setTitle("FAQ with Answer")
        .setDescription(
          "*If you have any other question that is not listed here then please feel free to join our support server by using `/support`*"
        )
        .addFields({
          name: "Why other prefix/slash commands are removed?",
          value:
            "> Order It got big revamp so we want to make Order It more clean and user friendly thats why its temporary gone but as time goes on those commands will be back with updates.",
        })
        .addFields({
          name: "Why when using modules it says 'Thanks for filling out the ... form' but never sends the form in module channel?",
          value:
            "> Its mainly caused when bot dont have permission to send message in module channel. So make sure bot that required permission in module channels.",
        })
        .addFields({
          name: "Why all my and server data like module channels, questions, shop owner, info are deleted?",
          value:
            "> As we said Order It got fully revamped so in that process we changed the database of bot thats why your data are deleted. Sorry if you faced any problem because of it.",
        })
        .addFields({
          name: "How can I suggest, give feedback or report any glitches or bugs in Order It from my own server?",
          value:
            "> We respect our users feedbacks or any reports so we have made `/contact` commands where you can write your message which will directly delivered to our developers.",
        })
        .setColor(ee.color)
        .setFooter({
          text: ee.footertext,
          iconURL: ee.footericon,
        });

      return interaction.reply({ embeds: [embed] }).catch((err) => {});
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

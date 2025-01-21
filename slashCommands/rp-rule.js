const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const Discord = require("discord.js");
module.exports = {
  name: "rp-rule",
  description: "Provides the roleplay rules which need to be follow by users.",
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

     
      const rulesEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("Roleplay Rules")
        .setDescription(
          "> 1. All orders must be made in a respectful manner. Troll orders are accepted but should not break other rules.\n> 2. We maintain a family-friendly environment and do not serve anything that is considered NSFW\n> 3. To maintain a positive atmosphere, we do not serve anything that could lead to disturbing images, such as pet animal-related items. \n> 4. We strictly adhere to ethical guidelines and do not serve any dishes that contain anything human-related. \n\nThese rules are in place to maintain a fun and respectful environment for all participants. Failure to adhere to these guidelines may result in warnings or banned from the roleplay features. Enjoy your roleplay food ordering experience!"
        )
        .setThumbnail(client.user.avatarURL())
        .setFooter({
          text: ee.footertext,
          iconURL: ee.footericon,
        });

      return interaction.reply({ embeds: [rulesEmbed] }).catch((err) => { });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

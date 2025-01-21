const {
  MessageEmbed,
  MessageActionRow,
  Modal,
  TextInputComponent,
} = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");

const getBannedInfo = require("../rotues/getBannedInfo.route")

module.exports = {
  name: "contact",
  description:
    "Please feel free to send your suggestion, report & feedback to us.",
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
      
      let bannedStatus = await getBannedInfo(interaction.user.id);
        if(bannedStatus !== null) {
          if(bannedStatus.banned) {
            let bannedReason = bannedStatus.bannedReason;
            return interaction.reply(`**❌ | You have been banned from Order It!** \n**Reason:** ${bannedReason}`)
          }
        }

      const modal = new Modal().setCustomId("dataForm").setTitle("Contact Us");

      const question1Input = new TextInputComponent()
        .setCustomId("question1Input")
        .setLabel(`Please Provide Your Message Below:`)
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
          let Data1 = interaction.fields.getTextInputValue("question1Input");

          let Channel = client.channels.cache.get("1010174144484225056");
          if (!Channel)
            return interaction.reply(
              "Error while searching for support server. \nPlease try again.."
            );

          const embed = new MessageEmbed()
            .setTitle("__Contact Message__")
            .setDescription(`**Information:** \n> ${Data1}`)
          embed.addFields({
            name: "Sender:",
            value: `${interaction.user} | ${interaction.user.id}`
          })
          embed.addFields({
            name: "Guild:",
            value: `${guild.name} | ${guild.id}`
          })
            .setFooter({
              text: "Thanks for contacting us!"
            })

          Channel.send({ embeds: [embed] });

          return interaction.reply(`Thanks for contacting us.`);
        })

        .catch((err) => { });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

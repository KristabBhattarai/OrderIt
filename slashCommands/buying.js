const {
  MessageEmbed,
  MessageActionRow,
  Modal,
  TextInputComponent,
  MessageButton,
} = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const questionsave = require("../rotues/questionsave.route");
const removeQuestion = require("../rotues/removeQuestion.route");
const getQuestion = require("../rotues/getQuestions.route");
const getChannel = require("../rotues/getChannels.route");

module.exports = {
  name: "buying",
  description: "Sends the Buying Form. [Expires in 5 minutes]",
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
      let moduleName = "buying";
      let checkChannel = await getChannel(serverid, moduleName);
      if (!checkChannel) {
        return interaction.reply(
          "**This server haven't setup a channel for this module!** \n*Setup Channel using* `/setup channel`"
        );
      }

      let finalChannel = interaction.guild.channels.cache.get(checkChannel);
      if (!finalChannel)
        return interaction.reply(
          "**Can't find the setuped channel of this module!** \n*Reset old channel & Setup new channel using *`/setup channel`"
        );

      let q1 = await getQuestion(serverid, moduleName, 1);
      let q2 = await getQuestion(serverid, moduleName, 2);
      let q3 = await getQuestion(serverid, moduleName, 3);
      let q4 = await getQuestion(serverid, moduleName, 4);
      let q5 = await getQuestion(serverid, moduleName, 5);

      if (!q1 && !q2 && !q3 && !q4 && !q5)
        return interaction.reply(
          "**This server dont have any question for this module!** \n*Setup Question by* `/setup question`"
        );
      
      if(q1 && q1.length > 45) 
          return interaction.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q2 && q2.length > 45) 
          return interaction.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q3 && q3.length > 45) 
          return interaction.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q4 && q4.length > 45) 
          return interaction.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q5 && q5.length > 45) 
          return interaction.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );

      const customId = `buyingForm:${interaction.id}`;
      
      const modal = new Modal()
        .setTitle("Buying Form");
      modal.setCustomId(customId);

      if (q1) {
        const question1Input = new TextInputComponent()
          .setCustomId("question1Input")
          .setLabel(`${q1}`)
          .setRequired(true)
          .setStyle("PARAGRAPH");

        const firstActionRow = new MessageActionRow().addComponents(
          question1Input
        );
        modal.addComponents(firstActionRow);
      }

      if (q2) {
        const question2Input = new TextInputComponent()
          .setCustomId("question2Input")
          .setLabel(`${q2}`)
          .setRequired(true)
          .setStyle("PARAGRAPH");

        const secondActionRow = new MessageActionRow().addComponents(
          question2Input
        );
        modal.addComponents(secondActionRow);
      }

      if (q3) {
        const question3Input = new TextInputComponent()
          .setCustomId("question3Input")
          .setLabel(`${q3}`)
          .setRequired(true)
          .setStyle("PARAGRAPH");

        const thirdActionRow = new MessageActionRow().addComponents(
          question3Input
        );
        modal.addComponents(thirdActionRow);
      }

      if (q4) {
        const question4Input = new TextInputComponent()
          .setCustomId("question4Input")
          .setLabel(`${q4}`)
          .setRequired(true)
          .setStyle("PARAGRAPH");

        const fourthActionRow = new MessageActionRow().addComponents(
          question4Input
        );
        modal.addComponents(fourthActionRow);
      }

      if (q5) {
        const question5Input = new TextInputComponent()
          .setCustomId("question5Input")
          .setLabel(`${q5}`)
          .setRequired(true)
          .setStyle("PARAGRAPH");

        const fifthActionRow = new MessageActionRow().addComponents(
          question5Input
        );
        modal.addComponents(fifthActionRow);
      }
      

      await interaction.showModal(modal);

      const filter = (interaction) => {
        return interaction.customId === customId;
      };
      interaction
        .awaitModalSubmit({ filter, time: 300000 })
        .then((interaction) => {
          // console.log(`${interaction.customId} was submitted!`);
          const embed = new MessageEmbed()
            .setTitle(`__Buying Form__`)
            .setColor(`#2f3136`)
            .setThumbnail(
              interaction.user.avatarURL({ dynamic: true, format: `png` })
            )
            .setTimestamp(interaction.createdTimestamp)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setDescription(
              `\n\n**Author:** ${interaction.member || interaction.user} (${interaction.user.tag
              })`
            );

          if (q1) {
            embed.addFields({
              name: `${q1}`,
              value: `**❯** ${interaction.fields.getTextInputValue(
                "question1Input"
              )}`,
            });
          }
          if (q2) {
            embed.addFields({
              name: `${q2}`,
              value: `**❯** ${interaction.fields.getTextInputValue(
                "question2Input"
              )}`,
            });
          }
          if (q3) {
            embed.addFields({
              name: `${q3}`,
              value: `**❯** ${interaction.fields.getTextInputValue(
                "question3Input"
              )}`,
            });
          }
          if (q4) {
            embed.addFields({
              name: `${q4}`,
              value: `**❯** ${interaction.fields.getTextInputValue(
                "question4Input"
              )}`,
            });
          }
          if (q5) {
            embed.addFields({
              name: `${q5}`,
              value: `**❯** ${interaction.fields.getTextInputValue(
                "question5Input"
              )}`,
            });
          }
       

          let buttonAccepted = new MessageButton()
            .setCustomId("accept")
            .setStyle("SUCCESS")
            .setLabel("Accept")
            .setEmoji("1013317508540923944");

          let buttonDeclined = new MessageButton()
            .setCustomId("decline")
            .setStyle("DANGER")
            .setLabel("Decline")
            .setEmoji("1013317698312216656");

          let buttonRow = new MessageActionRow().addComponents(
            buttonAccepted,
            buttonDeclined
          );

          finalChannel
            .send({
              content: "**Status:** `PENDING`",
              embeds: [embed],
              components: [buttonRow],
            })
            .catch((err) => { });
          return interaction
            .reply({
              content: `Thanks for filling out the ${moduleName} form.`,
              ephemeral: true
            })
            .catch(console.error);
        })

        .catch((err) => { });

      //need to put collector end function
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

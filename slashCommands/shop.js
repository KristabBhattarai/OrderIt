const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
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
const saveShopOwner = require("../rotues/saveShopOwner.route");
const removeShopOwner = require("../rotues/removeShopOwner.route");
const getShopOwner = require("../rotues/getShopsOwner.route");
const saveShopInfo = require("../rotues/saveShopInfo.route");
const removeShopInfo = require("../rotues/removeShopInfo.route");
const getShopInfo = require("../rotues/getShopsInfo.route");
const { getGuildPremiumStatus } = require('../models/Guild');
const { getVoteCount } = require('../models/Votes');

module.exports = {
  name: "shop",
  description: "Displays all shops of the server.",
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

      let serverid = String(guildId);
      // let shopNo = 5;

      // let data = await getShopInfo(serverid, shopNo);

      // interaction.reply(`${data}`);

      await interaction.deferReply();
      
      function extractLinkFromString(inputString) {
        const regex = /\{imageLink:\s*"([^"]+)"\}/; // Regular expression to match {imageLink: "image-link-here"}
      
        const match = inputString.match(regex); // Check if the inputString contains a match
      
        if (match) {
          const extractedLink = match[1]; // Extract the link from the match
          const link = isValidDiscordLink(extractedLink) ? extractedLink : 'https://nonpremiumuser.com';
          const remainingString = inputString.replace(regex, ""); // Remove the matched portion from the inputString
      
          return {
            Url: link,
            Msg: remainingString
          };
        }
      
        // If no match is found, return the inputString as is
        return {
          Url: "https://nonepremiumuser.com",
          Msg: inputString
        };
      }
      
      function isValidDiscordLink(link) {
        // Regular expression patterns to validate Discord image links
        const attachmentRegex = /^https?:\/\/(?:cdn\.)?(?:media\.)?(?:discordapp|discord)\.com\/attachments\/\d{10,20}\/\d{10,20}\/[\w-]+\.(?:jpe?g|png|gif|bmp)$/i;
        //const avatarRegex = /^https?:\/\/(?:cdn\.)?(?:media\.)?(?:discordapp|discord)\.com\/avatars\/\d{18}\/\w{32}\.(?:jpe?g|png|gif|bmp)$/;
        const avatarRegex = /^https?:\/\/(?:cdn\.)?(?:media\.)?(?:discordapp|discord)\.com\/avatars\/\d{10,20}\/\w{32}\.(?:jpe?g|png|gif|bmp)$/i;
      
        return attachmentRegex.test(link) || avatarRegex.test(link);
      }

      let shop1 = await getShopInfo(serverid, "1");
      let shop2 = await getShopInfo(serverid, "2");
      let shop3 = await getShopInfo(serverid, "3");
      let shop4 = await getShopInfo(serverid, "4");
      let shop5 = await getShopInfo(serverid, "5");
      let shop6 = await getShopInfo(serverid, "6");
      let shop7 = await getShopInfo(serverid, "7");
      let shop8 = await getShopInfo(serverid, "8");
      let shop9 = await getShopInfo(serverid, "9");
      let shop10 = await getShopInfo(serverid, "10");

      let shop1owner = await getShopOwner(serverid, "1");
      let shop2owner = await getShopOwner(serverid, "2");
      let shop3owner = await getShopOwner(serverid, "3");
      let shop4owner = await getShopOwner(serverid, "4");
      let shop5owner = await getShopOwner(serverid, "5");
      let shop6owner = await getShopOwner(serverid, "6");
      let shop7owner = await getShopOwner(serverid, "7");
      let shop8owner = await getShopOwner(serverid, "8");
      let shop9owner = await getShopOwner(serverid, "9");
      let shop10owner = await getShopOwner(serverid, "10");

      //-----------------------------BUTTON ------------------------------

      let ownerid1 = await getShopOwner(serverid, "1");
      let ownername1 = "`Not owned yet!`";

      if (ownerid1) ownername1 = await client.users.fetch(ownerid1);

      let button1 = new MessageButton()
        .setCustomId("shop1")
        .setEmoji("1️⃣")
        .setStyle("PRIMARY");

      if (!ownerid1) button1.setStyle("DANGER");
      if (!ownerid1) button1.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid2 = await getShopOwner(serverid, "2");
      let ownername2 = "`Not owned yet!`";

      if (ownerid2) ownername2 = await client.users.fetch(ownerid2);

      let button2 = new MessageButton()
        .setCustomId("shop2")
        .setEmoji("2️⃣")
        .setStyle("PRIMARY");

      if (!ownerid2) button2.setStyle("DANGER");
      if (!ownerid2) button2.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid3 = await getShopOwner(serverid, "3");
      let ownername3 = "`Not owned yet!`";

      if (ownerid3) ownername3 = await client.users.fetch(ownerid3);

      let button3 = new MessageButton()
        .setCustomId("shop3")
        .setEmoji("3️⃣")
        .setStyle("PRIMARY");

      if (!ownerid3) button3.setStyle("DANGER");
      if (!ownerid3) button3.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid4 = await getShopOwner(serverid, "4");
      let ownername4 = "`Not owned yet!`";

      if (ownerid4) ownername4 = await client.users.fetch(ownerid4);

      let button4 = new MessageButton()
        .setCustomId("shop4")
        .setEmoji("4️⃣")
        .setStyle("PRIMARY");

      if (!ownerid4) button4.setStyle("DANGER");
      if (!ownerid4) button4.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid5 = await getShopOwner(serverid, "5");
      let ownername5 = "`Not owned yet!`";

      if (ownerid5) ownername5 = await client.users.fetch(ownerid5);

      let button5 = new MessageButton()
        .setCustomId("shop5")
        .setEmoji("5️⃣")
        .setStyle("PRIMARY");

      if (!ownerid5) button5.setStyle("DANGER");
      if (!ownerid5) button5.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid6 = await getShopOwner(serverid, "6");
      let ownername6 = "`Not owned yet!`";

      if (ownerid6) ownername6 = await client.users.fetch(ownerid6);

      let button6 = new MessageButton()
        .setCustomId("shop6")
        .setEmoji("6️⃣")
        .setStyle("PRIMARY");

      if (!ownerid6) button6.setStyle("DANGER");
      if (!ownerid6) button6.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid7 = await getShopOwner(serverid, "7");
      let ownername7 = "`Not owned yet!`";

      if (ownerid7) ownername7 = await client.users.fetch(ownerid7);

      let button7 = new MessageButton()
        .setCustomId("shop7")
        .setEmoji("7️⃣")
        .setStyle("PRIMARY");

      if (!ownerid7) button7.setStyle("DANGER");
      if (!ownerid7) button7.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid8 = await getShopOwner(serverid, "8");
      let ownername8 = "`Not owned yet!`";

      if (ownerid8) ownername8 = await client.users.fetch(ownerid8);

      let button8 = new MessageButton()
        .setCustomId("shop8")
        .setEmoji("8️⃣")
        .setStyle("PRIMARY");

      if (!ownerid8) button8.setStyle("DANGER");
      if (!ownerid8) button8.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid9 = await getShopOwner(serverid, "9");
      let ownername9 = "`Not owned yet!`";

      if (ownerid9) ownername9 = await client.users.fetch(ownerid9);

      let button9 = new MessageButton()
        .setCustomId("shop9")
        .setEmoji("9️⃣")
        .setStyle("PRIMARY");

      if (!ownerid9) button9.setStyle("DANGER");
      if (!ownerid9) button9.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let ownerid10 = await getShopOwner(serverid, "10");
      let ownername10 = "`Not owned yet!`";

      if (ownerid10) ownername10 = await client.users.fetch(ownerid10);

      let button10 = new MessageButton()
        .setCustomId("shop10")
        .setEmoji("🔟")
        .setStyle("PRIMARY");

      if (!ownerid10) button10.setStyle("DANGER");
      if (!ownerid10) button10.setDisabled();

      //-----------------------------BUTTON ------------------------------

      let buttonHome = new MessageButton()
        .setCustomId("home")
        .setEmoji("🏠")
        .setStyle("PRIMARY");

      let buttonBuy = new MessageButton()
        .setCustomId("buyBtnShop")
        .setEmoji("🛒")
        .setLabel("Buy")
        .setStyle("SUCCESS");
      
      let buttonSell = new MessageButton()
        .setCustomId("sellBtnShop")
        .setEmoji("⚖")
        .setLabel("Sell")
        .setStyle("SUCCESS");

      //-----------------------------BUTTON ------------------------------

      let Availableshop = new Discord.MessageEmbed()
        .setAuthor({
          name: `All Shops of ${interaction.guild.name}`,
          iconURL: interaction.guild.iconURL({ dynamic: true, format: `png` }),
        })
        .setDescription(
          `
  1️⃣ : ${ownername1}
  2️⃣ : ${ownername2}
  3️⃣ : ${ownername3}
  4️⃣ : ${ownername4}
  5️⃣ : ${ownername5}
  6️⃣ : ${ownername6}
  7️⃣ : ${ownername7}
  8️⃣ : ${ownername8}
  9️⃣ : ${ownername9}
  🔟 : ${ownername10}
  `
        )
        .setColor("GREEN");

      let row = new MessageActionRow().addComponents(
        button1,
        button2,
        button3,
        button4,
        button5
      );

      let row1 = new MessageActionRow().addComponents(
        button6,
        button7,
        button8,
        button9,
        button10
      );

      let row2 = new MessageActionRow().addComponents(buttonHome, buttonBuy, buttonSell);

      const Sendbutton = await interaction.editReply({
        embeds: [Availableshop],
        components: [row, row1],
      });

      const collector = Sendbutton.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 500000,
      });

      let ButtonClicked = "0";

      collector.on("collect", async (b) => {
        if (b.user.id === interaction.user.id) {
          if (b.customId == "shop1") {
            await b.deferUpdate();

            let shopinfo = shop1;
            if (!shop1) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid1);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
              .setImage(image)
              .setFooter({
                text: ownername1.username + "'s shop",
                iconURL: ownername1.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop1) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "1";
          }

          if (b.customId == "shop2") {
            await b.deferUpdate();

            let shopinfo = shop2;
            if (!shop2) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid2);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
              .setImage(image)
              .setFooter({
                text: ownername2.username + "'s shop",
                iconURL: ownername2.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop2) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "2";
          }

          if (b.customId == "shop3") {
            await b.deferUpdate();

            let shopinfo = shop3;
            if (!shop3) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid3);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername3.username + "'s shop",
                iconURL: ownername3.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop3) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "3";
          }

          if (b.customId == "shop4") {
            await b.deferUpdate();

            let shopinfo = shop4;
            if (!shop4) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid4);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername4.username + "'s shop",
                iconURL: ownername4.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop4) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "4";
          }

          if (b.customId == "shop5") {
            await b.deferUpdate();

            let shopinfo = shop5;
            if (!shop5) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid5);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername5.username + "'s shop",
                iconURL: ownername5.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop5) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "5";
          }

          if (b.customId == "shop6") {
            await b.deferUpdate();

            let shopinfo = shop6;
            if (!shop6) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid6);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername6.username + "'s shop",
                iconURL: ownername6.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop6) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "6";
          }

          if (b.customId == "shop7") {
            await b.deferUpdate();

            let shopinfo = shop7;
            if (!shop7) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid7);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername7.username + "'s shop",
                iconURL: ownername7.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop7) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "7";
          }

          if (b.customId == "shop8") {
            await b.deferUpdate();

            let shopinfo = shop8;
            if (!shop8) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid8);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername8.username + "'s shop",
                iconURL: ownername8.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop8) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "8";
          }

          if (b.customId == "shop9") {
            await b.deferUpdate();

            let shopinfo = shop9;
            if (!shop9) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid9);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername9.username + "'s shop",
                iconURL: ownername9.avatarURL({ dynamic: true, format: `png` }),
              });
            if (!shop9) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "9";
          }

          if (b.customId == "shop10") {
            await b.deferUpdate();

            let shopinfo = shop10;
            if (!shop10) shopinfo = "**This shop info is not setuped yet!**";
            
            let extract = extractLinkFromString(shopinfo);

            let premium = false;
            const result = await getVoteCount(ownerid10);

          if (result.success) {
            if(result.voteCount >= 15) premium = true;
          } else {
            console.error(result.error);
          }

            shopinfo = extract.Msg;
            let image = "https://nonepremiumuser.com"
            if(premium) {
                image = extract.Url
            }

            let Embed = new Discord.MessageEmbed()
              .setDescription(shopinfo)
              .setTimestamp()
              .setColor("#2f3136")
            .setImage(image)
              .setFooter({
                text: ownername10.username + "'s shop",
                iconURL: ownername10.avatarURL({
                  dynamic: true,
                  format: `png`,
                }),
              });
            if (!shop10) Embed.setColor("RED");

            Sendbutton.edit({ embeds: [Embed], components: [row2] });
            ButtonClicked = "10";
          }

          if (b.customId == "home") {
            await b.deferUpdate();

            Sendbutton.edit({
              embeds: [Availableshop],
              components: [row, row1],
            });
            ButtonClicked = "0";
          }

          //---------------------BUY--------------------------

          if (b.customId == "buyBtnShop") {
            // await b.deferUpdate({
            //   ephemeral: true,
            // });

            let serverid = String(guildId);
            let moduleName = "buying";
            let checkChannel = await getChannel(serverid, moduleName);
            if (!checkChannel) {
              return b.reply({
                content:
                  "**This server haven't setup a channel for Buying module!** \n*Setup Channel using* `/setup channel`",
                ephemeral: true,
              });
            }

            let finalChannel =
              interaction.guild.channels.cache.get(checkChannel);
            if (!finalChannel)
              return b.reply({
                content:
                  "**Can't find the setuped channel of Buying module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
                ephemeral: true,
              });

            let q1 = await getQuestion(serverid, moduleName, 1);
            let q2 = await getQuestion(serverid, moduleName, 2);
            let q3 = await getQuestion(serverid, moduleName, 3);
            let q4 = await getQuestion(serverid, moduleName, 4);
            let q5 = await getQuestion(serverid, moduleName, 5);
   
      if (!q1 && !q2 && !q3 && !q4 && !q5)
              return b.reply({
                content:
                  "**This server dont have any question for Buying module!** \n*Setup Question by* `/setup question`",
                ephemeral: true,
              });
            
           if(q1 && q1.length > 45) 
          return b.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q2 && q2.length > 45) 
          return b.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q3 && q3.length > 45) 
          return b.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q4 && q4.length > 45) 
          return b.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q5 && q5.length > 45) 
          return b.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );

            const modal = new Modal()
              .setCustomId("buyingForm")
              .setTitle("Buying Form");

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

            await b.showModal(modal);

            const filter = (b) => {
              return b.customId === "buyingForm";
            };
            b.awaitModalSubmit({ filter, time: 300000 })
              .then((interaction) => {
                let ShopOwner;
                if (ButtonClicked == "0") ShopOwner = "None";
                if (ButtonClicked == "1") ShopOwner = ownername1;
                if (ButtonClicked == "2") ShopOwner = ownername2;
                if (ButtonClicked == "3") ShopOwner = ownername3;
                if (ButtonClicked == "4") ShopOwner = ownername4;
                if (ButtonClicked == "5") ShopOwner = ownername5;
                if (ButtonClicked == "6") ShopOwner = ownername6;
                if (ButtonClicked == "7") ShopOwner = ownername7;
                if (ButtonClicked == "8") ShopOwner = ownername8;
                if (ButtonClicked == "9") ShopOwner = ownername9;
                if (ButtonClicked == "10") ShopOwner = ownername10;

                // console.log(`${interaction.customId} was submitted!`);
                const embed = new MessageEmbed()
                  .setTitle(`__Buying Form Of ${ShopOwner.username}'s Shop__`)
                  .setColor(`#2f3136`)
                  .setThumbnail(
                    interaction.user.avatarURL({ dynamic: true, format: `png` })
                  )
                  .setTimestamp(interaction.createdTimestamp)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setDescription(
                    `\n\n**Author:** ${
                      interaction.member || interaction.user
                    } (${interaction.user.tag})`
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
          

                embed.addFields({
                  name: `Shop Owner:`,
                  value: `${ShopOwner}`,
                });

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
                  .catch((err) => {});
                return interaction
                  .reply({
                    content: `Thanks for buying from ${ShopOwner}.`,
                    ephemeral: true,
                  })
                  .catch(console.error);
              })

              .catch((err) => {});
          }

          //----------------------------BUY------------------------------------
          
          
           //----------------------------SELL------------------------------------
          
          if (b.customId == "sellBtnShop") {
//             return b.reply({
//                     content: `This feature is in development! Stay tuned by joining our official support server to know when its released.`,
//                     ephemeral: true,
//                   })
//                   .catch(console.error);
            
            let checkStatus = await getGuildPremiumStatus(guildId);
        if(!checkStatus.success) {
            return b.reply({
                content: `**This is a Premium Server feature!** \nYou can get a Premium server code to redeem when you vote Order It 20 Times on top.gg. \nUse command **/vote** to get vote link. \n*[Note: Make sure to join support server of Order It to receive the code.]*`,
              ephemeral: true,
                })
        }
            
            
            let serverid = String(guildId);
            let moduleName = "selling";
            let checkChannel = await getChannel(serverid, moduleName);
            if (!checkChannel) {
              return b.reply({
                content:
                  "**This server haven't setup a channel for Selling module!** \n*Setup Channel using* `/setup channel`",
                ephemeral: true,
              });
            }

            let finalChannel =
              interaction.guild.channels.cache.get(checkChannel);
            if (!finalChannel)
              return b.reply({
                content:
                  "**Can't find the setuped channel of Selling module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
                ephemeral: true,
              });

            let q1 = await getQuestion(serverid, moduleName, 1);
            let q2 = await getQuestion(serverid, moduleName, 2);
            let q3 = await getQuestion(serverid, moduleName, 3);
            let q4 = await getQuestion(serverid, moduleName, 4);
            let q5 = await getQuestion(serverid, moduleName, 5);
   
      if (!q1 && !q2 && !q3 && !q4 && !q5)
              return b.reply({
                content:
                  "**This server dont have any question for Selling module!** \n*Setup Question by* `/setup question`",
                ephemeral: true,
              });
            
            if(q1 && q1.length > 45) 
          return b.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q2 && q2.length > 45) 
          return b.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q3 && q3.length > 45) 
          return b.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q4 && q4.length > 45) 
          return b.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
          if(q5 && q5.length > 45) 
          return b.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
            const modal = new Modal()
              .setCustomId("sellingForm")
              .setTitle("Selling Form");

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
            

            await b.showModal(modal);

            const filter = (b) => {
              return b.customId === "sellingForm";
            };
            b.awaitModalSubmit({ filter, time: 300000 })
              .then((interaction) => {
                let ShopOwner;
                if (ButtonClicked == "0") ShopOwner = "None";
                if (ButtonClicked == "1") ShopOwner = ownername1;
                if (ButtonClicked == "2") ShopOwner = ownername2;
                if (ButtonClicked == "3") ShopOwner = ownername3;
                if (ButtonClicked == "4") ShopOwner = ownername4;
                if (ButtonClicked == "5") ShopOwner = ownername5;
                if (ButtonClicked == "6") ShopOwner = ownername6;
                if (ButtonClicked == "7") ShopOwner = ownername7;
                if (ButtonClicked == "8") ShopOwner = ownername8;
                if (ButtonClicked == "9") ShopOwner = ownername9;
                if (ButtonClicked == "10") ShopOwner = ownername10;

                // console.log(`${interaction.customId} was submitted!`);
                const embed = new MessageEmbed()
                  .setTitle(`__Selling Form Of ${ShopOwner.username}'s Shop__`)
                  .setColor(`#2f3136`)
                  .setThumbnail(
                    interaction.user.avatarURL({ dynamic: true, format: `png` })
                  )
                  .setTimestamp(interaction.createdTimestamp)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setDescription(
                    `\n\n**Author:** ${
                      interaction.member || interaction.user
                    } (${interaction.user.tag})`
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
          

                embed.addFields({
                  name: `Shop Owner:`,
                  value: `${ShopOwner}`,
                });

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
                  .catch((err) => {});
                return interaction
                  .reply({
                    content: `Thanks for selling to ${ShopOwner}.`,
                    ephemeral: true,
                  })
                  .catch(console.error);
              })

              .catch((err) => {});
            
          }
           //----------------------------SELL------------------------------------
          
        } else {
          b.reply({
            content:
              "These shop buttons are't for you! \nGet your own by doing `/shop`",
            ephemeral: true,
          });
        }
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};


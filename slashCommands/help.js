const {
  MessageEmbed,
  MessageActionRow,
  Modal,
  MessageButton,
  TextInputComponent,
} = require("discord.js");
const Discord = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
module.exports = {
  name: "help",
  description: "Provides the list of all available commands. [Order It]",
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

      await interaction.deferReply({
        ephemeral: false,
      });
      
      const embed0 = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Roleplay Help menu of Order It")

        .addFields({
          name: "__Roleplay__",
          value:
            "`/order` > Order food and drinks \n`/recent-order` > Know about your recent order \n`/profile` > Displays different info about user's roleplay \n`/rp-rule` > Displays roleplay rules \n\n\n[Vote Me](https://top.gg/bot/716257964767445043/vote) | [Official Website ](https://orderit.ga/) | [Support Server](https://discord.gg/ZjBUPCNg2n) | [Docs](https://docs.orderit.ga/)",
        });

      //--------------------------------------

      const embed1 = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle("Modules Help menu of Order It")

        .addFields({
          name: "__Modules__",
          value:
            "`/ordering` > Access Ordering Module \n`/selling` > Access Selling Module \n `/buying` > Access Buying Module \n `/advertising` > Access Advertising Module \n`/hiring` > Access Hiring Module \n`/setup channel` > Modify the modules channel \n `/setup question` > Modify the modules question \n`/questions` > To view all module questions \n`/channels` > To view all module channels \n`/module-list` > To access the modules using menu \n\n\n[Vote Me](https://top.gg/bot/716257964767445043/vote) | [Official Website ](https://orderitwebsite.netlify.app) | [Support Server](https://discord.gg/ZjBUPCNg2n) | [Docs](https://docs.orderit.ga/)",
        });

      //--------------------------------------

      const embed2 = new Discord.MessageEmbed()
        .setColor("BLUE")

        .addFields({
          name: "__Shops__",
          value:
            "`/setup shop-info` > To modify the shop info \n`/setup shop-owner` > To modify the shop owner \n`/display-shop` > To display certain shop which buttons dont expires and are for everone \n`/shop` > To view the all shops of the server  \n\n\n[Vote Me](https://top.gg/bot/716257964767445043/vote) | [Official Website ](https://orderitwebsite.netlify.app) | [Support Server](https://discord.gg/ZjBUPCNg2n) | [Docs](https://kristab.gitbook.io/orderit-docs/)",
        });

      const embed3 = new Discord.MessageEmbed()
        .setColor("RED")

        .addFields({
          name: "__Informations__",
          value:
            "`/redeem` > To redeem server premium code \n`/vote` > To vote Order It in top.gg \n`/top-votes` > To see the top votes leaderboard. \n`/contact` > To give your suggestion, feedback or report bugs and glitches of bot \n`/info faq` > To get faq with answer \n`/info ping` > To check the bot ping \n`/info userinfo` > To check the userinfo \n`/botinfo` > To check the imformation of Order It \n`/help` > To view the available command list \n`/invite` > To invite Order It in your own server \n`/server` > To get the Order It official server link \n\n\n[Vote Me](https://top.gg/bot/716257964767445043/vote) | [Official Website ](https://orderitwebsite.netlify.app) | [Support Server](https://discord.gg/ZjBUPCNg2n) | [Docs](https://kristab.gitbook.io/orderit-docs/)",
        });

      const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription(
          "```🍕 : Roleplay \n🔐 : Modules \n🛒 : Shops \n❗ : Informations \n🏠 : Home```  \n\n[Vote Me!](https://top.gg/bot/716257964767445043/vote) | [Official Website ](https://orderitwebsite.netlify.app) | [Support Server](https://discord.gg/ZjBUPCNg2n) | [Need Help? Visit Docs](https://kristab.gitbook.io/orderit-docs/) \n\n**Click the button below to view help menu!** "
        )
        .setFooter({ text: "© Order It" });

      //-----------------------------------------BUTTON
       let button0 = new MessageButton()
        .setCustomId("help0")
        .setEmoji("🍕")
       .setLabel("New!")
        .setStyle("PRIMARY");
      
      let button1 = new MessageButton()
        .setCustomId("help1")
        .setEmoji("🔐")
        .setStyle("PRIMARY");

      let button2 = new MessageButton()
        .setCustomId("help2")
        .setStyle("PRIMARY")
        .setEmoji("🛒");

      let button3 = new MessageButton()
        .setCustomId("help3")
        .setStyle("PRIMARY")
        .setEmoji("❗");

      let button4 = new MessageButton()
        .setCustomId("home")
        .setStyle("SUCCESS")
        .setEmoji("🏠");

      let row = new MessageActionRow().addComponents(
        button0,
        button1,
        button2,
        button3,
        button4
      );

      const MESSAGE = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      const filter = (button) => button.user.id === interaction.user.id;
      const collector = MESSAGE.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 500000,
      });

      collector.on("collect", async (b) => {
        if (b.user.id === interaction.user.id) {
          if (b.customId == "help0") {
            await b.deferUpdate();

            button0.setDisabled(true);
            button1.setDisabled(false);
            button2.setDisabled(false);
            button3.setDisabled(false);
            button4.setDisabled(false);

            row = new MessageActionRow().addComponents(
              button0,
              button1,
              button2,
              button3,
              button4
            );

            MESSAGE.edit({ embeds: [embed0], components: [row] }).catch(
              (err) => { }
            );
          }
          
          if (b.customId == "help1") {
            await b.deferUpdate();

            button0.setDisabled(false);
            button1.setDisabled(true);
            button2.setDisabled(false);
            button3.setDisabled(false);
            button4.setDisabled(false);

            row = new MessageActionRow().addComponents(
              button0,
              button1,
              button2,
              button3,
              button4
            );

            MESSAGE.edit({ embeds: [embed1], components: [row] }).catch(
              (err) => { }
            );
          }

          if (b.customId == "help2") {
            await b.deferUpdate();

            button0.setDisabled(false);
            button1.setDisabled(false);
            button2.setDisabled(true);
            button3.setDisabled(false);
            button4.setDisabled(false);

            row = new MessageActionRow().addComponents(
              button0,
              button1,
              button2,
              button3,
              button4
            );

            MESSAGE.edit({ embeds: [embed2], components: [row] }).catch(
              (err) => { }
            );
          }
          if (b.customId == "help3") {
            await b.deferUpdate();

            button0.setDisabled(false);
            button1.setDisabled(false);
            button2.setDisabled(false);
            button3.setDisabled(true);
            button4.setDisabled(false);

            row = new MessageActionRow().addComponents(
              button0,
              button1,
              button2,
              button3,
              button4
            );

            MESSAGE.edit({ embeds: [embed3], components: [row] }).catch(
              (err) => { }
            );
          }

          if (b.customId == "home") {
            await b.deferUpdate();
            
            button0.setDisabled(false);
            button1.setDisabled(false);
            button2.setDisabled(false);
            button3.setDisabled(false);
            button4.setDisabled(true);

            row = new MessageActionRow().addComponents(button0, button1, button2, button3, button4);

            MESSAGE.edit({ embeds: [embed], components: [row] }).catch(
              (err) => { }
            );
          }
        } else {
          b.reply({
            content:
              "These help menu isn't for you! \nGet your own help menu by doing `/help`",
            ephemeral: true,
          }).catch((err) => { });
        }
      });

      collector.on("end", (b) => {
        button0.setDisabled(true);
        button1.setDisabled(true);
        button2.setDisabled(true);
        button3.setDisabled(true);
        button4.setDisabled(true);

        row = new MessageActionRow().addComponents(
          button0,
          button1,
          button2,
          button3,
          button4
        );

        MESSAGE.edit({
          content:
            "This help menu is expired! Please retype `/help` to view again.",
          components: [row],
        }).catch((err) => { });
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

const {
  MessageEmbed,
  MessageActionRow,
  Modal,
  TextInputComponent,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const prefix = config.prefix;
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");

const getQuestion = require("../../rotues/getQuestions.route");
const getChannel = require("../../rotues/getChannels.route");
const getShopOwner = require("../../rotues/getShopsOwner.route");
const { getGuildPremiumStatus } = require("../../models/Guild");

const getOrdersFinal = require("../../rotues/getOrdersFinal.route");
const removeOrderData = require("../../rotues/removeOrderData.route");
const increaseTotalOrdersServed = require("../../rotues/increaseTotalOrdersServed.route");
const banUser = require("../../rotues/banUser.route");

function extractShopNumber(str) {
  // Check if the string starts with "Shop No: '"
  const prefix = "Shop No: '";
  if (!str.startsWith(prefix)) {
    return null;
  }

  // Extract the shopNumber substring
  const startIndex = prefix.length;
  const endIndex = str.lastIndexOf("'");
  if (endIndex === -1 || endIndex <= startIndex) {
    return null;
  }

  const shopNumber = str.slice(startIndex, endIndex);
  return shopNumber;
}

function extractId(str) {
  const regex = /<@(\w+)>/;
  const match = str.match(regex);

  if (match && match.length >= 2) {
    return match[1];
  }

  return null;
}

module.exports = async (client, interaction) => {
  //Event listener for buttons
  if (interaction.isButton()) {
    //FOR servebtn and deny button
    if (interaction.customId == "serveBtn") {
      const checkMember = client.guilds.cache
        .get("743705988321902643")
        .members.cache.get(interaction.user.id);
      if (checkMember) {
        if (!checkMember.roles.cache.has("1119905457503490110")) {
          return interaction.reply({
            content: "Only Chef can serve the food!",
            ephemeral: true,
          });
        }
      } else {
        return interaction.reply({
          content: "Only Chef can serve the food!",
          ephemeral: true,
        });
      }

      let UserID = interaction.message.embeds[0].fields[0].value;
      if (!UserID) {
        return interaction.reply({
          content: "Error receiving USER ID! Error Code: 501",
          ephemeral: true,
        });
      }

      const order = await getOrdersFinal(UserID);
      if (!order) {
        return interaction.reply({
          content: "No orders found of the user! Error Code: 502",
          ephemeral: true,
        });
      }
      if (!order.serverId) {
        return interaction.reply({
          content: "No serverid found of the user! Error Code: 503",
          ephemeral: true,
        });
      }
      if (!order.orderId) {
        return interaction.reply({
          content: "No orderid found of the user! Error Code: 504",
          ephemeral: true,
        });
      }
      if (!order.orderInfo) {
        return interaction.reply({
          content: "No orderinfo found of the user! Error Code: 505",
          ephemeral: true,
        });
      }
      if (!order.channelId) {
        return interaction.reply({
          content: "No channelid found of the user! Error Code: 506",
          ephemeral: true,
        });
      }

      const orderId = order.orderId;
      const orderInfo = order.orderInfo;
      const channelID = order.channelId;
      const serverID = order.serverId;

      let finalserver = client.guilds.cache.get(serverID);
      if (!finalserver) {
        return interaction.reply({
          content: "Order server can't be found! Error Code: 507",
          ephemeral: true,
        });
      }

      let finalchannel = finalserver.channels.cache.get(channelID);
      if (!finalchannel) {
        return interaction.reply({
          content:
            "Order channel is deleted or can't be found! Error Code: 508",
          ephemeral: true,
        });
      }

      let Member;
      try {
         Member = await finalserver.members.fetch(UserID);
      if (!Member) {
        return interaction.reply({
          content: "Error fetching User! Error Code: 509",
          ephemeral: true,
        });
      }
      } catch (err) {
         return interaction.reply({
          content: "Error fetching User or User doesnot exists! Error Code: 509",
          ephemeral: true,
        });
      }
      
      
      const customId = `serveModal:${interaction.id}`;

      const modal = new Modal().setTitle("Serve Food To The Customer");
      modal.setCustomId(customId);

      const Input1 = new TextInputComponent()
        .setCustomId("Input1")
        .setLabel(`Food`)
        .setPlaceholder(`[order] image link`)
        .setRequired(true)
        .setStyle("PARAGRAPH");

      const firstActionRow = new MessageActionRow().addComponents(Input1);
      modal.addComponents(firstActionRow);

      const Input2 = new TextInputComponent()
        .setCustomId("Input2")
        .setLabel(`Message`)
        .setRequired(true)
        .setPlaceholder(
          `Hope you enjoy your [order].`
        )
        .setStyle("PARAGRAPH");

      const secondActionRow = new MessageActionRow().addComponents(Input2);
      modal.addComponents(secondActionRow);

      await interaction.showModal(modal);
      

      const filter = (interaction) => {
        return interaction.customId === customId;
      };
      interaction
        .awaitModalSubmit({ filter, time: 300000 })
        .then(async (interaction) => {
          let Foodlink = interaction.fields.getTextInputValue("Input1");
          let Message = interaction.fields.getTextInputValue("Input2");

          let buttonServed = new MessageButton()
            .setCustomId("servedOrder")
            .setStyle("SUCCESS")
            .setLabel("Served")
            .setEmoji("✅")
            .setDisabled(true);

          let servedRow = new MessageActionRow().addComponents(buttonServed);
          
        await removeOrderData(UserID);
          if (interaction.user.id !== UserID) {
            await increaseTotalOrdersServed(interaction.user.id);
          }
        
          finalchannel
            .send({
              content:
                `**🍽 Order delivery of <@${Member.user.id}>!**` +
                " \n\n**__Order Summary:__** \n**Order Id:** `" +
                orderId +
                "` \n**Order:** `" +
                orderInfo +
                "` \n\n" +
                Foodlink +
                " \n\n**Chef:** " +
                interaction.user.username +
                " \n**Chef Message:** " +
                Message,
            })
            .catch((err) => {
        
            return interaction.channel.send({
            content: `Error while delivering! Error Code: 510`,
            ephemeral: false,
          })
            });
      
        

          interaction.message.edit({
            content: `Operator: ${interaction.user.username} | ${interaction.user.id}`,
            components: [servedRow],
          });

         let logschannel = client.channels.cache.get("1121474124116672603");
      
      logschannel
            .send({
              content:
                "✅ | SERVED \n\n**__Order Summary of "+ Member.user.username+" | "+Member.user.id+" :__** \n**Order Id:** `" +
                orderId +
                "` \n**Order:** `" +
                orderInfo +
                "` \n\n" +
                Foodlink +
                " \n\n**Chef:** " +
                interaction.user.username +
                " \n**Chef Message:** " +
                Message,
            })
            .catch((err) => {
              return interaction.channel.send({
                content: `Error while logging served deliver message! Error Code: 511`,
                ephemeral: false,
              });
            });
        
          interaction
            .reply({
              content: `Successfully served the order!`,
              ephemeral: true,
            })
            .catch(console.error);
        
        
        })
        .catch((err) => {});
      
    }

    if (interaction.customId == "denyBtn") {
      const checkMember = client.guilds.cache
        .get("743705988321902643")
        .members.cache.get(interaction.user.id);
      if (checkMember) {
        if (!checkMember.roles.cache.has("1119905457503490110")) {
          return interaction.reply({
            content: "Only Chef can deny the order!",
            ephemeral: true,
          });
        }
      } else {
        return interaction.reply({
          content: "Only Chef can deny the order!",
          ephemeral: true,
        });
      }

      let UserID = interaction.message.embeds[0].fields[0].value;
      if (!UserID) {
        return interaction.reply({
          content: "Error receiving USER ID! Error Code: 501",
          ephemeral: true,
        });
      }

      const order = await getOrdersFinal(UserID);
      if (!order) {
        return interaction.reply({
          content: "No orders found of the user! Error Code: 502",
          ephemeral: true,
        });
      }
      if (!order.serverId) {
        return interaction.reply({
          content: "No serverid found of the user! Error Code: 503",
          ephemeral: true,
        });
      }
      if (!order.orderId) {
        return interaction.reply({
          content: "No orderid found of the user! Error Code: 504",
          ephemeral: true,
        });
      }
      if (!order.orderInfo) {
        return interaction.reply({
          content: "No orderinfo found of the user! Error Code: 505",
          ephemeral: true,
        });
      }
      if (!order.channelId) {
        return interaction.reply({
          content: "No channelid found of the user! Error Code: 506",
          ephemeral: true,
        });
      }

      const orderId = order.orderId;
      const orderInfo = order.orderInfo;
      const channelID = order.channelId;
      const serverID = order.serverId;

      let finalserver = client.guilds.cache.get(serverID);
      if (!finalserver) {
        return interaction.reply({
          content: "Order server can't be found! Error Code: 507",
          ephemeral: true,
        });
      }

      let finalchannel = finalserver.channels.cache.get(channelID);
      if (!finalchannel) {
        return interaction.reply({
          content:
            "Order channel is deleted or can't be found! Error Code: 508",
          ephemeral: true,
        });
      }

      let Member;
      try {
         Member = await finalserver.members.fetch(UserID);
      if (!Member) {
        return interaction.reply({
          content: "Error fetching User! Error Code: 509",
          ephemeral: true,
        });
      }
      } catch (err) {
         return interaction.reply({
          content: "Error fetching User or User doesnot exists! Error Code: 509",
          ephemeral: true,
        });
      }
      
      const customId = `denyModal:${interaction.id}`;

      const modal = new Modal().setTitle("Order Deny Message");
      modal.setCustomId(customId);

      const Input1 = new TextInputComponent()
        .setCustomId("Input1")
        .setLabel(`Message`)
        .setPlaceholder(
          `Your order is against our rules. Please don't repeat again else you will be banned.`
        )
        .setRequired(true)
        .setStyle("PARAGRAPH");

      const firstActionRow = new MessageActionRow().addComponents(Input1);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);

      const filter = (interaction) => {
        return interaction.customId === customId;
      };
      interaction
        .awaitModalSubmit({ filter, time: 300000 })
        .then(async (interaction) => {
          let Message = interaction.fields.getTextInputValue("Input1");

          let buttonDenied = new MessageButton()
            .setCustomId("deniedOrder")
            .setStyle("DANGER")
            .setLabel("Denied")
            .setEmoji("❎")
            .setDisabled(true);

          let Row = new MessageActionRow().addComponents(buttonDenied);

          await removeOrderData(UserID);        
        
          finalchannel
            .send({
              content: `❌  **<@${Member.user.id}>, Your order has been denied!** \n**__Order Summary:__** \n**Order Id:** \`${orderId}\` \n**Order:** \`${orderInfo}\` \n\n**Reason:** ${Message}`,
            })
            .catch((err) => {
              return interaction.channel.send({
            content: `Error while sending denyed message! Error Code: 510`,
            ephemeral: false,
          })
            });
        
          interaction.message.edit({
            content: `Operator: ${interaction.user.username} | ${interaction.user.id}`,
            components: [Row],
          });
        
        let logschannel = client.channels.cache.get("1121474124116672603");
      
      logschannel
            .send({
              content:
                "❌ | DENIED \n\n**__Order Summary of "+ Member.user.username+" | "+Member.user.id+" :__** \n**Order Id:** `" +
                orderId +
                "` \n**Order:** `" +
                orderInfo +
                "` \n\n**Chef:** " +
                interaction.user.username +
                " \n**Reason:** " +
                Message,
            })
            .catch((err) => {
              return interaction.channel.send({
                content: `Error while logging denied deliver message! Error Code: 511`,
                ephemeral: false,
              });
            });

          interaction
            .reply({
              content: `Successfully denied the order!`,
              ephemeral: true,
            })
            .catch(console.error);
        })
        .catch((err) => {});
    }

    if (interaction.customId == "forcedenyBtn") {
      const checkMember = client.guilds.cache
        .get("743705988321902643")
        .members.cache.get(interaction.user.id);
      if (checkMember) {
        if (!checkMember.roles.cache.has("1119905457503490110")) {
          return interaction.reply({
            content: "Only Chef can force deny the order!",
            ephemeral: true,
          });
        }
      } else {
        return interaction.reply({
          content: "Only Chef can force deny the order!",
          ephemeral: true,
        });
      }

      let UserID = interaction.message.embeds[0].fields[0].value;
      if (!UserID) {
        return interaction.reply({
          content: "Error receiving USER ID! Error Code: 501",
          ephemeral: true,
        });
      }

      const order = await getOrdersFinal(UserID);
      if (!order) {
        return interaction.reply({
          content: "No orders found of the user! Error Code: 502",
          ephemeral: true,
        });
      }
      let buttonForceDenied = new MessageButton()
        .setCustomId("forcedeniedOrder")
        .setStyle("SECONDARY")
        .setLabel("Force Denied")
        .setEmoji("❌")
        .setDisabled(true);

      let Row = new MessageActionRow().addComponents(buttonForceDenied);

      await removeOrderData(UserID);

      interaction.message.edit({
        content: `Operator: ${interaction.user.username} | ${interaction.user.id}`,
        components: [Row],
      });
      
      let logschannel = client.channels.cache.get("1121474124116672603");
      
      logschannel
            .send({
              content:
                "❌ | FORCED DENIED \n\n**__Order Summary of  "+UserID+" :__**" +
                " \n\n**Chef:** " +
                interaction.user.username 
               ,
            })
            .catch((err) => {
              return interaction.channel.send({
                content: `Error while logging forced denied deliver message! Error Code: 511`,
                ephemeral: false,
              });
            });

      interaction
        .reply({
          content: `Successfully force denied the order!`,
          ephemeral: true,
        })
        .catch(console.error);
    }
    
      if (interaction.customId == "banUserBtn") {
      const checkMember = client.guilds.cache
        .get("743705988321902643")
        .members.cache.get(interaction.user.id);
      if (checkMember) {
        if (!checkMember.roles.cache.has("1124299417961373696")) {
          return interaction.reply({
            content: "Only Hotel Manager can ban the user!",
            ephemeral: true,
          });
        }
      } else {
        return interaction.reply({
          content: "Only Hotel Manager can ban the user!",
          ephemeral: true,
        });
      }

      let UserID = interaction.message.embeds[0].fields[0].value;
      if (!UserID) {
        return interaction.reply({
          content: "Error receiving USER ID! Error Code: 501",
          ephemeral: true,
        });
      }

      const order = await getOrdersFinal(UserID);
      if (!order) {
        return interaction.reply({
          content: "No order docs found of the user! Error Code: 502",
          ephemeral: true,
        });
      }

  
      const customId = `banreasonModal:${interaction.id}`;

      const modal = new Modal().setTitle("User Ban Reason");
      modal.setCustomId(customId);

      const Input1 = new TextInputComponent()
        .setCustomId("Input1")
        .setLabel(`Message`)
        .setPlaceholder(
          `You have been banned for breaking our rules multiple times.`
        )
        .setRequired(true)
        .setStyle("PARAGRAPH");

      const firstActionRow = new MessageActionRow().addComponents(Input1);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);

      const filter = (interaction) => {
        return interaction.customId === customId;
      };
      interaction
        .awaitModalSubmit({ filter, time: 300000 })
        .then(async (interaction) => {
          let Reason = interaction.fields.getTextInputValue("Input1");

          let buttonBannedUser = new MessageButton()
            .setCustomId("bannedUserOrder")
            .setStyle("PRIMARY")
            .setLabel("Banned")
            .setEmoji("🔨")
            .setDisabled(true);

          let Row = new MessageActionRow().addComponents(buttonBannedUser);

          await banUser(UserID, Reason);

          interaction.message.edit({
            content: `Operator: ${interaction.user.username} | ${interaction.user.id}`,
            components: [Row],
          });

          let logschannel = client.channels.cache.get("1121474124116672603");
      
          logschannel
                .send({
                  content:
                  "🔨 | BANNED \n\n**__Banned Summary Of  "+UserID+" :__**" +
                  " \n\n**Hotel Manager:** " +
                  interaction.user.username + "\n **Reason:** "+ Reason
                 ,
                })
                .catch((err) => {
                  return interaction.channel.send({
                    content: `Error while logging banned deliver message! Error Code: 511`,
                    ephemeral: true,
                  });
                });

          interaction
            .reply({
              content: `Successfully Banned the user!`,
              ephemeral: true,
            })
            .catch(console.error);
        })
        .catch((err) => {});
    }

    //FOR BUYBTN AND SELLBTN
    if (interaction.customId == "buyBtn") {
      let serverid = String(interaction.guild.id);
      let moduleName = "buying";
      let checkChannel = await getChannel(serverid, moduleName);
      if (!checkChannel) {
        return interaction.reply({
          content:
            "**This server haven't setup a channel for Buying module!** \n*Setup Channel using* `/setup channel`",
          ephemeral: true,
        });
      }

      let finalChannel = interaction.guild.channels.cache.get(checkChannel);
      if (!finalChannel)
        return interaction.reply({
          content:
            "**Can't find the setuped channel of Buying module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
          ephemeral: true,
        });

      let noText = interaction.message.content;
      if (!noText) {
        return interaction.reply({
          content:
            "Error receiving shop number! \nReport us using `/contact` command if this error keeps happening.",
          ephemeral: true,
        });
      }
      const shopNumber = extractShopNumber(noText);
      if (!shopNumber) {
        return interaction.reply({
          content:
            "Error extracting shop number! \nReport us using `/contact` command if this error keeps happening.",
          ephemeral: true,
        });
      }

      let ownerid = await getShopOwner(serverid, shopNumber);
      if (!ownerid)
        return interaction.editReply({
          content: "Displayed Shop don't have any owner!",
          ephemeral: true,
        });
      let owner = await client.users.fetch(ownerid);

      let q1 = await getQuestion(serverid, moduleName, 1);
      let q2 = await getQuestion(serverid, moduleName, 2);
      let q3 = await getQuestion(serverid, moduleName, 3);
      let q4 = await getQuestion(serverid, moduleName, 4);
      let q5 = await getQuestion(serverid, moduleName, 5);

      if (!q1 && !q2 && !q3 && !q4 && !q5)
        return interaction.reply({
          content:
            "**This server dont have any question for Buying module!** \n*Setup Question by* `/setup question`",
          ephemeral: true,
        });

      if (q1 && q1.length > 45)
        return interaction.reply(
          "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q2 && q2.length > 45)
        return interaction.reply(
          "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q3 && q3.length > 45)
        return interaction.reply(
          "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q4 && q4.length > 45)
        return interaction.reply(
          "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q5 && q5.length > 45)
        return interaction.reply(
          "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );

      const customId = `buyingForm:${interaction.id}`;

      const modal = new Modal().setTitle("Buying Form");
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

      const filter = (b) => {
        return b.customId === customId;
      };
      interaction
        .awaitModalSubmit({ filter, time: 300000 })
        .then((interaction) => {
          let ShopOwner = owner;

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
              `\n\n**Author:** ${interaction.member || interaction.user} (${
                interaction.user.tag
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
              content: `Thanks for buying from ${ShopOwner}'s Shop.`,
              ephemeral: true,
            })
            .catch(console.error);
        })

        .catch((err) => {});
    }

    if (interaction.customId == "sellBtn") {
      let serverid = String(interaction.guild.id);

      let checkStatus = await getGuildPremiumStatus(serverid);
      if (!checkStatus.success) {
        return interaction.reply({
          content: `**This is a Premium Server feature!** \nYou can get a Premium server code to redeem when you vote Order It 20 Times on top.gg. \nUse command **/vote** to get vote link. \n*[Note: Make sure to join support server of Order It to receive the code.]*`,
          ephemeral: true,
        });
      }

      let moduleName = "selling";
      let checkChannel = await getChannel(serverid, moduleName);
      if (!checkChannel) {
        return interaction.reply({
          content:
            "**This server haven't setup a channel for Selling module!** \n*Setup Channel using* `/setup channel`",
          ephemeral: true,
        });
      }

      let finalChannel = interaction.guild.channels.cache.get(checkChannel);
      if (!finalChannel)
        return interaction.reply({
          content:
            "**Can't find the setuped channel of Selling module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
          ephemeral: true,
        });

      let noText = interaction.message.content;
      if (!noText) {
        return interaction.reply({
          content:
            "Error receiving shop number! \nReport us using `/contact` command if this error keeps happening.",
          ephemeral: true,
        });
      }
      const shopNumber = extractShopNumber(noText);
      if (!shopNumber) {
        return interaction.reply({
          content:
            "Error extracting shop number! \nReport us using `/contact` command if this error keeps happening.",
          ephemeral: true,
        });
      }

      let ownerid = await getShopOwner(serverid, shopNumber);
      if (!ownerid)
        return interaction.editReply({
          content: "Displayed Shop don't have any owner!",
          ephemeral: true,
        });
      let owner = await client.users.fetch(ownerid);

      let q1 = await getQuestion(serverid, moduleName, 1);
      let q2 = await getQuestion(serverid, moduleName, 2);
      let q3 = await getQuestion(serverid, moduleName, 3);
      let q4 = await getQuestion(serverid, moduleName, 4);
      let q5 = await getQuestion(serverid, moduleName, 5);

      if (!q1 && !q2 && !q3 && !q4 && !q5)
        return interaction.reply({
          content:
            "**This server dont have any question for Selling module!** \n*Setup Question by* `/setup question`",
          ephemeral: true,
        });

      if (q1 && q1.length > 45)
        return interaction.reply(
          "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q2 && q2.length > 45)
        return interaction.reply(
          "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q3 && q3.length > 45)
        return interaction.reply(
          "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q4 && q4.length > 45)
        return interaction.reply(
          "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );
      if (q5 && q5.length > 45)
        return interaction.reply(
          "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
        );

      const customId = `sellingForm:${interaction.id}`;

      const modal = new Modal().setTitle("Selling Form");
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

      const filter = (b) => {
        return b.customId === customId;
      };
      interaction
        .awaitModalSubmit({ filter, time: 300000 })
        .then((interaction) => {
          let ShopOwner = owner;

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
              `\n\n**Author:** ${interaction.member || interaction.user} (${
                interaction.user.tag
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
              content: `Thanks for selling to ${ShopOwner}'s Shop.`,
              ephemeral: true,
            })
            .catch(console.error);
        })

        .catch((err) => {});
    }

    //For ACCEPT, DECLINE AND CONFIRN BUTTONS
    if (interaction.customId == "accept") {
      if (
        interaction.message.embeds[0].title.includes("Buying Form Of") ||
        interaction.message.embeds[0].title.includes("Selling Form Of")
      ) {
        let shopOwnerFormat =
          interaction.message.embeds[0].fields[
            interaction.message.embeds[0].fields.length - 1
          ].value;
        if (!shopOwnerFormat) {
          return interaction.reply({
            content:
              "Error receiving shop owner! \nReport us using `/contact` command if this error keeps happening.",
            ephemeral: true,
          });
        }
        let shopownerid = extractId(shopOwnerFormat);
        if (!shopownerid) {
          return interaction.reply({
            content:
              "Error extracting shop owner id! \nReport us using `/contact` command if this error keeps happening.",
            ephemeral: true,
          });
        }
        if (interaction.member.id != shopownerid)
          return interaction.reply({
            ephemeral: true,
            content:
              "You need to be the owner of this shop to use this button.",
          });
      } else {
        if (!interaction.member.permissions.has(["MANAGE_MESSAGES"]))
          return interaction.reply({
            ephemeral: true,
            content:
              "You don't have permission to use this button. \n``` Required permmission: MANAGE_MESSAGES ```",
          });
      }

      if (interaction.message.content.includes("**Status:** `PENDING`")) {
        let buttonConfirmed = new MessageButton()
          .setCustomId("confirm")
          .setStyle("SUCCESS")
          .setLabel("Complete")
          .setEmoji("1013317508540923944");

        let buttonRow = new MessageActionRow().addComponents(buttonConfirmed);

        interaction.message.edit({
          content:
            "**Status:** `ACCEPTED` \n**Operator:** `" +
            interaction.user.tag +
            "`",
          components: [buttonRow],
        });

        interaction.reply({
          content: "You accepted the form!",
          ephemeral: true,
        });
      }
    }

    if (interaction.customId == "decline") {
      if (
        interaction.message.embeds[0].title.includes("Buying Form Of") ||
        interaction.message.embeds[0].title.includes("Selling Form Of")
      ) {
        let shopOwnerFormat =
          interaction.message.embeds[0].fields[
            interaction.message.embeds[0].fields.length - 1
          ].value;
        if (!shopOwnerFormat) {
          return interaction.reply({
            content:
              "Error receiving shop owner! \nReport us using `/contact` command if this error keeps happening.",
            ephemeral: true,
          });
        }
        let shopownerid = extractId(shopOwnerFormat);
        if (!shopownerid) {
          return interaction.reply({
            content:
              "Error extracting shop owner id! \nReport us using `/contact` command if this error keeps happening.",
            ephemeral: true,
          });
        }
        if (interaction.member.id != shopownerid)
          return interaction.reply({
            ephemeral: true,
            content:
              "You need to be the owner of this shop to use this button.",
          });
      } else {
        if (!interaction.member.permissions.has(["MANAGE_MESSAGES"]))
          return interaction.reply({
            ephemeral: true,
            content:
              "You don't have permission to use this button. \n``` Required permmission: MANAGE_MESSAGES ```",
          });
      }
      if (interaction.message.content.includes("**Status:** `PENDING`")) {
        let buttonDeclined = new MessageButton()
          .setCustomId("DECLINED")
          .setStyle("DANGER")
          .setLabel("DECLINED")
          .setDisabled(true)
          .setEmoji("1013317698312216656");

        let buttonRow = new MessageActionRow().addComponents(buttonDeclined);

        interaction.message.edit({
          content:
            "**Status:** `DECLINED`\n**Operator:** `" +
            interaction.user.tag +
            "`",
          components: [buttonRow],
        });

        interaction.reply({
          content: "You declined the form!",
          ephemeral: true,
        });
      }
    }

    if (interaction.customId == "confirm") {
      if (
        interaction.message.embeds[0].title.includes("Buying Form Of") ||
        interaction.message.embeds[0].title.includes("Selling Form Of")
      ) {
        let shopOwnerFormat =
          interaction.message.embeds[0].fields[
            interaction.message.embeds[0].fields.length - 1
          ].value;
        if (!shopOwnerFormat) {
          return interaction.reply({
            content:
              "Error receiving shop owner! \nReport us using `/contact` command if this error keeps happening.",
            ephemeral: true,
          });
        }
        let shopownerid = extractId(shopOwnerFormat);
        if (!shopownerid) {
          return interaction.reply({
            content:
              "Error extracting shop owner id! \nReport us using `/contact` command if this error keeps happening.",
            ephemeral: true,
          });
        }
        if (interaction.member.id != shopownerid)
          return interaction.reply({
            ephemeral: true,
            content:
              "You need to be the owner of this shop to use this button.",
          });
      } else {
        if (!interaction.member.permissions.has(["MANAGE_MESSAGES"]))
          return interaction.reply({
            ephemeral: true,
            content:
              "You don't have permission to use this button. \n``` Required permmission: MANAGE_MESSAGES ```",
          });
      }

      if (interaction.message.content.includes("**Status:** `ACCEPTED`")) {
        let buttonCompleted = new MessageButton()
          .setCustomId("COMPLETED")
          .setStyle("SUCCESS")
          .setLabel("COMPLETED")
          .setDisabled(true)
          .setEmoji("1013317508540923944");

        let buttonRow = new MessageActionRow().addComponents(buttonCompleted);

        interaction.message.edit({
          content:
            "**Status:** `COMPLETED`\n**Operator:** `" +
            interaction.user.tag +
            "`",
          components: [buttonRow],
        });

        interaction.reply({
          content: "You completed the form!",
          ephemeral: true,
        });
      }
    }
  }

  //Event listener for Module Menu

  if (interaction.isSelectMenu()) {
    if (interaction.customId === "modulelist-menu") {
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

      // For Ordering module -------------------------------

      if (interaction.values == "ordering") {
        let serverid = String(guildId);
        let moduleName = "ordering";
        let checkChannel = await getChannel(serverid, moduleName);
        if (!checkChannel) {
          return interaction.reply({
            content:
              "**This server haven't setup a channel for this module!** \n*Setup Channel using* `/setup channel`",
            ephemeral: true,
          });
        }

        let finalChannel = interaction.guild.channels.cache.get(checkChannel);
        if (!finalChannel)
          return interaction.reply({
            content:
              "**Can't find the setuped channel of this module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
            ephemeral: true,
          });

        let q1 = await getQuestion(serverid, moduleName, 1);
        let q2 = await getQuestion(serverid, moduleName, 2);
        let q3 = await getQuestion(serverid, moduleName, 3);
        let q4 = await getQuestion(serverid, moduleName, 4);
        let q5 = await getQuestion(serverid, moduleName, 5);

        if (!q1 && !q2 && !q3 && !q4 && !q5)
          return interaction.reply({
            content:
              "**This server dont have any question for this module!** \n*Setup Question by* `/setup question`",
            ephemeral: true,
          });

        if (q1 && q1.length > 45)
          return interaction.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q2 && q2.length > 45)
          return interaction.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q3 && q3.length > 45)
          return interaction.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q4 && q4.length > 45)
          return interaction.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q5 && q5.length > 45)
          return interaction.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );

        const customId = `orderForm:${interaction.id}`;

        const modal = new Modal().setTitle("Ordering Form");
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
              .setTitle(`__Ordering Form__`)
              .setColor(`#2f3136`)
              .setThumbnail(
                interaction.user.avatarURL({ dynamic: true, format: `png` })
              )
              .setTimestamp(interaction.createdTimestamp)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setDescription(
                `\n\n**Author:** ${interaction.member || interaction.user} (${
                  interaction.user.tag
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
              .catch((err) => {});
            return interaction
              .reply({
                content: `Thanks for filling out the ${moduleName} form.`,
                ephemeral: true,
              })
              .catch(console.error);
          })
          .catch((err) => {});
      }

      // ---------------------------------------

      // For Buying module -------------------------------

      if (interaction.values == "buying") {
        let serverid = String(guildId);
        let moduleName = "buying";
        let checkChannel = await getChannel(serverid, moduleName);
        if (!checkChannel) {
          return interaction.reply({
            content:
              "**This server haven't setup a channel for this module!** \n*Setup Channel using* `/setup channel`",
            ephemeral: true,
          });
        }

        let finalChannel = interaction.guild.channels.cache.get(checkChannel);
        if (!finalChannel)
          return interaction.reply({
            content:
              "**Can't find the setuped channel of this module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
            ephemeral: true,
          });

        let q1 = await getQuestion(serverid, moduleName, 1);
        let q2 = await getQuestion(serverid, moduleName, 2);
        let q3 = await getQuestion(serverid, moduleName, 3);
        let q4 = await getQuestion(serverid, moduleName, 4);
        let q5 = await getQuestion(serverid, moduleName, 5);

        if (!q1 && !q2 && !q3 && !q4 && !q5)
          return interaction.reply({
            content:
              "**This server dont have any question for this module!** \n*Setup Question by* `/setup question`",
            ephemeral: true,
          });
        if (q1 && q1.length > 45)
          return interaction.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q2 && q2.length > 45)
          return interaction.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q3 && q3.length > 45)
          return interaction.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q4 && q4.length > 45)
          return interaction.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q5 && q5.length > 45)
          return interaction.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );

        const customId = `buyingForm:${interaction.id}`;

        const modal = new Modal().setTitle("Buying Form");
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
                `\n\n**Author:** ${interaction.member || interaction.user} (${
                  interaction.user.tag
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
              .catch((err) => {});
            return interaction
              .reply({
                content: `Thanks for filling out the ${moduleName} form.`,
                ephemeral: true,
              })
              .catch(console.error);
          })

          .catch((err) => {});
      }

      // For selling Module----------------------------------------
      if (interaction.values == "selling") {
        let serverid = String(guildId);
        let moduleName = "selling";
        let checkChannel = await getChannel(serverid, moduleName);
        if (!checkChannel) {
          return interaction.reply({
            content:
              "**This server haven't setup a channel for this module!** \n*Setup Channel using* `/setup channel`",
            ephemeral: true,
          });
        }

        let finalChannel = interaction.guild.channels.cache.get(checkChannel);
        if (!finalChannel)
          return interaction.reply({
            content:
              "**Can't find the setuped channel of this module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
            ephemeral: true,
          });

        let q1 = await getQuestion(serverid, moduleName, 1);
        let q2 = await getQuestion(serverid, moduleName, 2);
        let q3 = await getQuestion(serverid, moduleName, 3);
        let q4 = await getQuestion(serverid, moduleName, 4);
        let q5 = await getQuestion(serverid, moduleName, 5);

        if (!q1 && !q2 && !q3 && !q4 && !q5)
          return interaction.reply({
            content:
              "**This server dont have any question for this module!** \n*Setup Question by* `/setup question`",
            ephemeral: true,
          });

        if (q1 && q1.length > 45)
          return interaction.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q2 && q2.length > 45)
          return interaction.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q3 && q3.length > 45)
          return interaction.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q4 && q4.length > 45)
          return interaction.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q5 && q5.length > 45)
          return interaction.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );

        const customId = `sellingForm:${interaction.id}`;

        const modal = new Modal().setTitle("Selling Form");
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
              .setTitle(`__Selling Form__`)
              .setColor(`#2f3136`)
              .setThumbnail(
                interaction.user.avatarURL({ dynamic: true, format: `png` })
              )
              .setTimestamp(interaction.createdTimestamp)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setDescription(
                `\n\n**Author:** ${interaction.member || interaction.user} (${
                  interaction.user.tag
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
              .catch((err) => {});
            return interaction
              .reply({
                content: `Thanks for filling out the ${moduleName} form.`,
                ephemeral: true,
              })
              .catch(console.error);
          })

          .catch((err) => {});
      }

      // For Hiring Module -------------------------------------------
      if (interaction.values == "hiring") {
        let serverid = String(guildId);
        let moduleName = "hiring";
        let checkChannel = await getChannel(serverid, moduleName);
        if (!checkChannel) {
          return interaction.reply({
            content:
              "**This server haven't setup a channel for this module!** \n*Setup Channel using* `/setup channel`",
            ephemeral: true,
          });
        }

        let finalChannel = interaction.guild.channels.cache.get(checkChannel);
        if (!finalChannel)
          return interaction.reply({
            content:
              "**Can't find the setuped channel of this module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
            ephemeral: true,
          });

        let q1 = await getQuestion(serverid, moduleName, 1);
        let q2 = await getQuestion(serverid, moduleName, 2);
        let q3 = await getQuestion(serverid, moduleName, 3);
        let q4 = await getQuestion(serverid, moduleName, 4);
        let q5 = await getQuestion(serverid, moduleName, 5);

        if (!q1 && !q2 && !q3 && !q4 && !q5)
          return interaction.reply({
            content:
              "**This server dont have any question for this module!** \n*Setup Question by* `/setup question`",
            ephemeral: true,
          });

        if (q1 && q1.length > 45)
          return interaction.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q2 && q2.length > 45)
          return interaction.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q3 && q3.length > 45)
          return interaction.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q4 && q4.length > 45)
          return interaction.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q5 && q5.length > 45)
          return interaction.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );

        const customId = `hiringForm:${interaction.id}`;

        const modal = new Modal().setTitle("Hiring Form");
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
              .setTitle(`__Hiring Form__`)
              .setColor(`#2f3136`)
              .setThumbnail(
                interaction.user.avatarURL({ dynamic: true, format: `png` })
              )
              .setTimestamp(interaction.createdTimestamp)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setDescription(
                `\n\n**Author:** ${interaction.member || interaction.user} (${
                  interaction.user.tag
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
              .catch((err) => {});
            return interaction
              .reply({
                content: `Thanks for filling out the ${moduleName} form.`,
                ephemeral: true,
              })
              .catch(console.error);
          })

          .catch((err) => {});
      }

      //for Advertising Module ------------------------------
      if (interaction.values == "advertising") {
        let serverid = String(guildId);
        let moduleName = "advertising";
        let checkChannel = await getChannel(serverid, moduleName);
        if (!checkChannel) {
          return interaction.reply({
            content:
              "**This server haven't setup a channel for this module!** \n*Setup Channel using* `/setup channel`",
            ephemeral: true,
          });
        }

        let finalChannel = interaction.guild.channels.cache.get(checkChannel);
        if (!finalChannel)
          return interaction.reply({
            content:
              "**Can't find the setuped channel of this module!** \n*Reset old channel & Setup new channel using *`/setup channel`",
            ephemeral: true,
          });

        let q1 = await getQuestion(serverid, moduleName, 1);
        let q2 = await getQuestion(serverid, moduleName, 2);
        let q3 = await getQuestion(serverid, moduleName, 3);
        let q4 = await getQuestion(serverid, moduleName, 4);
        let q5 = await getQuestion(serverid, moduleName, 5);

        if (!q1 && !q2 && !q3 && !q4 && !q5)
          return interaction.reply({
            content:
              "**This server dont have any question for this module!** \n*Setup Question by* `/setup question`",
            ephemeral: true,
          });

        if (q1 && q1.length > 45)
          return interaction.reply(
            "Question Number 1 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q2 && q2.length > 45)
          return interaction.reply(
            "Question Number 2 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q3 && q3.length > 45)
          return interaction.reply(
            "Question Number 3 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q4 && q4.length > 45)
          return interaction.reply(
            "Question Number 4 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );
        if (q5 && q5.length > 45)
          return interaction.reply(
            "Question Number 5 of this module have question longer then 45 letters! \nQuestion must be 45 or fewer in length.`"
          );

        const customId = `advertisingForm:${interaction.id}`;

        const modal = new Modal().setTitle("Advertising Form");
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
              .setTitle(`__Advertising Form__`)
              .setColor(`#2f3136`)
              .setThumbnail(
                interaction.user.avatarURL({ dynamic: true, format: `png` })
              )
              .setTimestamp(interaction.createdTimestamp)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setDescription(
                `\n\n**Author:** ${interaction.member || interaction.user} (${
                  interaction.user.tag
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
              .catch((err) => {});
            return interaction
              .reply({
                content: `Thanks for filling out the ${moduleName} form.`,
                ephemeral: true,
              })
              .catch(console.error);
          })

          .catch((err) => {});
      }

      if (interaction.values == "") {
        return interaction.reply({
          content: "Deselected the menu option!",
          ephemeral: true,
        });
      }
    }
  }

  const CategoryName = interaction.commandName;
  let command = false;
  try {
    if (
      client.slashCommands.has(
        CategoryName + interaction.options.getSubcommand()
      )
    ) {
      command = client.slashCommands.get(
        CategoryName + interaction.options.getSubcommand()
      );
    }
  } catch {
    if (client.slashCommands.has("normal" + CategoryName)) {
      command = client.slashCommands.get("normal" + CategoryName);
    }
  }
  if (command) {
    //is dm or dm group channel 
    if(interaction.channel.type === "DM" || interaction.channel.type === "GROUP_DM") {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              "Slash commands can't be used in Dm!"
            )
          .setDescription("Please use commands in the server."),
        ],
      });
    }
    //On cooldown
    if (onCoolDown(interaction, command)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.cooldown, {
                prefix: prefix,
                command: command,
                timeLeft: onCoolDown(interaction, command),
              })
            ),
        ],
      });
    }
    //if Command has specific permission return error
    if (
      command.memberpermissions &&
      command.memberpermissions.length > 0 &&
      !interaction.member.permissions.has(command.memberpermissions)
    ) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.notallowed_to_exec_cmd.title)
            )
            .setDescription(
              replacemsg(
                settings.messages.notallowed_to_exec_cmd.description
                  .memberpermissions,
                {
                  command: command,
                  prefix: prefix,
                }
              )
            ),
        ],
      });
    }
    //if Command has specific needed roles return error
    if (
      command.requiredroles &&
      command.requiredroles.length > 0 &&
      interaction.member.roles.cache.size > 0 &&
      !interaction.member.roles.cache.some((r) =>
        command.requiredroles.includes(r.id)
      )
    ) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.notallowed_to_exec_cmd.title)
            )
            .setDescription(
              replacemsg(
                settings.messages.notallowed_to_exec_cmd.description
                  .requiredroles,
                {
                  command: command,
                  prefix: prefix,
                }
              )
            ),
        ],
      });
    }
    //if Command has specific users return error
    if (
      command.alloweduserids &&
      command.alloweduserids.length > 0 &&
      !command.alloweduserids.includes(interaction.member.id)
    ) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.notallowed_to_exec_cmd.title)
            )
            .setDescription(
              replacemsg(
                settings.messages.notallowed_to_exec_cmd.description
                  .alloweduserids,
                {
                  command: command,
                  prefix: prefix,
                }
              )
            ),
        ],
      });
    }

    //---COMMAND LOG-------------------
    let mainChannel = client.channels.cache.get("1110555644039286814");
    if (mainChannel) {
      let sub;
      try {
        if (
          client.slashCommands.has(
            interaction.commandName + interaction.options.getSubcommand()
          )
        ) {
          sub = interaction.options.getSubcommand();
        }
      } catch {
        sub = " ";
      }

      mainChannel.send(`
      **__Command Used__**
      Command: **/${interaction.commandName} ${sub}** 
      Guild: ${interaction.guild.name} | ${interaction.guild.id}
      User: ${interaction.user.username} | ${interaction.member.id}
      `);
    }

    //PERMISSION CHECK-----------------------
    if (
      !interaction.channel
        .permissionsFor(interaction.guild.members.me)
        .has(Discord.Permissions.FLAGS.SEND_MESSAGES)
    ) {
      return;
    }

    if (
      !interaction.channel
        .permissionsFor(interaction.guild.members.me)
        .has(Discord.Permissions.FLAGS.VIEW_CHANNEL)
    ) {
      return interaction.reply({
        content:
          "Missing **VIEW CHANNEL** Permission! \n Make sure to provide `Send Messages`, `View Channel`, `Read Message History` permissions to Order It in this channel.",
        ephemeral: true,
      });
    }

    if (
      !interaction.channel
        .permissionsFor(interaction.guild.members.me)
        .has(Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY)
    ) {
      return interaction.reply({
        content:
          "Missing **READ MESSAGE HISTORY** Permission! \n Make sure to provide `Send Messages`, `View Channel`, `Read Message History` permissions to Order It in this channel.",
        ephemeral: true,
      });
    }

    //execute the Command
    command.run(client, interaction, interaction.member, interaction.guild);
  }

  //interaction event

  //--------------------------
};

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

const updateRecentOrders = require("../rotues/updateRecentOrders.route");
const getRecentOrders = require("../rotues/getRecentOrders.route")

module.exports = {
  name: "recent-order",
  description: "Check the recent order you have placed.",
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

      const userId = interaction.user.id; 

     
      const recentOrder = await getRecentOrders(userId)
      if(recentOrder){
         if(recentOrder.orderId !== null) {
        return interaction.reply({
              content: `**__Your recent order which is being prepared is__:** \n**Order Id:** ${recentOrder.orderId} \n**Order:** ${recentOrder.orderInfo}`
            })
        } else {
          return interaction.reply({
            content: `You have no recent order!`
          })
        }
      } else {
        return interaction.reply({
          content: `You have no recent order!`
        })
      }

    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

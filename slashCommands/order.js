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
const getBannedInfo = require("../rotues/getBannedInfo.route")

module.exports = {
  name: "order",
  description: "Order food from our Hotel. [Roleplay]",
  cooldown: 5,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      String: {
        name: "order",
        description: "Please provide your order.",
        required: true,
      },
    },
  ],

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
      
        let bannedStatus = await getBannedInfo(interaction.user.id);
        if(bannedStatus !== null) {
          if(bannedStatus.banned) {
            let bannedReason = bannedStatus.bannedReason;
            return interaction.reply(`**❌ | You have been banned from Order It!** \n**Reason:** ${bannedReason}`)
          }
        }

      const order = options.getString("order");
      if(!order) return interaction.reply({
        content: "Please provide your order!",
        ephemeral: true
      })
      const serverid = String(guildId);

      const OrderChannel = client.channels.cache.get("1119913109432307812");
      if(!OrderChannel) return interaction.reply({
        content: `Error occured while fetching order list channel!`,
        ephemeral: true
      })

      function generateUniqueCode() {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var code = '';
        var length = 5;
      
        for (var i = 0; i < length; i++) {
          var randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
      
        return code;
      }

      const recentOrder = await getRecentOrders(interaction.user.id)
      if(recentOrder) {
        if(recentOrder.orderId !== null) {
        return interaction.reply({
          content: "You already have a order which is being prepared! \nCheck the order by using `/recent-order` command.",
          ephemeral: false
        })
        }
      }
    
      const userId = interaction.user.id;
      const orderId = generateUniqueCode();
      const orderInfo = order;
      const channelID = String(interaction.channel.id);
      const serverId = serverid;

      updateRecentOrders(userId, orderId, orderInfo, channelID, serverId);

      let buttonServe = new MessageButton()
          .setCustomId("serveBtn")
          .setEmoji("✔")
          .setLabel("Serve")
          .setStyle("SUCCESS");
        
        let buttonDeny = new MessageButton()
          .setCustomId("denyBtn")
          .setEmoji("❎")
          .setLabel("Deny")
          .setStyle("DANGER");

          let buttonForceDeny = new MessageButton()
          .setCustomId("forcedenyBtn")
          .setEmoji("❌")
          .setLabel("Force Deny")
          .setStyle("SECONDARY");

          let buttonBanUser = new MessageButton()
          .setCustomId("banUserBtn")
          .setEmoji("🔨")
          .setLabel("Ban")
          .setStyle("PRIMARY");

        let row = new MessageActionRow().addComponents(buttonServe, buttonDeny, buttonForceDeny, buttonBanUser);

        let Embed = new MessageEmbed()
        .setThumbnail("https://cdn.discordapp.com/attachments/865573477448024084/1119896719262486559/pizza-logo-template-suitable-restaurant-cafe-logo_607277-267.png")
        .setTitle("Order Received!")
        .addFields({
          name: `User Id:`,
          value: `${userId}`
        })
        .addFields({
          name: `Username:`,
          value: `${interaction.user.username}`
        })
        .addFields({
          name: `Order:`,
          value: `${orderInfo}`
        })
        .addFields({
          name: `Order Id:`,
          value: `${orderId}`
        })
        .setTimestamp()
        .setColor("#2f3136");

      OrderChannel.send({
          content: "<@&1119905457503490110>",
          embeds: [Embed],
          components: [row],
      })
        //-----------------------------BUTTON ------------------------------

      return interaction.reply({
        content: "**:heart: Thanks for Ordering!** \nYour order has been received and we will prepare your order as soon as possible. \n\n**Order:** `"+ order +"` \n**Order Id:** `"+ orderId +"`"
      })

    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

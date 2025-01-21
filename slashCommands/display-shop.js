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
  const getShopOwner = require("../rotues/getShopsOwner.route");
  const getShopInfo = require("../rotues/getShopsInfo.route");
  const { getVoteCount } = require('../models/Votes');
  
  module.exports = {
    name: "display-shop",
    description: "Displays certain shop which buttons dont expires",
    cooldown: 1,
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],
    options: [
    {
        StringChoices: {
          name: "shop-number",
          description: "Select the shop number to display.",
          required: true,
          choices: [
            ["shop-number-1", "1"],
            ["shop-number-2", "2"],
            ["shop-number-3", "3"],
            ["shop-number-4", "4"],
            ["shop-number-5", "5"],
            ["shop-number-6", "6"],
            ["shop-number-7", "7"],
            ["shop-number-8", "8"],
            ["shop-number-9", "9"],
            ["shop-number-10", "10"],
          ],
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
  
        let serverid = String(guildId);
  
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

        const shopNo = options.getString("shop-number");
        if(!shopNo) return interaction.editReply({
            content: "Please select the shop number!"
        });

        let ownerid = await getShopOwner(serverid, shopNo);
        if(!ownerid) return interaction.editReply({
            content: "Selected Shop don't have any owner!",
            ephemeral: true,
        });
        let owner = await client.users.fetch(ownerid);

        let shop = await getShopInfo(serverid, shopNo);
        if(!shop) return interaction.editReply({
            content: "Selected Shop don't have information!",
            ephemeral: true,
        });
  
        let buttonBuy = new MessageButton()
          .setCustomId("buyBtn")
          .setEmoji("🛒")
          .setLabel("Buy")
          .setStyle("SUCCESS");
        
        let buttonSell = new MessageButton()
          .setCustomId("sellBtn")
          .setEmoji("⚖")
          .setLabel("Sell")
          .setStyle("SUCCESS");

        let row = new MessageActionRow().addComponents(buttonBuy, buttonSell);
        //-----------------------------BUTTON ------------------------------

        let shopinfo = shop;
        
        let extract = extractLinkFromString(shopinfo);

        let premium = false;
        const result = await getVoteCount(ownerid);

      if (result.success) {
        let vote = result.voteCount;
        if(vote >= 15) premium = true;
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
            text: owner.username + "'s shop",
            iconURL: owner.avatarURL({ dynamic: true, format: `png` }),
          });
  
        return interaction.editReply({
            content: `Shop No: '${shopNo}'`,
            embeds: [Embed],
            components: [row],
        })
      
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
  };
  
const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const { redeemCode, addCode } = require('../models/Codes');
const { updateGuildPremiumStatus, getGuildPremiumStatus } = require('../models/Guild');

module.exports = {
  name: "redeem",
  description: "Redeem server premium codes.",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
        String: { 
            name: "code", 
            description: "Provide a valid server premium code to redeem.", 
            required: true 
        }
    },
    {
        StringChoices: {
          name: "confirmation",
          description: "Select NO to cancel and YES to redeem code for this server.",
          required: true,
          choices: [
            ["NO", "no"],
            ["YES", "yes"],
          ],
        },
      },
  ],
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

      const code = options.getString("code"); 
      const confirm = options.getString("confirmation");

      const UserID = interaction.user.id
      const User = interaction.user;


      if(confirm && confirm == "no") {
        return interaction.reply({
            content: "You cancelled the redeem process!"
        })
      }
      if(!code) {
        return interaction.reply({
            content: "Provide a valid server premium code!"
        })
      }
      if(code.length != 8) {
        return interaction.reply({
            content: "Provide a valid server premium code!"
        })
      }
      
      if(code && confirm == "yes") {
        let checkStatus = await getGuildPremiumStatus(guildId);
        if(checkStatus.success && checkStatus.status == "Premium") {
            return interaction.reply({
                content: `This server is **already** a premium server! Use code in any other server. \nREDEEMED BY: <@${checkStatus.userID}>`,
              ephemeral: true
                })
        }

        let result = await redeemCode(code)
        if(result.success) {
          
            let redeemCheck = await updateGuildPremiumStatus(guildId, true, code, UserID) 
            if(redeemCheck.success) {
                interaction.reply({
                    content: `**Successfully redeemed server premium code!** \nSERVER: ${guild.name} | ${guildId} \nREDEEMED BY: ${User.username} | ${UserID} \nCODE: **\`${code}\`**`
                    })

                const channel = client.channels.cache.get("1110556119530750033");
                if(channel) {
                    channel.send({
                        content: `**Successfully redeemed server premium code!** \nSERVER: ${guild.name} | ${guildId} \nREDEEMED BY: ${User.username} | ${UserID} \nCODE: **\`${code}\`**`
                    }) 
                }
                return;
            }
            
        } else {
            return interaction.reply({
            content: `${result.errorMsg}`
            })
        }
      }
      
    // let redeemCheck = await updateGuildPremiumStatus(guildId, false) 
    // if(redeemCheck) {
    //     return interaction.reply({
    //                 content: `Removed premium!`
    //                 }) 
    // } else {
    //     return interaction.reply({
    //         content: `Error!`
    //         }) 
    // }
   
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

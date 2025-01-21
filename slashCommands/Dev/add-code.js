const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { redeemCode, addCode } = require('../../models/Codes');

module.exports = {
  name: "add-code",
  description: "Developer Command!",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: ["428558286992834573", "598524997954306048","727142841754583112"],
  options: [
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

      function generateUniqueCode() {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var code = '';
        var length = 8;
      
        for (var i = 0; i < length; i++) {
          var randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
      
        return code;
      }
      
      var uniqueCode = generateUniqueCode();

      let result = await addCode(uniqueCode)
      if(result.success) {
        return interaction.reply({
          content: `Successfully created server premium code! \nCODE: **\`${uniqueCode}\`**`
        })
      } else {
        return interaction.reply({
          content: `Something went wrong while adding new code!`
        })
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

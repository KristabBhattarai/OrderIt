const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const Discord = require("discord.js");
module.exports = {
  name: "botinfo",
  description: "Provides the full information about the bot.",
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

      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      let TotalMembers = 0;

      client.guilds.cache.forEach((guild) => {
        let Members = guild.memberCount;
        TotalMembers = TotalMembers + Members;
      });

      let mainserver = client.guilds.cache.get("743705988321902643");

      let Kristab = "kristab#1010";
      let checkK = await client.users.fetch("598524997954306048")
      if(checkK) {
        Kristab = checkK.username + " #" + checkK.discriminator
      }

      let Gp = "Gp#8231";
      let checkG = await client.users.fetch("428558286992834573")
      if(checkG) {
        Gp = checkG.username + " #" + checkG.discriminator
      }

      let Sh = "'-' Lucky#1049";
      let checkS = await client.users.fetch("673151369590341646")
      if(checkS) {
        Sh = checkS.username + " #" + checkS.discriminator
      }

      const BotinfoEmbed = new Discord.MessageEmbed()
        .setColor(0x236edf)
        .setTitle("Order It Info")
        .setDescription(
          "Transform your Discord server into a thriving business hub with Order It - the ultimate bot for all your ordering, buying, selling, advertising and hiring needs!"
        )
        .addFields({
          name: "Total Servers",
          value: "```yaml\n" + client.guilds.cache.size + " Servers ```",
          inline: true,
        })
        .addFields({
          name: "Total Members",
          value: "```yaml\n" + TotalMembers + " Users```",
          inline: true,
        })
        .addFields({
          name: "Libary",
          value: "```yaml\nDiscord.js```",
          inline: true,
        })
        .addFields({
          name: "Version",
          value: "```diff\n- V6.1.3```",
          inline: true,
        })
        .addFields({
          name: "Uptime",
          value:
            "```" +
            `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds` +
            "```",
        })
        .addFields({
          name: "Support Server",
          value: "[`Nepal Studio`](https://discord.gg/ef7agGvEza)",
        })
        .addFields({
          name: "__Team__",
          value: `**Head Developer** ❯ ${Kristab} \n**Co-Developer**    ❯ ${Gp} \n**Logo Deginer**   ❯ ${Sh} \n\n**Developed and Powered by: Nepal Studio**`,
        })
        .setThumbnail(client.user.avatarURL())
        .setFooter({
          text: ee.footertext,
          iconURL: ee.footericon,
        });

      return interaction.reply({ embeds: [BotinfoEmbed] }).catch((err) => { });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

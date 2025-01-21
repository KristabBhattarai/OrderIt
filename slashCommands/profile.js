const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
var ee = require("../botconfig/embed.json");

const getOrderProfileInfos = require("../rotues/getOrderProfileInfos");
const getBannedInfo = require("../rotues/getBannedInfo.route")

module.exports = {
  name: "profile", //the command name for the Slash Command
  description: "Gives roleplay informations about user.", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    {
      User: {
        name: "user",
        description: "The user whose information you want.",
        required: false,
      },
    },
  ],
  run: async (client, interaction) => {
    try {
      //console.log(interaction, StringOption)

      //things u can directly access in an interaction!
      
      await interaction.deferReply();
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
     
      let UserOption = options.getUser("user");
      if (!UserOption) UserOption = member.user;
     
      try {
        //await guild.members.fetch();
        const gmember = guild.members.cache.get(UserOption.id);

        let rank = "Customer 🍜";
        const  checkMember = client.guilds.cache.get("743705988321902643").members.cache.get(gmember.user.id)
        if(checkMember) {
          if(checkMember.roles.cache.has("1009104316335923200")) {
            rank = "Owner  | ` 👑 `";
          } else if(checkMember.roles.cache.has("1124299417961373696")) {
            rank = "Hotel Manager  | ` 🔨 `";
          } else if(checkMember.roles.cache.has("1119905457503490110")) {
            rank = "Chef  | ` 👨‍🍳 `";
          } else {
            rank = "Customer  | ` 🍜 `";
          }
        }

        let banned = "No";
        let bannedReason = "";
        let bannedStatus = await getBannedInfo(gmember.user.id);
        if(bannedStatus !== null) {
          if(bannedStatus.banned) {
            bannedReason = bannedStatus.bannedReason;
            banned = `Yes \n**❱ Banned Reason:** ${bannedReason}`;
          } else {
            banned = "No";
          }
        }

        const profile = await getOrderProfileInfos(gmember.user.id);

        let money = 0;
        let totalorder = 0;
        let totalserved = 0;

        if(profile) {
          money = profile.money;
          totalorder = profile.totalOrders;
          totalserved = profile.totalOrdersServed;
        }

        //create the EMBED
        const embeduserinfo = new MessageEmbed();
        embeduserinfo.setThumbnail(
          gmember.user.displayAvatarURL({ dynamic: true, size: 512 })
        );
        embeduserinfo.setAuthor({
          name:
            "Profile Of:   " +
            gmember.user.username,
          iconURL: gmember.user.displayAvatarURL({ dynamic: true }),
          url: "https://discord.gg/fYzWjSHf9v",
        });
        embeduserinfo.setDescription(`**❱ Rank:** ${rank} \n**❱ Money:** ${money} \n**❱ Banned:** ${banned} \n\n**❱ Total Order Placed:** ${totalorder} \n**❱ Total Order Served:** ${totalserved}`)
    
        embeduserinfo.setColor(ee.color);
        embeduserinfo.setFooter({
          text: ee.footertext,
          iconURL: ee.footericon,
        });
        //send the EMBED
        interaction.editReply({ embeds: [embeduserinfo], ephemeral: true });
      } catch (e) {
        
        //ERROR----------------------------------------------------------------
        console.log(e);

        let rank = "Customer 🍜";
        const  checkMember = client.guilds.cache.get("743705988321902643").members.cache.get(UserOption.id)
        if(checkMember) {
          if(checkMember.roles.cache.has("1009104316335923200")) {
            rank = "Owner  | ` 👑 `";
          } else if(checkMember.roles.cache.has("1124299417961373696")) {
            rank = "Hotel Manager  | ` 🔨 `";
          } else if(checkMember.roles.cache.has("1119905457503490110")) {
            rank = "Chef  | ` 👨‍🍳 `";
          } else {
            rank = "Customer  | ` 🍜 `";
          }
        }

        let banned = "No";
        let bannedReason = "";
        let bannedStatus = await getBannedInfo(UserOption.id);
        if(bannedStatus !== null) {
          if(bannedStatus.banned) {
            bannedReason = bannedStatus.bannedReason;
            banned = `Yes \n**❱ Banned Reason:** ${bannedReason}`;
          } else {
            banned = "No";
          }
        }

        const profile = await getOrderProfileInfos(UserOption.id);

        let money = 0;
        let totalorder = 0;
        let totalserved = 0;

        if(profile) {
          money = profile.money;
          totalorder = profile.totalOrders;
          totalserved = profile.totalOrdersServed;
        }

        //create the EMBED
        const embeduserinfo = new MessageEmbed();
        embeduserinfo.setThumbnail(
          UserOption.displayAvatarURL({ dynamic: true, size: 512 })
        );
        embeduserinfo.setAuthor({
          name:
            "Profile Of:   " +
            UserOption.username,
          iconURL: UserOption.displayAvatarURL({ dynamic: true }),
          url: "https://discord.gg/fYzWjSHf9v",
        });
        embeduserinfo.setDescription(`**❱ Rank:** ${rank} \n**❱ Money:** ${money} \n**❱ Banned:** ${banned} \n\n**❱ Total Order Placed:** ${totalorder} \n**❱ Total Order Served:** ${totalserved}`)
       
        embeduserinfo.setColor(ee.color);
        embeduserinfo.setFooter({
          text: ee.footertext,
          iconURL: ee.footericon,
        });
        //send the EMBED
        interaction.editReply({ embeds: [embeduserinfo], ephemeral: true });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

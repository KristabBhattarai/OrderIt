const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const moment = require("moment");
const flags = {
  DISCORD_EMPLOYEE: "Discord Employee",
  DISCORD_PARTNER: "Discord Partner",
  BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
  BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
  HYPESQUAD_EVENTS: "HypeSquad Events",
  HOUSE_BRAVERY: "House of Bravery",
  HOUSE_BRILLIANCE: "House of Brilliance",
  HOUSE_BALANCE: "House of Balance",
  EARLY_SUPPORTER: "Early Supporter",
  TEAM_USER: "Team User",
  SYSTEM: "System",
  VERIFIED_BOT: "Verified Bot",
  VERIFIED_DEVELOPER: "Verified Bot Developer",
};
function trimArray(arr, maxLen = 25) {
  if (Array.from(arr.values()).length > maxLen) {
    const len = Array.from(arr.values()).length - maxLen;
    arr = Array.from(arr.values())
      .sort((a, b) => b.rawPosition - a.rawPosition)
      .slice(0, maxLen);
    arr.map((role) => `<@&${role.id}>`);
    arr.push(`${len} more...`);
  }
  return arr.join(", ");
}
const statuses = {
  online: "🟢",
  idle: "🟠",
  dnd: "🔴",
  offline: "⚫️",
};
module.exports = {
  name: "userinfo", //the command name for the Slash Command
  description: "Gives you information about a User", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
    {
      User: {
        name: "which_user",
        description: "From Which User do you want to get Information from?",
        required: false,
      },
    }, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
      //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
      //const StringOption = options.getString("what_ping"); //same as in StringChoices
      let UserOption = options.getUser("which_user");
      if (!UserOption) UserOption = member.user;
      //let ChannelOption = options.getChannel("OPTIONNAME");
      //let RoleOption = options.getRole("OPTIONNAME");
      try {
        //await guild.members.fetch();
        const member = guild.members.cache.get(UserOption.id);
        const roles = member.roles;
        const userFlags = UserOption.flags.toArray();
        const activity = UserOption.presence?.activities[0];
        //create the EMBED
        const embeduserinfo = new MessageEmbed();
        embeduserinfo.setThumbnail(
          member.user.displayAvatarURL({ dynamic: true, size: 512 })
        );
        embeduserinfo.setAuthor({
          name:
            "Information about:   " +
            member.user.username +
            "#" +
            member.user.discriminator,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
          url: "https://discord.gg/EZDfrer",
        });
        embeduserinfo.addFields({
          name: "**❱ Username:**",
          value: `<@${member.user.id}>\n\`${member.user.tag}\``,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ ID:**",
          value: `\`${member.id}\``,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Avatar:**",
          value: `[\`Link to avatar\`](${member.user.displayAvatarURL({
            format: "png",
          })})`,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Date Join DC:**",
          value:
            "`" +
            moment(member.user.createdTimestamp).format("DD/MM/YYYY") +
            "`\n" +
            "`" +
            moment(member.user.createdTimestamp).format("hh:mm:ss") +
            "`",
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Date Join Guild:**",
          value:
            "`" +
            moment(member.joinedTimestamp).format("DD/MM/YYYY") +
            "`\n" +
            "`" +
            moment(member.joinedTimestamp).format("hh:mm:ss") +
            "`",
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Flags:**",
          value: `\`${
            userFlags.length
              ? userFlags.map((flag) => flags[flag]).join(", ")
              : "None"
          }\``,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Highest Role:**",
          value: `${
            member.roles.highest.id === guild.id ? "None" : member.roles.highest
          }`,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Is a Bot:**",
          value: `\`${member.user.bot ? "✔️" : "❌"}\``,
          inline: true,
        });
        var userstatus = "Not having an activity";
        if (activity) {
          if (activity.type === "CUSTOM_STATUS") {
            let emoji = `${
              activity.emoji
                ? activity.emoji.id
                  ? `<${activity.emoji.animated ? "a" : ""}:${
                      activity.emoji.name
                    }:${activity.emoji.id}>`
                  : activity.emoji.name
                : ""
            }`;
            userstatus = `${emoji} \`${
              activity.state || "Not having an acitivty."
            }\``;
          } else {
            userstatus = `\`${
              activity.type.toLowerCase().charAt(0).toUpperCase() +
              activity.type.toLowerCase().slice(1)
            } ${activity.name}\``;
          }
        }
        embeduserinfo.addFields({
          name: "**❱ Activity:**",
          value: `${userstatus}`,
        });
        embeduserinfo.addFields({
          name: "**❱ Permissions:**",
          value: `${member.permissions
            .toArray()
            .map((p) => `\`${p}\``)
            .join(", ")}`,
        });
        embeduserinfo.addFields({
          name: `❱ [${roles.cache.size}] Roles: `,
          value:
            roles.cache.size < 25
              ? Array.from(roles.cache.values())
                  .sort((a, b) => b.rawPosition - a.rawPosition)
                  .map((role) => `<@&${role.id}>`)
                  .join(", ")
              : roles.cache.size > 25
              ? trimArray(roles.cache)
              : "None",
        });
        embeduserinfo.setColor(ee.color);
        embeduserinfo.setFooter({
          text: ee.footertext,
          iconURL: ee.footericon,
        });
        //send the EMBED
        interaction.editReply({ embeds: [embeduserinfo], ephemeral: true });
      } catch (e) {
        console.log(e);
        const userFlags = UserOption.flags.toArray();
        const activity = UserOption.presence?.activities[0];
        //create the EMBED
        const embeduserinfo = new MessageEmbed();
        embeduserinfo.setThumbnail(
          UserOption.displayAvatarURL({ dynamic: true, size: 512 })
        );
        embeduserinfo.setAuthor({
          name:
            "Information about:   " +
            UserOption.username +
            "#" +
            UserOption.discriminator,
          iconURL: UserOption.displayAvatarURL({ dynamic: true }),
          url: "https://discord.gg/EZDfrer",
        });
        embeduserinfo.addFields({
          name: "**❱ Username:**",
          value: `<@${UserOption.id}>\n\`${UserOption.tag}\``,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ ID:**",
          value: `\`${UserOption.id}\``,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Avatar:**",
          value: `[\`Link to avatar\`](${UserOption.displayAvatarURL({
            format: "png",
          })})`,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Flags:**",
          value: `\`${
            userFlags.length
              ? userFlags.map((flag) => flags[flag]).join(", ")
              : "None"
          }\``,
          inline: true,
        });
        embeduserinfo.addFields({
          name: "**❱ Is a Bot:**",
          value: `\`${UserOption.bot ? "✔️" : "❌"}\``,
          inline: true,
        });
        var userstatus = "Not having an activity";
        if (activity) {
          if (activity.type === "CUSTOM_STATUS") {
            let emoji = `${
              activity.emoji
                ? activity.emoji.id
                  ? `<${activity.emoji.animated ? "a" : ""}:${
                      activity.emoji.name
                    }:${activity.emoji.id}>`
                  : activity.emoji.name
                : ""
            }`;
            userstatus = `${emoji} \`${
              activity.state || "Not having an acitivty."
            }\``;
          } else {
            userstatus = `\`${
              activity.type.toLowerCase().charAt(0).toUpperCase() +
              activity.type.toLowerCase().slice(1)
            } ${activity.name}\``;
          }
        }
        embeduserinfo.addFields({
          name: "**❱ Activity:**",
          value: `${userstatus}`,
        });
        embeduserinfo.addFields({
          name: "**❱ Permissions:**",
          value: `${member.permissions
            .toArray()
            .map((p) => `\`${p}\``)
            .join(", ")}`,
        });
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

const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const getQuestion = require("../rotues/getQuestions.route");
const questionsave = require("../rotues/questionsave.route");
const removeQuestion = require("../rotues/removeQuestion.route");
const saveChannel = require("../rotues/saveChannel.route");
const getChannels = require("../rotues/getChannels.route");
const removeChannels = require("../rotues/removeChannel.route");

const { setTimeout } = require('timers/promises');


module.exports = {
  name: "test",
  description: "Testing different feature for developers only.",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: ["428558286992834573", "598524997954306048"],
  options: [
    {
      String: {
        name: "server-id",
        description: "Server id of the server.",
        required: false,
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

      const serverid = options.getString("server-id");

      if (!serverid) return interaction.reply(`Provide the server id!!`);

      const server = client.guilds.cache.get(serverid);


      if (!server) return interaction.reply(`Server not found!`)

      let defaultChannel = "";

      server.channels.cache.forEach((channel) => {
        if (channel.type == "GUILD_TEXT" && defaultChannel == "") {
          if (channel.permissionsFor(server.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
            defaultChannel = channel;
          }

        }
      })

      let invite = "Dont have perm to create invite";
      if (defaultChannel) {
        if (defaultChannel.permissionsFor(server.me).has(Discord.Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
          invite = await defaultChannel.createInvite({
            maxAge: 0, // 0 = infinite expiration
            maxUses: 0 // 0 = infinite uses
          }).catch(console.error);
        }
      }
      if (!defaultChannel) {
        invite = "No channel found to create invite"
      }


      const serverinfo = new Discord.MessageEmbed()
        .setTitle(`Server info!!`)
        .setColor("GREEN")
        .addFields({
          name: `Server Name:`,
          value: server.name
        })
        .addFields({
          name: `Server Owner:`,
          value: `<@${server.ownerId}>`
        })
        .addFields({
          name: `Server Owner ID:`,
          value: server.ownerId
        })
        .addFields({
          name: `Server Members:`, value: "Total: " + server.memberCount
        })
        .addFields({
          name: `Server Invite Link:`,
          value: "Link: https://discord.gg/" + invite
        })
        .setThumbnail(server.iconURL({ dynamic: true, format: `png` }))
        .setFooter({ text: `Coded by Kristab </> `, iconURL: `https://images-ext-1.discordapp.net/external/sj1pEIWwkL72kH9xf4EwfH_4zUKJD_K88PCWqsJ2qZA/https/cdn.discordapp.com/avatars/598524997954306048/a_8c7734ac1bee91c46fe0818fd238304d.gif` })

      return interaction.reply({ embeds: [serverinfo] })

    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

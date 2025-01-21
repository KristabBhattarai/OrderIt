const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const Discord = require("discord.js");
module.exports = {
  name: "check-owner",
  description: "Gives a special role in the support server to the Server Owner",
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

      const UserID = interaction.user.id

      if(UserID === interaction.guild.ownerId) {
        let server = client.guilds.cache.get("743705988321902643")
        if(server) {
          let Owner = await server.members.fetch(UserID)
          if(Owner) {
            let role = server.roles.cache.get("1009104324137332756")
            if(role) {
              if(Owner.roles.cache.has("1009104324137332756")) {
                return interaction.reply({
                  content: `You already have the role in the server! \nThanks for using Order It in your server.`,
                  ephemeral: false
              })
              }
              Owner.roles.add(role)
             return interaction.reply({
                content: `Successfully added a role in Order It Support Server! \nThanks for using Order It in your server.`,
                ephemeral: false
            })
            } else {
              return interaction.reply({
                content: `Can't find the Role to add! \nPlease report this problem in Order It Support Server: https://discord.gg/ef7agGvEza`,
                ephemeral: true
            }) 
          }
        } else {
          return interaction.reply({
            content: `You are not in the Order It Support Server! \nYou need to join the server and use this command to get a special role in Order It Support server: https://discord.gg/ef7agGvEza`,
            ephemeral: true
        })
      }
      } else {
       return interaction.reply({
          content: `Can't find the Support Server! \nPlease report this problem in Order It Support Server: https://discord.gg/ef7agGvEza`,
          ephemeral: true
      }) 
    }
  } else {
   return interaction.reply({
      content: `You are not the owner of the server! \nYou need to use this command in your own server to get a special role in Order It Support server.`,
      ephemeral: true
  })
}

    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

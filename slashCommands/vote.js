const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    Modal,
    TextInputComponent,
  } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const Discord = require("discord.js");
const { User, addVote, getVoteCount, getLeaderboard, displayLeaderboard } = require('../models/Votes');
const db = require("../localdb")

const ms = require("ms");

module.exports = {
  name: "vote",
  description: "Vote for Order It every 12hr to support.",
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
      
      let Votes = "NaN"
      const result = await getVoteCount(member.id);

          if (result.success) Votes = result.voteCount;
          if(!result.success) console.error(result.error);
   


      let author = await db.get(`votecd_${interaction.user.id}`)

    let timeout = 43200000;
    
    if (author !== null && timeout - (Date.now() - author) > 0) {
      
  let time = ms(timeout - (Date.now() - author));
      
       let button = new MessageButton()
      .setCustomId("timeout")
      .setStyle("DANGER")
      .setLabel(`Top.gg: ${time} Remanining`)
      .setDisabled(true)
       
       let button1 = new MessageButton()
      .setURL("https://top.gg/bot/716257964767445043/")
      .setStyle("LINK")
      .setLabel(`Top.gg Page`)
       
       let row = new MessageActionRow()
      .addComponents(button, button1);
      
      const Embed = new Discord.MessageEmbed()
      .setAuthor({name: `${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
      .setDescription(`Total Votes: ${Votes}`)
      .setColor("RED")
      .setTimestamp()
      .setFooter({text: `You can vote in every 12hours!`})
      .setThumbnail(client.user.avatarURL({ dynamic: true , format: `png` }))
      
     return interaction.reply({embeds: [Embed] , components: [row]})
      
      } else {
    
    // if(message.author.id !== "598524997954306048") return message.reply("This command is being developed! Please wait sometime until its finished.")
        
        let button = new MessageButton()
      .setURL("https://top.gg/bot/716257964767445043/vote")
      .setStyle("LINK")
      .setLabel(`Top.gg: AVAILABLE NOW!`)
        
        let button1 = new MessageButton()
      .setURL("https://top.gg/bot/716257964767445043/")
      .setStyle("LINK")
      .setLabel(`Top.gg Page`)

        
        let row = new MessageActionRow()
        .addComponents(button, button1);
    
        const Embed = new Discord.MessageEmbed()
        .setAuthor({name: `${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
      .setDescription(`Total Votes: ${Votes}`)
      .setColor("GREEN")
      .setTimestamp()
      .setFooter({text: `You can vote in every 12hours!`})
      .setThumbnail(client.user.avatarURL({ dynamic: true , format: `png` }))
      
     return interaction.reply({embeds: [Embed], components: [row]})


      }
      
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

const Discord = require("discord.js");
const settings = require(`./botconfig/settings.json`);
const color = require("colors");

require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongoUri)
  .then(console.log("Database Connected!"));

  const client = new Discord.Client({
  fetchAllMembers: true,
  //restTimeOffset: 0,
  //restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: false,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    //Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activity: {
      name: `Music`,
      type: "LISTENING",
    },
    status: "online",
  },
});
//Define some Global Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);
//Require the Handlers                  Add the antiCrash file too, if its enabled
["events", "commands", "slashCommands", settings.antiCrash ? "antiCrash" : null]
  .filter(Boolean)
  .forEach((h) => {
    require(`./handlers/${h}`)(client);
  });

module.exports = client;
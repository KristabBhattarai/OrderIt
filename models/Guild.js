const mongoose = require('mongoose');
const Discord = require('discord.js');

const guildSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
    unique: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumCode: {
    type: String
  },
  premiumUserID: {
    type: String
  }
});
const Guild = mongoose.model('Guild', guildSchema);
//old
const updateGuildPremiumStatusOld = async (guildID, isPremium) => {
  try {
    let guild = await Guild.findOne({ guildID });

    if (!guild) {
      guild = new Guild({
        guildID,
        isPremium
      });
    } else {
      guild.isPremium = isPremium;
    }

    await guild.save();
    return { success: true };
  } catch (error) {
    return { success: false};
  }
};
//new
const updateGuildPremiumStatus = async (guildID, isPremium, premiumCode, premiumUserID) => {
  try {
    let guild = await Guild.findOne({ guildID });

    if (!guild) {
      guild = new Guild({
        guildID,
        isPremium,
        premiumCode: isPremium ? premiumCode : undefined,
        premiumUserID: isPremium ? premiumUserID : undefined
      });
    } else {
      guild.isPremium = isPremium;
      guild.premiumCode = isPremium ? premiumCode : undefined;
      guild.premiumUserID = isPremium ? premiumUserID : undefined;
    }

    await guild.save();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// Get a guild's premium status old
const getGuildPremiumStatusOld = async (guildID) => {
  try {
    const guild = await Guild.findOne({ guildID });

    if (guild) {
      return { success: true, premium: guild.isPremium};
      console.log('Guild premium status:', guild.isPremium);
    } else {
      return { success: false};
      console.error('Guild not found');
    }
  } catch (error) {
    return { success: false};
    console.error('Error getting guild premium status:', error);
  }
};

//new
const getGuildPremiumStatus = async (guildID) => {
  try {
    const guild = await Guild.findOne({ guildID });

    if (guild) {
      const premiumStatus = guild.isPremium ? 'Premium' : 'Not Premium';
      const premiumUserID = guild.isPremium ? guild.premiumUserID : 'N/A';
      const premiumCode = guild.isPremium ? guild.premiumCode : "N/A";
      return { success: true, status: premiumStatus, userID: premiumUserID, code: premiumCode};
    } else {
      return { success: false};
      console.error('Guild not found');
    }
  } catch (error) {
    return { success: false};
    console.error('Error getting guild premium status:', error);
  }
};

module.exports = { updateGuildPremiumStatus, getGuildPremiumStatus };

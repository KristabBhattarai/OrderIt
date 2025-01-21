const mongoose = require('mongoose');
const Discord = require('discord.js');

const redeemableCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  redeemed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RedeemableCode = mongoose.model('RedeemableCode', redeemableCodeSchema);

// Function to add a redeemable code
async function addCode(code) {
  try {
    const redeemableCode = new RedeemableCode({
      code: code
    });

    await redeemableCode.save();
    console.log('Code added successfully!');
    return { success: true};
    
  } catch (error) {
    console.error('Error while adding code:', error);
    return { success: false};
  }
}

// Function to redeem a code 
async function redeemCode(code) {
  try {
    const redeemableCode = await RedeemableCode.findOne({ code: code });

    if (!redeemableCode) {
      console.log('Invalid code. Code not found.');
      return { success: false, errorMsg: "Invalid code. Code not found."}
    }

    if (redeemableCode.redeemed) {
      console.log('Code already redeemed.');
      return { success: false, errorMsg: "Code already redeemed."}
    }

    redeemableCode.redeemed = true;
    await redeemableCode.save();

    console.log('Code redeemed successfully!');
    return { success: true }
  } catch (error) {
    console.error('Error while redeeming code:', error);
    return { success: false, errorMsg: "Error while redeeming code."}
  }
}

module.exports = { addCode, redeemCode };

const mongoose = require('mongoose');
const Discord = require('discord.js');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  voteCount: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

async function addVote(userId) {
  try {
    let user = await User.findOne({ userId });

    if (!user) {
      // If user doesn't exist, create a new user with the specified userId
      user = new User({ userId });
    }

    // Increment the voteCount field and save the user
    user.voteCount++;
    await user.save();

    return { success: true, message: 'Vote added successfully', user };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Something went wrong' };
  }
}

async function getVoteCount(userId) {
  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, voteCount: user.voteCount };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Something went wrong' };
  }
}


async function getLeaderboard() {
  try {
    // Retrieve the top 10 users from the database and sort them in descending order by voteCount
    const users = await User.find().sort({ voteCount: -1 }).limit(10);

    // Map the users to an array of objects with the userId and voteCount fields
    const leaderboard = users.map(user => ({ userId: user.userId, voteCount: user.voteCount }));

    return { success: true, leaderboard };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Something went wrong' };
  }
}


async function displayLeaderboard(leaderboard, client) {
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Top 10 Votes Leaderboard')
    .setDescription('Vote On Top.gg: https://top.gg/bot/716257964767445043/vote \n\nUsers those voted for Order It on tog.gg:');

  // // Loop through the leaderboard array and fetch the usernames and user tags for each user from the database and Discord API respectively
  for (let i = 0; i < leaderboard.length; i++) {

    const user = await User.findOne({ userId: leaderboard[i].userId });

     const USER = await client.users.fetch(user.userId);

     const username = USER.username ? USER.username : 'Unknown User';
     const tag = USER.discriminator ? USER.discriminator : "0000";

    embed.addFields({ name: `#${i + 1} - ${username} #${tag}`, value: `Votes: ${leaderboard[i].voteCount} ` });
  }
  //console.log(embed)
  return embed;
}

module.exports = { User, addVote, getVoteCount, getLeaderboard, displayLeaderboard };

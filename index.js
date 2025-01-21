const Discord = require("discord.js");
const client = require("./discord-client");
const config = require(`./botconfig/config.json`);
const color = require("colors");
const express = require("express");
const Topgg = require("@top-gg/sdk");
const {
  User,
  addVote,
  getVoteCount,
  getLeaderboard,
  displayLeaderboard,
} = require("./models/Votes");
const db = require("./localdb");
const { AutoPoster } = require("topgg-autoposter");

const app = express();

const api = new Topgg.Api(process.env.topggtoken);
const webhook = new Topgg.Webhook(process.env.topggauth);

app.get("/", (req, res) => {
  res.send("Order It Started Successfully!");
});

const ap = AutoPoster(process.env.topggtoken, client);

ap.on("posted", async () => {});

app.post("/dblwebhook", webhook.middleware(), async (req, res) => {
  // req.vote is your vote object e.g 221221226561929217
  let userid = req.vote.user;
  console.log(`${userid} Voted for Order It!!`);

  // Call the addVote function to add a vote for the user with userId 'abc'
  const result1 = await addVote(userid);

  if (result1.success) {
    //----------------COOLDOWN----------------
    await db.set(`votecd_${userid}`, Date.now());
    //----------------COOLDOWN----------------

    // Call the getVoteCount function to retrieve the vote count for the user with userId 'abc'
    const result2 = await getVoteCount(userid);

    if (result2.success) {
      let Votes = result2.voteCount;
      
      let rewardList = " ";
      try {
      const checkMember = await client.guilds.cache
        .get("743705988321902643")
        .members.fetch(userid);
        if(checkMember) {
          const Guild = client.guilds.cache.get("743705988321902643");
          
           const v5 = Guild.roles.cache.get("1120018392523472976");
          const v10 = Guild.roles.cache.get("1120018520315531387");
          const v15 = Guild.roles.cache.get("1120018574795345991");
          const v20 = Guild.roles.cache.get("1120018631548481639");
          const v25 = Guild.roles.cache.get("1120018752893886574");
          const v30 = Guild.roles.cache.get("1120018801166131240");
          const voterRole = Guild.roles.cache.get("1095307271875080353");
          
           if(Votes >= 1) {
            
            if(!checkMember.roles.cache.has("1095307271875080353")) {
              rewardList = rewardList+`\n**Voter** Role`
            }
            setTimeout(function() {
              checkMember.roles.add(voterRole); 
            }, 2000);
             
          } 
          
          if(Votes >= 5) {
            
            if(!checkMember.roles.cache.has("1120018392523472976")) {
              rewardList = rewardList+`\n**5+ Votes** Role`
            }
            setTimeout(function() {
              checkMember.roles.add(v5); 
            }, 3000);
             
          } 
          
          if(Votes >= 10) {
  
            if(!checkMember.roles.cache.has("1120018520315531387")) {
              rewardList = rewardList+`\n**10+ Votes** Role`
            }
            setTimeout(function() {
               checkMember.roles.add(v10);
            }, 4000);
            
          } 
          
          if(Votes >= 15) {
            
            if(!checkMember.roles.cache.has("1120018574795345991")) {
              rewardList = rewardList+`\n**15+ Votes** Role`
            }
            setTimeout(function() {
               checkMember.roles.add(v15);
            }, 5000);
            
          } 
          
          if(Votes >= 20) {
           
            
            if(!checkMember.roles.cache.has("1120018631548481639")) {
              rewardList = rewardList+`\n**20+ Votes** Role`
            }
            setTimeout(function() {
               checkMember.roles.add(v20);
            }, 6000);
             
          } 
          
          if(Votes >= 25) {
            
            
            if(!checkMember.roles.cache.has("1120018752893886574")) {
              rewardList = rewardList+`\n**25+ Votes** Role`
            }
            setTimeout(function() {
                checkMember.roles.add(v25);
            }, 7000);
           
            
          } 
          
          if(Votes >= 30) {
               
            if(!checkMember.roles.cache.has("1120018801166131240")) {
              rewardList = rewardList+`\n**30+ Votes** Role`
            }
            setTimeout(function() {
               checkMember.roles.add(v30);
            }, 8000);
            
            
          } 
          if(rewardList === " ") {
        rewardList = "None"
      }
          
        } else {
          console.log("Is not a member!")
        }
      } catch (e) {

      if(rewardList === " ") {
        rewardList = "None"
      }
      }
      
      const votingchannel = client.channels.cache.get(`1093814066486710353`);
      if (!votingchannel) return;

      const embed = new Discord.MessageEmbed()
        .setDescription(
          `<@!${userid}>, **Thanks for voting Order It.
  
  Thanks for your great support!!
  
  <@!${userid}> Total Votes: ${Votes}**
  
[Click here to vote Order It!!](https://top.gg/bot/716257964767445043/vote)
  `
        )
        .setTimestamp()
        .setColor(`BLUE`)
      .addFields({
        name: "Reward Received:",
        value: rewardList
      })
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/716257964767445043/1b87f82cdd26cd87d3986b1ea81a91a0.png`
        );

      votingchannel.send({ embeds: [embed] });
    } else {
      console.error(result2.error);
    }
  } else {
    console.error(result1.error);
  }
});

//Start the Bot
client.login(process.env.token);
app.listen(process.env.PORT || 3000);

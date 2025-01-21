const sanitize = require("mongo-sanitize");

const Channel = require("../models/Channels");

const getChannels = async (serverId, moduleName) => {
  try {
    /*
        serverId: 234234234234,
        moduleName: "order",
    */

    const server = sanitize(serverId);
    const name = sanitize(moduleName);

    const channelA = await Channel.findOne({
      serverId: server,
    });

    //server not found
    if (channelA === null) {
      return;
    }

    //get channel id from name and serverid
    const channels = channelA.methods;
    for (let i = 0; i < channels.length; i++) {
      if (channels[i].moduleNames.includes(name)) {
        // console.log(channels[i].channelId);
        return channels[i].channelId;
      }
    }
  } catch (error) {}
};

module.exports = getChannels;

const sanitize = require("mongo-sanitize");

const Channel = require("../models/Channels");

const removeChannels = async (serverId, moduleName) => {
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

    //remove module from channel
    const channels = channelA.methods;

    for (let i = 0; i < channels.length; i++) {
      if (channels[i].moduleNames.includes(name)) {
        //remove that module from channel
        channels[i].moduleNames.splice(
          channels[i].moduleNames.indexOf(name),
          1
        );

        //if no modules left, remove channel
        if (channels[i].moduleNames.length == 0) {
          channels.splice(i, 1);
        }

        channelA.methods = channels;

        await channelA.save();

        break;
      }
    }
  } catch (error) {}
};

module.exports = removeChannels;

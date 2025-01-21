const sanitize = require("mongo-sanitize");

const Channel = require("../models/Channels");

const saveChannel = async (serverid, module, channelid) => {
  try {
    /*
      serverId: "112133545145446"
      module: "ordering"
      channelId: "21654516456456486456"
    */
    const serverId = sanitize(serverid);
    const moduleName = sanitize(module);
    const channelId = sanitize(channelid);

    const channel = await Channel.findOne({
      serverId: serverId,
    });

    //server not found
    if (channel === null) {
      const newChannel = new Channel({
        serverId: serverId,
        methods: [
          {
            moduleNames: [moduleName],
            channelId: channelId,
          },
        ],
      });
      await newChannel.save();
      return;
    }

    //if server exists, check if channel already exists
    const methods = channel.methods;
    let found = false;
    for (let i = 0; i < methods.length; i++) {
      if (methods[i].channelId == channelId) {
        found = true;
        break;
      }
    }
    //if channel doesn't exist, check if module already exists on other channels and if not, add it
    if (!found) {
      let foundModule;

      for (let i = 0; i < methods.length; i++) {
        for (let j = 0; j < methods[i].moduleNames.length; j++) {
          if (methods[i].moduleNames[j] == moduleName) {
            foundModule = true;
            break;
          }
        }
      }

      if (!foundModule) {
        channel.methods.push({
          moduleNames: [moduleName],
          channelId: channelId,
        });
        await channel.save();
      }
    }

    //if channel exists, check if module already exists
    found = false;
    for (let i = 0; i < methods.length; i++) {
      if (methods[i].moduleNames.includes(moduleName)) {
        found = true;
        break;
      }
    }
    //if module doesn't exist, add it
    if (!found) {
      channel.methods[channel.methods.length - 1].moduleNames.push(moduleName);
      await channel.save();
    }

    return;
  } catch (error) {}
};

module.exports = saveChannel;

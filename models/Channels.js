const mongoose = require("mongoose");

const ChannelModel = new mongoose.Schema({
  serverId: {
    type: String,
    required: true,
  },

  methods: [
    {
      moduleNames: [
        {
          type: String,
          required: true,
        },
      ],
      channelId: {
        type: String,
        maxlength: 1000,
        required: true,
      },
    },
  ],
});

module.exports = Channel = mongoose.model("Channel", ChannelModel);

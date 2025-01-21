const mongoose = require("mongoose");

const ShopsInfoModel = new mongoose.Schema({
  serverId: {
    type: String,
  },

  shops: [
    {
      shopNo: {
        type: Number,
        required: true,
      },
      shopInfo: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = ShopsInfo = mongoose.model("ShopsInfo", ShopsInfoModel);

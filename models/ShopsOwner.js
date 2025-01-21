const mongoose = require("mongoose");

const ShopModel = new mongoose.Schema({
  serverId: {
    type: String,
  },

  shops: [
    {
      ownerId: {
        type: String,
        required: true,
      },

      shopNo: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = ShopOwner = mongoose.model("ShopOwner", ShopModel);

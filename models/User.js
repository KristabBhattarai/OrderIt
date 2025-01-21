const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  email: {
    type: String,
    maxLength: 50,
  },

  password: {
    type: String,
    maxLength: 50,
  },
});

module.exports = User = mongoose.model("User", UserModel);

const mongoose = require("mongoose");

const User = mongoose.model("User");

const signUp = async (email, password) => {
  try {
    //check if email exists
    const userExists = await User.findOne({ email: email });

    if (userExists !== null) {
      console.log("User Exists.");
      return;
    }

    const newUser = new User({
      email: email,
      password: password,
    });

    await newUser.save();

    console.log("User added!");
  } catch (error) {
    console.log("Something went wrong!");
  }
};

module.exports = signUp;

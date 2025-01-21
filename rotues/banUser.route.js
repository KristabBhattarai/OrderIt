const Order = require("../models/Order");

const banUser = async (userId, bannedReason) => {
  try {
    // Find the document with the given userId
    const order = await Order.findOne({ userId });

    if (order) {
      // Set the bannedReason and mark user as banned
      order.bannedReason = bannedReason;
      order.banned = true;

      // Save the changes to the document
      await order.save();

      console.log('User banned successfully!');
    } else {
      console.log('No order found for the provided user ID.');
    }
  } catch (error) {
    console.error('Error banning user:', error);
  }
};

module.exports = banUser;
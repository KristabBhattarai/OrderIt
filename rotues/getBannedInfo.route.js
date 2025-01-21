const Order = require("../models/Order")

const getBannedInfo = async (userId) => {
  try {
    // Find the document with the given userId
    const order = await Order.findOne({ userId });

    if (order) {
      const { banned, bannedReason } = order;
      return { banned, bannedReason };
    } else {
      return null; // No document found for the given userId
    }
  } catch (error) {
    return null;
  }
};

  module.exports = getBannedInfo;
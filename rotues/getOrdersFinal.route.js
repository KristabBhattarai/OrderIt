const Order = require("../models/Order")

const getOrdersFinal = async (userId) => {
  try {
    // Find the document with the given userId
    const order = await Order.findOne({ userId });

    if (order) {
      const { orderId, orderInfo, channelId, serverId } = order;
      return { orderId, orderInfo, channelId, serverId };
    } else {
      return null; // No document found for the given userId
    }
  } catch (error) {
   // console.error('Error retrieving order FINAL info:', error);
    return null;
  }
};

  module.exports = getOrdersFinal;
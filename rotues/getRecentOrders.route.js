const Order = require("../models/Order")

const getRecentOrders = async (userId) => {
  try {
    // Find the document with the given userId
    const order = await Order.findOne({ userId });

    if (order) {
      const { orderId, orderInfo } = order;
      return { orderId, orderInfo };
    } else {
      return null; // No document found for the given userId
    }
  } catch (error) {
   // console.error('Error retrieving order info:', error);
    return null;
  }
};

  module.exports = getRecentOrders;
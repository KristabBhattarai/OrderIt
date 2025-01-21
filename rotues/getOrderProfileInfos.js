const Order = require("../models/Order")

const getOrderProfileInfos = async (userId) => {
  try {
    // Find the document with the given userId
    const order = await Order.findOne({ userId });

    if (order) {
      const { totalOrders, totalOrdersServed, money } = order;
      return { totalOrders, totalOrdersServed, money };
    } else {
      return null; // No document found for the given userId
    }
  } catch (error) {
    return null;
  }
};

  module.exports = getOrderProfileInfos;
const Order = require("../models/Order")

const updateRecentOrders = async (userId, orderId, orderInfo, channelId, serverId) => {
  try {
    // Find the document with the given userId
    let order = await Order.findOne({ userId });

    if (!order) {
      // Create a new document if it doesn't exist
      order = new Order({
        userId: userId,
        orderId: orderId,
        orderInfo: orderInfo,
        channelId: channelId,
        serverId: serverId,
      });
    } else {
      // Update the fields for the existing document
      order.orderId = orderId;
      order.orderInfo = orderInfo;
      order.channelId = channelId;
      order.serverId = serverId;
    }

    // Increase totalOrders by 1
    order.totalOrders += 1;

    // Save the changes to the document
    await order.save();

    // console.log('Order updated successfully!');
  } catch (error) {
    // console.error('Error updating order:', error);
  }
};



  module.exports = updateRecentOrders;
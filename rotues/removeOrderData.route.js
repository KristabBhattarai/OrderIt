const Order = require("../models/Order")

const removeOrderData = async (userId) => {
  try {
    // Find the document with the given userId
    const order = await Order.findOne({ userId });

    if (order) {
      // Bypass validation and set the fields to null
      order.set({
        orderId: null,
        orderInfo: null,
        channelId: null,
        serverId: null,
      });

      // Save the changes to the document without validation
      await order.save({ validateBeforeSave: false });

     // console.log('Order data removed successfully!');
    } else {
      //console.log('No order found for the provided user ID.');
    }
  } catch (error) {
   // console.error('Error removing order data:', error);
  }
};


  module.exports = removeOrderData;
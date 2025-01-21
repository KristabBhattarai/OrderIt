const Order = require("../models/Order")

const increaseTotalOrdersServed = async (userId) => {
  try {
    // Find the document with the given userId
    const order = await Order.findOne({ userId });

    if (order) {
      // Increase totalOrdersServed by 1
      order.totalOrdersServed += 1;

      // Save the changes to the document
      await order.save();
    } else {
     // console.log("else Error!")
    }
  } catch (error) {
   // console.error('Error:', error);
  }
};

  module.exports = increaseTotalOrdersServed;
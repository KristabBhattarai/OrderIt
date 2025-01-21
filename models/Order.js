const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalOrders: { type: Number, default: 0 },
  totalOrdersServed: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  orderId: { type: String, required: false },
  orderInfo: { type: String, required: false },
  channelId: { type: String, required: false },
  serverId: { type: String, required: false },
  banned: { type: Boolean, default: false },
  bannedReason: { type: String, default: " "},
});

// Create the order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
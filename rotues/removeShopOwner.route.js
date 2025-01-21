const sanitize = require("mongo-sanitize");

const Shop = require("../models/ShopsOwner");

const removeShopOwner = async (serverId, shopNo) => {
  try {
    /*
        serverId: 234234234234
        qno: 1,
        module: "order",
    */

    const server = sanitize(serverId);
    const shopno = sanitize(parseInt(shopNo));

    const shop = await Shop.findOne({
      serverId: server,
    });
    //server not found
    if (shop === null) {
      return;
    }

    //get questions array
    const shops = shop.shops;

    //get questions without the qno and moduleName
    const shopWithNoOwnerAndId = shops.filter((shop) => {
      return shop.shopNo !== shopno;
    });

    //update the questions array
    shop.shops = shopWithNoOwnerAndId;

    //save the question
    await shop.save();

    return;
  } catch (error) {}
};

module.exports = removeShopOwner;

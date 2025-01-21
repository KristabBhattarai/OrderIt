const sanitize = require("mongo-sanitize");

const Shop = require("../models/ShopsInfo");

const getShopsInfo = async (serverId, shopNo) => {
  try {
    /*
        serverId: "234234234234",
        shops: {
            ownerId: "4524564684",
            shopNo: 1
        } 
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
    let finalShop;
    for (let i = 0; i < shops.length; i++) {
      if (shops[i].shopNo == shopno) {
        return (finalShop = shops[i].shopInfo);
      }
    }
  } catch (error) {}
};

module.exports = getShopsInfo;

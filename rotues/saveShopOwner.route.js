const sanitize = require("mongo-sanitize");

const Shop = require("../models/ShopsOwner");

const saveShopOwner = async (serverid, ownerid, shopno) => {
  try {
    /*
      serverId: "112133545145446"
      shops: {
        ownerId: "ordering",
        shopNo: "1",
      },
    */
    const serverId = sanitize(serverid);
    const ownerId = sanitize(ownerid);
    const shopNo = sanitize(parseInt(shopno));

    const shop = await Shop.findOne({
      serverId: serverId,
    });

    //server not found
    if (shop === null) {
      const newShop = new Shop({
        serverId: serverId,
        shops: [
          {
            ownerId: ownerId,
            shopNo: shopNo,
          },
        ],
      });
      await newShop.save();
      return;
    }

    //if server exists, check if channel already exists
    const shops = shop.shops;
    let found = false;
    for (let i = 0; i < shops.length; i++) {
      if (shops[i].shopNo == shopNo) {
        found = true;
        break;
      }
    }
    //if channel doesn't exist, add it
    if (!found) {
      shop.shops.push({
        ownerId: ownerId,
        shopNo: shopNo,
      });
      await shop.save();
    }

    //if channel exists, check if module already exists
    found = false;
    for (let i = 0; i < methods.length; i++) {
      if (shops[i].shopNo.includes(shopNo)) {
        found = true;
        break;
      }
    }
    //if module doesn't exist, add it
    if (!found) {
      shop.shops[shop.shops.length - 1].ownerId.push(ownerId);
      await shop.save();
    }

    return;
  } catch (error) {}
};

module.exports = saveShopOwner;

const Sequelize = require('sequelize');

const db = new Sequelize('vending', 'Chris', '', {
  dialect: 'postgres',
});

const Items = db.define('items', {
  description: { type: Sequelize.STRING, unique: true, required: true },
  cost: { type: Sequelize.INTEGER, required: true },
  quantity: { type: Sequelize.INTEGER, required: true }
});

const Purchases = db.define('purchases',{
  price: { type: Sequelize.INTEGER, required: true},
  name: {type: Sequelize.STRING, required:true}
});

Purchases.belongsTo(Items);

Purchases.sync().then(function(){
  console.log("purchases DB online");
})

Items.sync().then(function() {
  console.log('Items DB online');
});

function getAllItems() {
    return Items.findAll();
}

function getAllPucheses(){
    return Purchases.findAll();
}
// test all the things

function getItById(itemId){
  return Items.find({where:{id:itemId}})
    .then(function(item){
      if (item === null) {
        return Promise.reject('item not found');
      } else {
        return item;
      }
    })
    .catch(function(err){
      return {
        status: "fail",
        message: err,
        itemId: itemId,
      };
    })
}

function buyItem(itemId,moneyIn){
  return getItById(itemId).then(function(item) {
    if(moneyIn >= item.cost && item.quantity > 0){
      updateQuantity(itemId).then()
      addPurchasesRecord(itemId).then()
      return {
        status: "success",
        itemId: itemId,
        name: item.description,
        changeBack: moneyIn - item.cost
        };
    }else if (moneyIn < item.cost) {
      return {
        status: "fail",
        itemId: itemId,
        name: item.description,
        moneyIn: moneyIn
        };
    }else{
      return Promise.reject('Unknown error');
    }
  })
}

function updateQuantity(itemId){
  return getItById(itemId).then(function(item){
    let quantity = item.quantity;
    Items.update({quantity: quantity - 1}, { where: { id: itemId }})
    return
  })
}

function addPurchasesRecord(itemId){
  return getItById(itemId).then(function(item){
    Purchases.create({
      name: item.description,
      price: item.cost,
      itemId: itemId
    }).then()
  })
}

// above is tested and working

function newItem(description, cost, quantity){
  Items.create({
    description: description,
    cost: cost,
    quantity: quantity
  }).then(function() {
    return {
      status: "success",
      message: "Item added"
    };
  }).catch(function(err) {
    console.log(err);
  });
};

function updateItem(itemId,description,cost,quantity){
  Items.update({
    description: description,
    cost: cost,
    quantity: quantity
  },{
    where:{id:itemId}
  }).then(function(){
    console.log("success")
    return {
      status: "success",
      message: "Item updated"
    };
    
  }).catch(function(err){
    console.log(err);
  });
};

module.exports = {
  //functions dealing with inventory
    getAllItems: getAllItems,
    getItById: getItById,
    buyItem: buyItem,
    updateQuantity: updateQuantity,
    addPurchasesRecord: addPurchasesRecord,
    getAllPucheses: getAllPucheses,
    newItem: newItem,
    updateItem: updateItem,
};

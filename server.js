const express = require('express');
const Sequelize = require('sequelize');
const server = express();
const bodyparse = require('body-parser');
server.use(bodyparse.urlencoded({
  extended: false
}));
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

server.listen(3000, function() {
  console.log('Vending the API');
});

// CUSTOMER STUFF

// get list of all items that a customer can buy
server.get('/api/customer/items', function(req, res) {
  Items.findAll()
    .then(function(items) {
      res.json(items);
    });
});

// customer buy item with ID = itemId.
server.post('/api/customer/items/:itemId/purchases', function(req, res) {
  const itemId = parseInt(req.params.itemId);
  const moneyIn = req.body.moneyIn;
  let changeBack = 0;
  Items.find({where: {id: itemId}})
    .then(function(item) {
      if (moneyIn >= item.cost) {
        let quantity = item.quantity;
       changeBack = moneyIn - item.cost;
        res.json({
          "message": "success",
          "itemId": itemId,
          "name": item.description,
          "changeBack": changeBack
        });
        Items.update({quantity:quantity-1},{where:{id:itemId}}).then() // Mike help me why error???
        Purchases.create({name: item.description, price: item.cost, itemId: itemId}).then()
        return;
      } else {
        return res.json({
          "message": "fail",
          "itemId": itemId,
          "name": item.description,
          "cost": item.cost,
          "moneyIn": moneyIn
        });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.json({
        "message": "fail not in Database",
        "itemId": itemId,
        "moneyIn": moneyIn
      })
    })
});

//purchases DB
// A vendor should be able to see total amount of money in machine
// A vendor should be able to see a list of all purchases with their time of purchase

// items DB
// A vendor should be able to update the description, quantity, and costs of items in the machine
// A vendor should be able to add a new item to the machine
// VENDOR STUFF

// GET /api/vendor/purchases - get a list of all purchases with their item and date/time

server.get('/api/vendor/purchases', function(req, res) {
  Purchases.findAll()
    .then(function(purchases){
      res.json(purchases);
    });
});

// GET /api/vendor/money - get a total amount of money accepted by the machine
server.get('/api/vendor/money', function(req, res) {
  Purchases.findAll()
    .then(function(purchases){
      let total = 0;
      for (var i = 0; i < purchases.length; i++) {
        total += purchases[i].price
      }
      res.json({
        "NumOfItems": purchases.length,
        "grandTotal": total
      });
    });
});

// POST /api/vendor/items - add a new item not previously existing in the machine
server.post('/api/vendor/items', function(req, res) {
  const description = req.body.name;
  const cost = parseInt(req.body.price);
  const quantity = parseInt(req.body.quantity);
  Items.create({
    description: description,
    cost: cost,
    quantity: quantity
  }).then(function () {
    res.json({
      "message":"success"
    });
  }).catch(function (err) {
    console.log(err);
  });
});



// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
server.put('/api/vendor/items/:itemId', function(req, res) {
  const itemId = parseInt(req.params.itemId);
  const description = req.body.name;
  const cost = parseInt(req.body.price);
  const quantity = parseInt(req.body.quantity);
  Items.update({description: description, cost: cost, quantity: quantity},{where:{id:itemId}})
    .then(function() {
      res.json({"message":"success"})
  })
});

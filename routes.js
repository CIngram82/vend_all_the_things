//// Teasting all info under this line.

const inventory = require('./inventory');
// CUSTOMER STUFF
function createRoutes(server) {
  // get list of all items that a customer can buy
  server.get('/api/customer/items', function(req, res) {
    inventory.getAllItems().then(function(items) {
        res.json(items);
      });
  });

  // customer buy item with ID = itemId.
  server.post('/api/customer/items/:itemId/purchases', function(req, res) {
    const itemId = parseInt(req.params.itemId);
    const moneyIn = req.body.moneyIn;
    buyItem(itemId,moneyIn).then(function(message){
      res.json(message)
      updateQuantity(itemId).then(function(){
        addPurchasesRecord(itemId).then()
      })
    })
  });

  // GET /api/vendor/purchases - get a list of all purchases with their item and date/time
  server.get('/api/vendor/purchases', function(req, res) {
    Purchases.findAll()
      .then(function(purchases) {
        res.json(purchases);
      });
  });

  // GET /api/vendor/money - get a total amount of money accepted by the machine
  server.get('/api/vendor/money', function(req, res) {
    Purchases.findAll()
      .then(function(purchases) {
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

    inventory.newItem(description,cost,quantity).then({

    })
    
    Items.create({
      description: description,
      cost: cost,
      quantity: quantity
    }).then(function() {
      res.json({
        "message": "success"
      });
    }).catch(function(err) {
      console.log(err);
    });
  });

  // PUT /api/vendor/items/:itemId - update item quantity, description, and cost
  server.put('/api/vendor/items/:itemId', function(req, res) {
    const itemId = parseInt(req.params.itemId);
    const description = req.body.name;
    const cost = parseInt(req.body.price);
    const quantity = parseInt(req.body.quantity);
    Items.update({
        description: description,
        cost: cost,
        quantity: quantity
      }, {
        where: {
          id: itemId
        }
      })
      .then(function() {
        res.json({
          "message": "success"
        })
      })
  });
};

module.exports = createRoutes;

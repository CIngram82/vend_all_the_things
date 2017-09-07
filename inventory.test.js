const inventory = require('./inventory');

test('Getting Item by the itemId',function(){
  return inventory.getItById(3).then(function (item){
    expect(item.description).toBe('coke 12oz can');
    expect(item.cost).toBe(85);
    expect(item.quantity).toBe(11);
  })
})

test('Getting error when getting item by itemId not in system',function(){
  return inventory.getItById(333).then(function (item){
    expect(item.status).toBe("fail");
    expect(item.message).toBe("item not found");
    expect(item.itemId).toBe(333);
  })
})

test('Buy an item with right amount',function(){
  return inventory.buyItem(3,85).then(function(message){
    expect(message.status).toBe("success");
    expect(message.itemId).toBe(3);
    expect(message.changeBack).toBe(0);
  });
});

test('Buy an item with to much money',function(){
  return inventory.buyItem(3,100).then(function(message){
    expect(message.status).toBe("success");
    expect(message.itemId).toBe(3);
    expect(message.changeBack).toBe(15);
  });
});

test('Buy an item with to little money',function(){
  return inventory.buyItem(3,50).then(function(message){
    expect(message.status).toBe("fail");
    expect(message.itemId).toBe(3);
    expect(message.moneyIn).toBe(50);
  });
});

test('reduce an item count inventory by 1', function(){
  let startingCount;
  return inventory.getItById(3).then(function(item){
    startingCount = item.quantity;
    expect(startingCount).toBe(10);
    inventory.updateQuantity(3).then(function(){
      inventory.getItById(3).then(function(item){
        expect(item.quantity).toBe(startingCount-1)
      })
    })
  })
})

test('add a purchase record',function(){
  let startingCount;
  return inventory.getAllPucheses().then(function(list){
    startingCount = list.length;
    expect(startingCount).toBe(4);
    inventory.addPurchasesRecord(9).then(function(){
      inventory.getAllPucheses().then(function(list){
        expect(list.length).tobe(startingCount+1)
      })
  })
  })
})

var assert = require("assert");

const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract("StarNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it("can Create a Star", async () => {
  let tokenId = 1;
  let instance = await StarNotary.deployed();
  await instance.createStar("Awesome Star!", tokenId, { from: accounts[0] });
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), "Awesome Star!");
});

it("lets user1 put up their star for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let starId = 2;
  let starPrice = web3.utils.toWei(".01", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it("lets user1 get the funds after the sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 3;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
  await instance.buyStar(starId, { from: user2, value: balance });
  let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
  let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
  let value2 = Number(balanceOfUser1AfterTransaction);
  assert.equal(value1, value2);
});

it("lets user2 buy a star, if it is put up for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 4;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.buyStar(starId, { from: user2, value: balance });
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it("lets user2 buy a star and decreases its balance in ether", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 5;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
  const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
  let value =
    Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
  assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it("can add the star name and star symbol properly", async () => {
  let user1 = accounts[0];
  let starId = 6;
  let instance = await StarNotary.deployed();
  // 1. create a Star with different tokenId
  await instance.createStar("awesome star", starId, { from: user1 });
  //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  let name = "Non-Fungible-Token";
  let symbol = "NFT";
  assert.equal(await instance.name(), name);
  assert.equal(await instance.symbol(), symbol);
});

it("lets 2 users exchange stars", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[0];
  let user2 = accounts[1];
  let starId1 = 7;
  let starId2 = 8;
  // 1. create 2 Stars with different tokenId
  await instance.createStar("awesome star", starId1, {
    from: user1,
  });
  await instance.createStar("awesome star 2", starId2, {
    from: user2,
  });
  let ownerToken1BeforeTx = await instance.ownerOf(starId1);
  let ownerToken2BeforeTx = await instance.ownerOf(starId2);
  // 2. Call the exchangeStars functions implemented in the Smart Contract
  await instance.exchangeStars(starId1, starId2);
  // 3. Verify that the owners changed
  let ownerToken1AfterTx = await instance.ownerOf(starId1);
  let ownerToken2AfterTx = await instance.ownerOf(starId2);
  assert.equal(ownerToken1BeforeTx, ownerToken2AfterTx);
  assert.equal(ownerToken2BeforeTx, ownerToken1AfterTx);
});

it("lets a user transfer a star", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[0];
  let starId = 9;
  // 1. create a Star with different tokenId
  await instance.createStar("awesome star", starId, {
    from: user1,
  });
  let ownerTokenBeforeTx = await instance.ownerOf(starId);
  // 2. use the transferStar function implemented in the Smart Contract
  await instance.transferStar(accounts[1], starId);
  // 3. Verify the star owner changed.
  let ownerTokenAfterx = await instance.ownerOf(starId);
  assert.notEqual(ownerTokenBeforeTx, ownerTokenAfterx);
});

it("lookUptokenIdToStarInfo test", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[0];
  let starId = 10;
  let tokenName = "awesome star";
  // 1. create a Star with different tokenId
  await instance.createStar(tokenName, starId, {
    from: user1,
  });
  // 2. Call your method lookUptokenIdToStarInfo
  let name = await instance.lookUptokenIdToStarInfo(starId);
  // 3. Verify if you Star name is the same
  assert.equal(tokenName, name);
});

const TicketMarketplace = artifacts.require("TicketMarketplace");

module.exports = function (deployer) {
  // Deploy TicketMarketplace
  deployer.deploy(TicketMarketplace);
};

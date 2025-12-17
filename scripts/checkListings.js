const TicketMarketplace = artifacts.require("TicketMarketplace");
const EventTicket = artifacts.require("EventTicket");

module.exports = async function(callback) {
  try {
    const marketplace = await TicketMarketplace.deployed();
    const eventTicket = await EventTicket.deployed();

    console.log("Marketplace:", marketplace.address);
    console.log("EventTicket:", eventTicket.address);

    const listingCounter = await marketplace.listingCounter();
    console.log("\nTotal listings created:", listingCounter.toString());

    for (let i = 0; i < listingCounter; i++) {
      const listing = await marketplace.listings(i);
      console.log(`\nListing ${i}:`);
      console.log("  Seller:", listing.seller);
      console.log("  Ticket Contract:", listing.ticketContract);
      console.log("  Token ID:", listing.tokenId.toString());
      console.log("  Price:", web3.utils.fromWei(listing.price.toString(), 'ether'), "ETH");
      console.log("  Active:", listing.active);
    }

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};

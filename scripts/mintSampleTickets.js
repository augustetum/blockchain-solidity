const EventTicket = artifacts.require("EventTicket");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const eventTicket = await EventTicket.deployed();

    console.log("Minting sample tickets...");
    console.log("Contract address:", eventTicket.address);
    console.log("Owner account:", accounts[0]);

    // Sample tickets to mint (to the first account)
    const sampleTickets = [
      { to: accounts[0], seat: "VIP-A-15" },
      { to: accounts[0], seat: "VIP-A-16" },
      { to: accounts[0], seat: "Section-B-23" },
      { to: accounts[1], seat: "VIP-C-8" },
      { to: accounts[1], seat: "Section-D-45" },
    ];

    for (let i = 0; i < sampleTickets.length; i++) {
      const ticket = sampleTickets[i];
      console.log(`\nMinting ticket ${i + 1}: ${ticket.seat} to ${ticket.to}`);

      const tx = await eventTicket.ownerMint(ticket.to, ticket.seat, { from: accounts[0] });
      console.log(`✓ Minted! Token ID: ${i}, Transaction: ${tx.tx}`);
    }

    console.log("\n✅ All sample tickets minted successfully!");
    console.log(`\nAccount ${accounts[0]} has ${sampleTickets.filter(t => t.to === accounts[0]).length} tickets`);
    console.log(`Account ${accounts[1]} has ${sampleTickets.filter(t => t.to === accounts[1]).length} tickets`);

    callback();
  } catch (error) {
    console.error("Error minting tickets:", error);
    callback(error);
  }
};

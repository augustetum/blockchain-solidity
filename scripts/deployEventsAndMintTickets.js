const EventTicket = artifacts.require("EventTicket");
const TicketMarketplace = artifacts.require("TicketMarketplace");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const marketplace = await TicketMarketplace.deployed();

    console.log("\n========== Deploying Event Ticket Contracts ==========");
    console.log("Marketplace:", marketplace.address);
    console.log("Owner account:", accounts[0]);

    // Define all mock events matching the frontend
    const events = [
      {
        name: "Jessica Shy | Vingio Parkas",
        date: "2025-08-29",
        price: web3.utils.toWei("0.085", "ether"),
        maxTickets: 50,
        sampleSeats: ["VIP-A-1", "VIP-A-2", "VIP-B-15", "Section-C-23", "Section-D-45"]
      },
      {
        name: "Vaidas Baumila | Žalgirio arena",
        date: "2025-12-28",
        price: web3.utils.toWei("0.039", "ether"),
        maxTickets: 150,
        sampleSeats: ["Floor-A-12", "Floor-A-13", "Balcony-B-8", "Balcony-C-21"]
      },
      {
        name: "JUODAS VILNIUS 2026",
        date: "2026-06-13",
        price: web3.utils.toWei("0.05", "ether"),
        maxTickets: 250,
        sampleSeats: ["GA-001", "GA-002", "GA-003", "VIP-1", "VIP-2", "VIP-3"]
      },
      {
        name: "Kings of Leon | The only show in the region",
        date: "2026-06-14",
        price: web3.utils.toWei("0.087", "ether"),
        maxTickets: 120,
        sampleSeats: ["Pit-A-5", "Pit-A-6", "Section-101-12", "Section-102-8"]
      },
      {
        name: "Andrius Mamontovas: TIK HITAI",
        date: "2026-03-20",
        price: web3.utils.toWei("0.029", "ether"),
        maxTickets: 120,
        sampleSeats: ["Row-A-10", "Row-A-11", "Row-B-15", "Row-C-20"]
      },
      {
        name: "punktò ~ KAUNAS",
        date: "2025-12-12",
        price: web3.utils.toWei("0.02", "ether"),
        maxTickets: 100,
        sampleSeats: ["Standing-001", "Standing-002", "Standing-003"]
      }
    ];

    const deployedContracts = [];

    // Deploy and setup each event
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      console.log(`\n[${i + 1}/${events.length}] Deploying: ${event.name}`);

      // Deploy new EventTicket contract
      const ticketContract = await EventTicket.new(
        event.name,
        event.date,
        event.price,
        event.maxTickets,
        { from: accounts[0] }
      );

      console.log(`  ✓ Contract deployed at: ${ticketContract.address}`);

      // Approve on marketplace
      const approveTx = await marketplace.approveContract(ticketContract.address, { from: accounts[0] });
      console.log(`  ✓ Approved on marketplace (tx: ${approveTx.tx})`);

      // Mint sample tickets
      console.log(`  Minting ${event.sampleSeats.length} sample tickets...`);

      const mintedTokenIds = [];
      for (let j = 0; j < event.sampleSeats.length; j++) {
        const seat = event.sampleSeats[j];
        // Mint to first account (80%) and second account (20%)
        const recipient = j < Math.ceil(event.sampleSeats.length * 0.8) ? accounts[0] : accounts[1];

        const mintTx = await ticketContract.ownerMint(recipient, seat, { from: accounts[0] });

        // Get token ID from event logs
        const tokenId = mintTx.logs[0].args.tokenId.toString();
        mintedTokenIds.push({ tokenId, seat, recipient });

        console.log(`    • Token #${tokenId}: ${seat} → ${recipient === accounts[0] ? 'Account 0' : 'Account 1'}`);
      }

      deployedContracts.push({
        eventName: event.name,
        address: ticketContract.address,
        mintedCount: mintedTokenIds.length,
        tokens: mintedTokenIds
      });

      console.log(`  ✓ Minted ${mintedTokenIds.length} tickets`);
    }

    console.log("\n========== Deployment Summary ==========");
    console.log(`Total Events: ${deployedContracts.length}`);
    console.log(`Marketplace: ${marketplace.address}`);
    console.log("\nEvent Contracts:");

    deployedContracts.forEach((contract, i) => {
      console.log(`\n${i + 1}. ${contract.eventName}`);
      console.log(`   Address: ${contract.address}`);
      console.log(`   Tickets Minted: ${contract.mintedCount}`);
    });

    console.log("\n========== Copy This to Web3Context.jsx ==========");
    console.log("\nconst CONTRACTS = {");
    console.log("  ganache: {");
    console.log(`    marketplace: '${marketplace.address}',`);
    console.log("    eventTickets: [");
    deployedContracts.forEach((contract, i) => {
      const comma = i < deployedContracts.length - 1 ? ',' : '';
      console.log(`      { name: "${contract.eventName}", address: "${contract.address}" }${comma}`);
    });
    console.log("    ]");
    console.log("  },");
    console.log("  sepolia: {");
    console.log("    marketplace: null,");
    console.log("    eventTickets: []");
    console.log("  }");
    console.log("};");

    console.log("\n========== Next Steps ==========");
    console.log("1. Copy the code block above into frontend/blockchain/src/context/Web3Context.jsx");
    console.log("2. Replace the CONTRACTS constant with the code above");
    console.log("3. Start your frontend: cd frontend/blockchain && npm run dev");
    console.log("4. Connect MetaMask and start listing tickets!");

    console.log("\n✅ Setup complete!");

    callback();
  } catch (error) {
    console.error("\n❌ Error during setup:", error);
    callback(error);
  }
};

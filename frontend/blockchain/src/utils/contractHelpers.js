import { ethers } from 'ethers';

/**
 * Event Ticket Contract Interactions
 */

// Mint a new ticket
export async function mintTicket(contract, toAddress, seatNumber, ticketPrice) {
  try {
    const tx = await contract.mintTicket(toAddress, seatNumber, {
      value: ethers.parseEther(ticketPrice.toString())
    });
    const receipt = await tx.wait();
    console.log('Ticket minted:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error minting ticket:', error);
    throw error;
  }
}

// Get ticket information
export async function getTicketInfo(contract, tokenId) {
  try {
    const info = await contract.getTicketInfo(tokenId);
    return {
      eventName: info[0],
      eventDate: info[1],
      seatNumber: info[2],
      owner: info[3]
    };
  } catch (error) {
    console.error('Error getting ticket info:', error);
    throw error;
  }
}

// Get event details
export async function getEventDetails(contract) {
  try {
    const [eventName, eventDate, ticketPrice, maxTickets, totalSupply] = await Promise.all([
      contract.eventName(),
      contract.eventDate(),
      contract.ticketPrice(),
      contract.maxTickets(),
      contract.totalSupply()
    ]);

    return {
      eventName,
      eventDate,
      ticketPrice: ethers.formatEther(ticketPrice),
      maxTickets: Number(maxTickets),
      totalSupply: Number(totalSupply),
      availableTickets: Number(maxTickets) - Number(totalSupply)
    };
  } catch (error) {
    console.error('Error getting event details:', error);
    throw error;
  }
}

// Get tickets owned by an address for a single contract
export async function getOwnedTickets(contract, ownerAddress) {
  try {
    const totalSupply = await contract.totalSupply();
    const tickets = [];

    for (let i = 0; i < totalSupply; i++) {
      try {
        const owner = await contract.ownerOf(i);
        if (owner.toLowerCase() === ownerAddress.toLowerCase()) {
          const info = await getTicketInfo(contract, i);
          tickets.push({
            tokenId: i,
            contractAddress: contract.target || contract.address,
            ...info
          });
        }
      } catch (error) {
        // Token might not exist or burned
        continue;
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error getting owned tickets:', error);
    throw error;
  }
}

// Get all tickets owned by an address across all event contracts
export async function getAllOwnedTickets(eventTicketsArray, ownerAddress) {
  try {
    const allTickets = [];

    for (const eventTicket of eventTicketsArray) {
      const tickets = await getOwnedTickets(eventTicket.contract, ownerAddress);
      // Add event name to each ticket
      const ticketsWithEvent = tickets.map(ticket => ({
        ...ticket,
        eventContractName: eventTicket.name,
        contractAddress: eventTicket.address
      }));
      allTickets.push(...ticketsWithEvent);
    }

    return allTickets;
  } catch (error) {
    console.error('Error getting all owned tickets:', error);
    throw error;
  }
}

// Approve marketplace to transfer ticket
export async function approveTicketTransfer(contract, marketplaceAddress, tokenId) {
  try {
    const tx = await contract.approve(marketplaceAddress, tokenId);
    const receipt = await tx.wait();
    console.log('Ticket approved for transfer:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error approving ticket:', error);
    throw error;
  }
}

/**
 * Marketplace Contract Interactions
 */

// List a ticket for sale
export async function listTicket(contract, ticketContractAddress, tokenId, priceInEth) {
  try {
    const priceWei = ethers.parseEther(priceInEth.toString());
    const tx = await contract.listTicket(ticketContractAddress, tokenId, priceWei);
    const receipt = await tx.wait();

    // Get listing ID from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'TicketListed';
      } catch {
        return false;
      }
    });

    const listingId = event ? contract.interface.parseLog(event).args.listingId : null;

    console.log('Ticket listed:', receipt);
    return { receipt, listingId };
  } catch (error) {
    console.error('Error listing ticket:', error);
    throw error;
  }
}

// Buy a listed ticket
export async function buyTicket(contract, listingId) {
  try {
    // Get listing details first to know the price
    const listing = await contract.listings(listingId);

    if (!listing.active) {
      throw new Error('Listing is not active');
    }

    const tx = await contract.buyTicket(listingId, {
      value: listing.price
    });
    const receipt = await tx.wait();
    console.log('Ticket purchased:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error buying ticket:', error);
    throw error;
  }
}

// Cancel a listing
export async function cancelListing(contract, listingId) {
  try {
    const tx = await contract.cancelListing(listingId);
    const receipt = await tx.wait();
    console.log('Listing cancelled:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error cancelling listing:', error);
    throw error;
  }
}

// Get listing details
export async function getListingDetails(contract, listingId) {
  try {
    const listing = await contract.listings(listingId);
    return {
      seller: listing.seller,
      ticketContract: listing.ticketContract,
      tokenId: Number(listing.tokenId),
      price: ethers.formatEther(listing.price),
      priceWei: listing.price,
      active: listing.active
    };
  } catch (error) {
    console.error('Error getting listing details:', error);
    throw error;
  }
}

// Get all active listings
export async function getActiveListings(contract) {
  try {
    const listingCounter = await contract.listingCounter();
    const listings = [];

    for (let i = 0; i < listingCounter; i++) {
      try {
        const listing = await getListingDetails(contract, i);
        if (listing.active) {
          listings.push({
            listingId: i,
            ...listing
          });
        }
      } catch (error) {
        continue;
      }
    }

    return listings;
  } catch (error) {
    console.error('Error getting active listings:', error);
    throw error;
  }
}

// Get active listings for a specific event contract
export async function getEventListings(marketplaceContract, eventTicketContract, eventContractAddress) {
  try {
    const listingCounter = await marketplaceContract.listingCounter();
    const listings = [];

    for (let i = 0; i < listingCounter; i++) {
      try {
        const listing = await getListingDetails(marketplaceContract, i);
        if (listing.active && listing.ticketContract.toLowerCase() === eventContractAddress.toLowerCase()) {
          // Get ticket info from the event contract
          const ticketInfo = await getTicketInfo(eventTicketContract, listing.tokenId);

          listings.push({
            listingId: i,
            ...listing,
            ...ticketInfo
          });
        }
      } catch (error) {
        continue;
      }
    }

    return listings;
  } catch (error) {
    console.error('Error getting event listings:', error);
    throw error;
  }
}

// Get listings by seller
export async function getSellerListings(contract, sellerAddress) {
  try {
    const listingCounter = await contract.listingCounter();
    const listings = [];

    for (let i = 0; i < listingCounter; i++) {
      try {
        const listing = await getListingDetails(contract, i);
        if (listing.seller.toLowerCase() === sellerAddress.toLowerCase()) {
          listings.push({
            listingId: i,
            ...listing
          });
        }
      } catch (error) {
        continue;
      }
    }

    return listings;
  } catch (error) {
    console.error('Error getting seller listings:', error);
    throw error;
  }
}

/**
 * Utility functions
 */

// Format address for display (0x1234...5678)
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format price
export function formatPrice(priceInEth) {
  return `${parseFloat(priceInEth).toFixed(4)} ETH`;
}

// Parse error message
export function parseError(error) {
  if (error.reason) return error.reason;
  if (error.message) {
    if (error.message.includes('user rejected')) {
      return 'Transaction was rejected';
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
    return error.message;
  }
  return 'An unknown error occurred';
}

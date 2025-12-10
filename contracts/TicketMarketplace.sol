// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TicketMarketplace {
    address public owner;

    struct Listing {
        address seller;
        address ticketContract; //Pardavėjo kontraktas (Bilietai.lt, )
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    mapping(address => bool) public approvedContracts;

    event TicketListed(uint256 listingId, address seller, uint256 price);
    event TicketSold(uint256 listingId, address buyer);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function approveContract(address _ticketContract) external onlyOwner {
        approvedContracts[_ticketContract] = true;
    }

    function listTicket(address _ticketContract, uint256 _tokenId, uint256 _price) external {
        require(approvedContracts[_ticketContract], "Contract not approved");
        require(IERC721(_ticketContract).ownerOf(_tokenId) == msg.sender, "Not ticket owner");

        listings[listingCounter] = Listing({
            seller: msg.sender,
            ticketContract: _ticketContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        });

        emit TicketListed(listingCounter, msg.sender, _price);
        listingCounter++;
    }

    function buyTicket(uint256 _listingId) external payable {
        Listing storage listing = listings[_listingId];

        require(listing.active, "Not active");
        require(msg.value == listing.price, "Wrong price");

        listing.active = false;

        IERC721(listing.ticketContract).transferFrom(listing.seller, msg.sender, listing.tokenId);

        (bool success, ) = payable(listing.seller).call{value: listing.price}("");
        require(success, "Payment failed");

        emit TicketSold(_listingId, msg.sender);
    }

    function cancelListing(uint256 _listingId) external {
        require(listings[_listingId].seller == msg.sender, "Not your listing");
        listings[_listingId].active = false;
    }
}
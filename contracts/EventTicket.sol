// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicket is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    string public eventName;
    string public eventDate;
    uint256 public ticketPrice;
    uint256 public maxTickets;

    mapping(uint256 => string) public seatNumbers;

    event TicketMinted(address indexed buyer, uint256 tokenId, string seatNumber);

    constructor(
        string memory _eventName,
        string memory _eventDate,
        uint256 _ticketPrice,
        uint256 _maxTickets
    ) ERC721(_eventName, "TKT") Ownable(msg.sender) {
        eventName = _eventName;
        eventDate = _eventDate;
        ticketPrice = _ticketPrice;
        maxTickets = _maxTickets;
    }

    function mintTicket(address _to, string memory _seatNumber) external payable {
        require(_tokenIdCounter < maxTickets, "All tickets sold");
        require(msg.value >= ticketPrice, "Insufficient payment");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(_to, tokenId);
        seatNumbers[tokenId] = _seatNumber;

        emit TicketMinted(_to, tokenId, _seatNumber);

        if (msg.value > ticketPrice) {
            payable(msg.sender).transfer(msg.value - ticketPrice);
        }
    }

    function ownerMint(address _to, string memory _seatNumber) external onlyOwner {
        require(_tokenIdCounter < maxTickets, "All tickets sold");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(_to, tokenId);
        seatNumbers[tokenId] = _seatNumber;

        emit TicketMinted(_to, tokenId, _seatNumber);
    }

    function getTicketInfo(uint256 _tokenId) external view returns (
        string memory event_,
        string memory date,
        string memory seat,
        address owner_
    ) {
        require(_ownerOf(_tokenId) != address(0), "Token does not exist");
        return (eventName, eventDate, seatNumbers[_tokenId], ownerOf(_tokenId));
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
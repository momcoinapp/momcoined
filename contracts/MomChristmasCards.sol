// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MomChristmasCards is ERC1155, Ownable {
    // 10 Christmas Card Designs (IDs 1-10) are Free. 
    // Custom AI Cards (IDs 1000+) are 0.0003 ETH (~$1).
    uint256 public constant CARD_1 = 1;
    uint256 public constant CARD_10 = 10;
    uint256 public constant CUSTOM_START_ID = 1000;
    uint256 public constant MINT_PRICE = 0.0003 ether; // Approx $1

    constructor() ERC1155("https://app.momcoined.com/api/metadata/christmas/{id}") Ownable(msg.sender) {}

    // Free Mint for Official Designs
    function mintCard(uint256 id) external {
        require(id >= CARD_1 && id < CUSTOM_START_ID, "Invalid or Custom ID");
        _mint(msg.sender, id, 1, "");
    }

    // Paid Mint for Custom AI Designs
    function mintCustomCard(uint256 id) external payable {
        require(id >= CUSTOM_START_ID, "Must be a custom ID");
        require(msg.value >= MINT_PRICE, "Insufficient ETH");
        _mint(msg.sender, id, 1, "");
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    // Admin can airdrop to top Moms
    function airdropSet(address to) external onlyOwner {
        uint256[] memory ids = new uint256[](10);
        uint256[] memory amounts = new uint256[](10);
        for(uint256 i=0; i<10; i++) {
            ids[i] = i + 1;
            amounts[i] = 1;
        }
        _mintBatch(to, ids, amounts, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}

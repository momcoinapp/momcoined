// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MomChristmasCards is ERC1155, Ownable {
    IERC20 public momToken;
    uint256 public constant MIN_HOLDINGS = 100 * 10**18; // Must hold 100 MOM

    // 10 Christmas Card Designs (IDs 1-10)
    uint256 public constant CARD_1 = 1;
    uint256 public constant CARD_10 = 10;

    constructor(address _momToken) ERC1155("https://api.momcoined.com/metadata/christmas/{id}.json") Ownable(msg.sender) {
        momToken = IERC20(_momToken);
    }

    function mintCard(uint256 id) external {
        require(id >= CARD_1 && id <= CARD_10, "Invalid Card ID");
        require(momToken.balanceOf(msg.sender) >= MIN_HOLDINGS, "Must hold 100 MOM");
        
        // Free Mint (Gas only) - Limit 1 per card per wallet? 
        // For simplicity: Open mint if holding.
        _mint(msg.sender, id, 1, "");
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MomGenNFT
 * @dev 10k Gen NFT Collection. Users pay MOM to mint.
 * Includes "Re-roll" mechanic to regenerate traits (burns MOM).
 */
contract MomGenNFT is ERC721, Ownable {
    using Strings for uint256;

    IERC20 public momToken;
    
    uint256 public nextTokenId = 1;
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Pricing in USD (18 decimals, e.g. 1 * 10**18 = $1.00)
    uint256 public mintPriceUSD = 1 * 10**18;      // $1.00
    uint256 public rerollPriceUSD = 5 * 10**17;    // $0.50
    
    // MOM Price in USD (18 decimals, e.g. 0.01 * 10**18 = $0.01)
    // In a production app, this should come from an Oracle (Chainlink).
    // For MVP, the Admin sets this manually or we use a simple Oracle.
    uint256 public momPriceUSD = 1 * 10**16; // Example: $0.01 per MOM

    string public baseURI;
    
    // Mapping to track how many times a token has been re-rolled
    mapping(uint256 => uint256) public rerollCounts;
    uint256 public constant MAX_REROLLS = 10;

    event Minted(address indexed user, uint256 tokenId);
    event Rerolled(uint256 indexed tokenId, uint256 newSeed);

    constructor(address _momToken, string memory _initBaseURI) 
        ERC721("Mom Gen 1", "MOMGEN") 
        Ownable(msg.sender) 
    {
        momToken = IERC20(_momToken);
        baseURI = _initBaseURI;
    }

    function mint() external {
        require(nextTokenId <= MAX_SUPPLY, "Sold out");
        
        // Calculate MOM required: (MintPriceUSD / MomPriceUSD) * 10^18
        // Example: ($1.00 / $0.01) = 100 MOM
        uint256 momRequired = (mintPriceUSD * 10**18) / momPriceUSD;
        
        require(momToken.transferFrom(msg.sender, address(this), momRequired), "Transfer failed");

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        nextTokenId++;

        emit Minted(msg.sender, tokenId);
    }

    function reroll(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(rerollCounts[tokenId] < MAX_REROLLS, "Max rerolls reached");
        
        // Calculate MOM required: ($0.50 / $0.01) = 50 MOM
        uint256 momRequired = (rerollPriceUSD * 10**18) / momPriceUSD;
        
        require(momToken.transferFrom(msg.sender, address(this), momRequired), "Transfer failed");

        rerollCounts[tokenId]++;
        
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId)));
        emit Rerolled(tokenId, seed);
    }

    function setMomPrice(uint256 _priceUSD) external onlyOwner {
        momPriceUSD = _priceUSD;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function setPrices(uint256 _mintPriceUSD, uint256 _rerollPriceUSD) external onlyOwner {
        mintPriceUSD = _mintPriceUSD;
        rerollPriceUSD = _rerollPriceUSD;
    }

    function withdrawTokens() external onlyOwner {
        uint256 balance = momToken.balanceOf(address(this));
        momToken.transfer(msg.sender, balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Chainlink Aggregator Interface
interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

// ERC-4906 Interface
interface IERC4906 {
    event MetadataUpdate(uint256 _tokenId);
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
}

contract MomsCookieJar is ERC721A, Ownable, IERC4906, ReentrancyGuard {
    using Strings for uint256;

    // --- Configuration ---
    IERC20 public usdcToken;
    IERC20 public momToken;
    AggregatorV3Interface internal priceFeed;

    // Caps (4 Rarities, 1958 Each)
    uint256 public constant BASEMOM_CAP = 1958;
    uint256 public constant FARMOM_CAP = 1958;
    uint256 public constant BASEKID_CAP = 1958;
    uint256 public constant FARKID_CAP = 1958;

    // Counters
    uint256 public basemomClaimed = 0;
    uint256 public farmomClaimed = 0;
    uint256 public basekidClaimed = 0;
    uint256 public farkidClaimed = 0;

    // Prices (USD in 18 decimals for ETH calc, 6 decimals for USDC)
    uint256 public constant JAR_PRICE_USD = 1 * 10**18; // $1.00
    uint256 public constant FILL_PRICE_USD = 5 * 10**18; // $5.00
    
    uint256 public constant JAR_PRICE_USDC = 1 * 10**6; // $1.00 USDC
    uint256 public constant FILL_PRICE_USDC = 5 * 10**6; // $5.00 USDC
    
    // Holder Benefits
    uint256 public constant HOLDER_THRESHOLD = 50000 * 10**18; // 50,000 MOM
    uint256 public constant DISCOUNT_PERCENT = 20; // 20% Discount for Holders

    uint256 public rerollBurnAmount = 500000 * 10**18; // 500k MOM
    uint256 public rerollPriceUSD = 1 * 10**18; // $1.00

    // Metadata
    string public baseURI;

    // Mappings
    mapping(uint256 => uint256) public tokenTiers; 

    // Events
    event JarMinted(address indexed user, uint256 tokenId, string currency, uint256 ethPaid);
    event JarFilled(uint256 indexed tokenId, uint256 tier, string currency, uint256 ethPaid);
    event JarRerolled(uint256 indexed tokenId);

    // Constructor
    // Base ETH/USD Feed: 0x71041dddad3595F745215C98a9D8413013817846
    constructor(address _usdc, address _mom, address _priceFeed) ERC721A("Moms Cookie Jar", "MOMJAR") Ownable(msg.sender) {
        usdcToken = IERC20(_usdc);
        momToken = IERC20(_mom);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // --- Helper: Get ETH Price ---
    function getLatestEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price) * 10**10;
    }

    function getEthAmount(uint256 usdAmount) public view returns (uint256) {
        uint256 ethPrice = getLatestEthPrice();
        return (usdAmount * 1e18) / ethPrice;
    }

    // --- Helper: Discount Logic ---
    function _applyDiscount(uint256 price) internal view returns (uint256) {
        if (momToken.balanceOf(msg.sender) >= HOLDER_THRESHOLD) {
            return price * (100 - DISCOUNT_PERCENT) / 100;
        }
        return price;
    }

    // --- 1. Mint Jar ($1) ---
    
    function mintJarETH() external payable nonReentrant {
        _mintJarCheck();
        uint256 price = _applyDiscount(JAR_PRICE_USD);
        uint256 requiredEth = getEthAmount(price);
        require(msg.value >= requiredEth, "Insufficient ETH");
        
        _mintJar(msg.sender, "ETH", msg.value);
    }

    function mintJarUSDC() external nonReentrant {
        _mintJarCheck();
        uint256 price = _applyDiscount(JAR_PRICE_USDC);
        require(usdcToken.transferFrom(msg.sender, address(this), price), "USDC Transfer Failed");
        _mintJar(msg.sender, "USDC", 0);
    }

    function _mintJarCheck() internal view {
        require(balanceOf(msg.sender) == 0, "One jar per wallet");
    }

    function _mintJar(address to, string memory currency, uint256 ethPaid) internal {
        _safeMint(to, 1);
        uint256 tokenId = _nextTokenId() - 1;
        tokenTiers[tokenId] = 0; // 0 = Empty Jar
        emit JarMinted(to, tokenId, currency, ethPaid);
    }

    // --- 2. Instant Fill ($5) ---
    
    function instantFillETH(uint256 tokenId) external payable nonReentrant {
        uint256 price = _applyDiscount(FILL_PRICE_USD);
        uint256 requiredEth = getEthAmount(price);
        require(msg.value >= requiredEth, "Insufficient ETH");
        _fillJar(tokenId, "ETH", msg.value);
    }

    function instantFillUSDC(uint256 tokenId) external nonReentrant {
        uint256 price = _applyDiscount(FILL_PRICE_USDC);
        require(usdcToken.transferFrom(msg.sender, address(this), price), "USDC Transfer Failed");
        _fillJar(tokenId, "USDC", 0);
    }

    function _fillJar(uint256 tokenId, string memory currency, uint256 ethPaid) internal {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(tokenTiers[tokenId] == 0, "Already filled");

        uint256 tier = 0;

        // Linear Rarity Fill: 1 -> 2 -> 3 -> 4
        if (basemomClaimed < BASEMOM_CAP) {
            tier = 1; 
            basemomClaimed++;
        } else if (farmomClaimed < FARMOM_CAP) {
            tier = 2; 
            farmomClaimed++;
        } else if (basekidClaimed < BASEKID_CAP) {
            tier = 3;
            basekidClaimed++;
        } else if (farkidClaimed < FARKID_CAP) {
            tier = 4;
            farkidClaimed++;
        } else {
            revert("All Collections Sold Out!");
        }

        tokenTiers[tokenId] = tier;
        emit JarFilled(tokenId, tier, currency, ethPaid);
        emit MetadataUpdate(tokenId);
    }

    // --- 3. Re-Roll ($1 + Burn MOM) ---
    
    function rerollJar(uint256 tokenId) external payable nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        uint256 requiredEth = getEthAmount(rerollPriceUSD);
        require(msg.value >= requiredEth, "Insufficient ETH");
        require(momToken.transferFrom(msg.sender, address(0xdead), rerollBurnAmount), "MOM Burn Failed");

        emit JarRerolled(tokenId);
        emit MetadataUpdate(tokenId);
    }

    // --- 4. Admin / Daily Race ---

    function adminFill(uint256 tokenId) external onlyOwner {
        require(tokenTiers[tokenId] == 0, "Already filled");
        
        uint256 tier = 0;

        // Admin fill respects caps too
        if (basemomClaimed < BASEMOM_CAP) { tier = 1; basemomClaimed++; }
        else if (farmomClaimed < FARMOM_CAP) { tier = 2; farmomClaimed++; }
        else if (basekidClaimed < BASEKID_CAP) { tier = 3; basekidClaimed++; }
        else if (farkidClaimed < FARKID_CAP) { tier = 4; farkidClaimed++; }
        else { revert("Sold Out"); }

        tokenTiers[tokenId] = tier;
        emit JarFilled(tokenId, tier, "ADMIN", 0);
        emit MetadataUpdate(tokenId);
    }

    function airdropJar(address to) external onlyOwner {
        _mintJarCheck(); 
        _mintJar(to, "ADMIN_AIRDROP", 0);
    }

    // --- Admin Config ---

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BatchMetadataUpdate(0, _nextTokenId());
    }

    function setRerollBurnAmount(uint256 _newAmount) external onlyOwner {
        rerollBurnAmount = _newAmount;
    }

    // OpenSea/Zora Collection Metadata
    string public collectionURI;

    function setCollectionURI(string memory _collectionURI) external onlyOwner {
        collectionURI = _collectionURI;
    }

    function contractURI() public view returns (string memory) {
        return collectionURI;
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawToken(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound
    );
}

interface IERC4906 {
    event MetadataUpdate(uint256 _tokenId);
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
}

/**
 * @title MomsCookieJarV2
 * @notice FREE Cookie Jar mints → $2 reveal → BaseMomz or BaseKidz NFT
 * @dev Genesis Set: 1958 BaseMomz (for Mom) + 1991 BaseKidz (for Son) = 3,949 total
 */
contract MomsCookieJarV2 is ERC721A, Ownable, IERC4906, ReentrancyGuard {
    using Strings for uint256;

    // ============ TOKENS ============
    IERC20 public usdcToken;
    IERC20 public momToken;
    AggregatorV3Interface internal priceFeed;

    // ============ GENESIS SET SUPPLY (Meaningful numbers!) ============
    uint256 public constant BASEMOMZ_CAP = 1958;  // Mom's birth year ❤️
    uint256 public constant BASEKIDZ_CAP = 1991;  // Son's birth year 💙
    uint256 public constant MAX_SUPPLY = BASEMOMZ_CAP + BASEKIDZ_CAP; // 3,949

    uint256 public basemomzClaimed = 0;
    uint256 public basekidzClaimed = 0;

    // ============ PRICING ============
    uint256 public jarPriceUSD = 0;           // FREE mint!
    uint256 public fillPriceUSD = 2 * 10**18; // $2 reveal
    uint256 public jarPriceUSDC = 0;
    uint256 public fillPriceUSDC = 2 * 10**6;

    // ============ HOLDER BENEFITS ============
    uint256 public holderThreshold = 50000 * 10**18;
    uint256 public discountPercent = 20;

    // ============ METADATA ============
    string public baseURI;
    string public collectionURI;

    // ============ TOKEN DATA ============
    struct JarInfo {
        uint8 tier;        // 0=Sealed, 1=BaseMomz, 2=BaseKidz
        uint64 mintedAt;
        uint64 filledAt;
    }
    mapping(uint256 => JarInfo) public jarInfo;
    mapping(address => uint256) public unfilledJars;

    // ============ EVENTS ============
    event JarMinted(address indexed user, uint256 tokenId);
    event JarFilled(uint256 indexed tokenId, uint256 tier, string tierName);
    event PricesUpdated(uint256 jarPrice, uint256 fillPrice);

    // Base Mainnet ETH/USD: 0x71041dddad3595F745215C98a9D8413013817846
    constructor(
        address _usdc,
        address _mom,
        address _priceFeed
    ) ERC721A("Moms Cookie Jar", "MOMJAR") Ownable(msg.sender) {
        usdcToken = IERC20(_usdc);
        momToken = IERC20(_mom);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // ============ PRICING ============

    function getLatestEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price) * 10**10;
    }

    function getEthAmount(uint256 usdAmount) public view returns (uint256) {
        if (usdAmount == 0) return 0;
        return (usdAmount * 1e18) / getLatestEthPrice();
    }

    function _applyDiscount(uint256 price) internal view returns (uint256) {
        if (momToken.balanceOf(msg.sender) >= holderThreshold) {
            return price * (100 - discountPercent) / 100;
        }
        return price;
    }

    // ============ MINT JAR (FREE!) ============

    function mintJarETH() external payable nonReentrant {
        _mintJarCheck();
        uint256 requiredEth = getEthAmount(_applyDiscount(jarPriceUSD));
        require(msg.value >= requiredEth, "Insufficient ETH");
        _mintJar(msg.sender);
    }

    function mintJarUSDC() external nonReentrant {
        _mintJarCheck();
        uint256 price = _applyDiscount(jarPriceUSDC);
        if (price > 0) {
            require(usdcToken.transferFrom(msg.sender, address(this), price), "USDC Failed");
        }
        _mintJar(msg.sender);
    }

    function _mintJarCheck() internal view {
        require(unfilledJars[msg.sender] == 0, "Fill your current jar first!");
        require(_nextTokenId() <= MAX_SUPPLY, "SOLD OUT! No more jars available.");
    }

    function _mintJar(address to) internal {
        _safeMint(to, 1);
        uint256 tokenId = _nextTokenId() - 1;
        
        jarInfo[tokenId] = JarInfo({
            tier: 0,
            mintedAt: uint64(block.timestamp),
            filledAt: 0
        });
        
        unfilledJars[to]++;
        emit JarMinted(to, tokenId);
    }

    // ============ FILL JAR ($2 REVEAL) ============

    function instantFillETH(uint256 tokenId) external payable nonReentrant {
        uint256 requiredEth = getEthAmount(_applyDiscount(fillPriceUSD));
        require(msg.value >= requiredEth, "Insufficient ETH");
        _fillJar(tokenId);
    }

    function instantFillUSDC(uint256 tokenId) external nonReentrant {
        uint256 price = _applyDiscount(fillPriceUSDC);
        require(usdcToken.transferFrom(msg.sender, address(this), price), "USDC Failed");
        _fillJar(tokenId);
    }

    function _fillJar(uint256 tokenId) internal {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(jarInfo[tokenId].tier == 0, "Already revealed");

        uint8 tier = _getNextTier();
        string memory tierName = tier == 1 ? "BaseMomz" : "BaseKidz";
        
        jarInfo[tokenId].tier = tier;
        jarInfo[tokenId].filledAt = uint64(block.timestamp);
        
        if (unfilledJars[msg.sender] > 0) {
            unfilledJars[msg.sender]--;
        }

        emit JarFilled(tokenId, tier, tierName);
        emit MetadataUpdate(tokenId);
    }

    function _getNextTier() internal returns (uint8) {
        // Fill BaseMomz first (rarer), then BaseKidz
        if (basemomzClaimed < BASEMOMZ_CAP) {
            basemomzClaimed++;
            return 1; // BaseMomz
        } else if (basekidzClaimed < BASEKIDZ_CAP) {
            basekidzClaimed++;
            return 2; // BaseKidz
        } else {
            revert("All NFTs revealed!");
        }
    }

    // ============ ADMIN ============

    function adminFill(uint256 tokenId) external onlyOwner {
        require(jarInfo[tokenId].tier == 0, "Already revealed");
        uint8 tier = _getNextTier();
        jarInfo[tokenId].tier = tier;
        jarInfo[tokenId].filledAt = uint64(block.timestamp);
        
        address owner = ownerOf(tokenId);
        if (unfilledJars[owner] > 0) unfilledJars[owner]--;
        
        emit JarFilled(tokenId, tier, tier == 1 ? "BaseMomz" : "BaseKidz");
        emit MetadataUpdate(tokenId);
    }

    function airdropJar(address to) external onlyOwner {
        require(unfilledJars[to] == 0, "Has unfilled jar");
        require(_nextTokenId() <= MAX_SUPPLY, "Sold out");
        _mintJar(to);
    }

    function setJarPrice(uint256 _usd, uint256 _usdc) external onlyOwner {
        jarPriceUSD = _usd;
        jarPriceUSDC = _usdc;
    }

    function setFillPrice(uint256 _usd, uint256 _usdc) external onlyOwner {
        fillPriceUSD = _usd;
        fillPriceUSDC = _usdc;
    }

    function setHolderBenefits(uint256 _threshold, uint256 _discount) external onlyOwner {
        holderThreshold = _threshold;
        discountPercent = _discount;
    }

    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
        emit BatchMetadataUpdate(1, _nextTokenId());
    }

    function setCollectionURI(string memory _uri) external onlyOwner {
        collectionURI = _uri;
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawToken(address _token) external onlyOwner {
        IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this)));
    }

    // ============ VIEW FUNCTIONS ============

    function contractURI() public view returns (string memory) {
        return collectionURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    function isFilled(uint256 tokenId) external view returns (bool) {
        return jarInfo[tokenId].tier > 0;
    }

    function getTier(uint256 tokenId) external view returns (string memory) {
        uint8 tier = jarInfo[tokenId].tier;
        if (tier == 0) return "Sealed";
        if (tier == 1) return "BaseMomz";
        if (tier == 2) return "BaseKidz";
        return "Unknown";
    }

    function canMint(address user) external view returns (bool) {
        return unfilledJars[user] == 0 && _nextTokenId() <= MAX_SUPPLY;
    }

    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - (_nextTokenId() - 1);
    }

    function remainingMomz() external view returns (uint256) {
        return BASEMOMZ_CAP - basemomzClaimed;
    }

    function remainingKidz() external view returns (uint256) {
        return BASEKIDZ_CAP - basekidzClaimed;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId() - 1;
    }
}

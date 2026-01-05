export const MOM_TOKEN_ABI = [
    {
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export const MOM_HELPER_ABI = [
    {
        inputs: [{ name: "user", type: "address" }],
        name: "lastClaimTime",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "claimDaily",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "user", type: "address" }],
        name: "stakedBalance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "stake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export const MOM_PREDICTION_ABI = [
    {
        inputs: [],
        name: "currentRoundId",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "roundDuration",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "isPaused",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "", type: "uint256" }],
        name: "rounds",
        outputs: [
            { name: "id", type: "uint256" },
            { name: "startTime", type: "uint256" },
            { name: "lockPrice", type: "uint256" },
            { name: "closePrice", type: "uint256" },
            { name: "totalAmount", "type": "uint256" },
            { name: "upAmount", "type": "uint256" },
            { name: "downAmount", "type": "uint256" },
            { name: "resolved", "type": "bool" },
            { name: "cancelled", "type": "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "", type: "uint256" },
            { name: "", type: "address" },
        ],
        name: "bets",
        outputs: [
            { name: "amount", type: "uint256" },
            { name: "isUp", "type": "bool" },
            { name: "claimed", "type": "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export const CONTRACT_ADDRESSES = {
    MOM_TOKEN: "0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07",
    MOM_HELPER: "0x6F3e1fC4abd866E6EA47E279EDa306048E5bA95D",
    MOM_PREDICTION: "0xDC10DE564082aA2f52BFbaa25b5bF8F4D52106ce",
    MOM_COOKIE_JAR: "0x23A92ccb96AF20A3749Eff06f5B6CB4f1f54132b",
    MOM_CHRISTMAS_CARDS: "0xE2feD307E70E76F1B089EF34996c4b2187051AFE",
} as const;

export const MOM_COOKIE_JAR_ABI = [
    {
        inputs: [{ name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "index", type: "uint256" },
        ],
        name: "tokenOfOwnerByIndex",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "isFilled",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "mintJarETH",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "mintJarUSDC",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "instantFillETH",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "instantFillUSDC",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "adminFill",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "to", type: "address" }],
        name: "airdropJar",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

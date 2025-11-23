inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
    },
{
    constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
            name: "transfer",
                outputs: [{ name: "", type: "bool" }],
                    type: "function",
    },
{
    constant: false,
        inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
        ],
    },
{
    inputs: [{ name: "user", type: "address" }],
        name: "lastClaimTime",
            outputs: [{ name: "", type: "uint256" }],
                stateMutability: "view",
                    type: "function",
    },
{
    inputs: [{ name: "amount", type: "uint256" }, { name: "signature", type: "bytes" }],
        name: "claimRewards",
            inputs: [{ name: "_roundId", type: "uint256" }],
                name: "claim",
                    outputs: [],
                        stateMutability: "nonpayable",
                            type: "function",
    },
{
    inputs: [],
        name: "currentRoundId",
    },
{
    inputs: [{ name: "tokenId", type: "uint256" }],
        name: "reroll",
            outputs: [],
                stateMutability: "nonpayable",
                    type: "function",
    }
] as const ;

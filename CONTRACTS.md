# Smart Contracts

Here are the official deployed contracts for MomCoin on the Base network.

## Deployed Addresses

| Contract Name | Address | Description |
| :--- | :--- | :--- |
| **$MOM Token** | [`0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07`](https://basescan.org/address/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07) | The native ERC-20 token of the Momverse. |
| **MomHelper** | [`0x6F3e1fC4abd866E6EA47E279EDa306048E5bA95D`](https://basescan.org/address/0x6F3e1fC4abd866E6EA47E279EDa306048E5bA95D) | Helper contract for daily claims and staking. |
| **MomPrediction** | [`0xDC10DE564082aA2f52BFbaa25b5bF8F4D52106ce`](https://basescan.org/address/0xDC10DE564082aA2f52BFbaa25b5bF8F4D52106ce) | Prediction market contract for ETH price. |
| **MomCookieJar** | [`0x23A92ccb96AF20A3749Eff06f5B6CB4f1f54132b`](https://basescan.org/address/0x23A92ccb96AF20A3749Eff06f5B6CB4f1f54132b) | NFT contract for Mom's Cookie Jar (ERC-721A). |

## Verification

The source code for these contracts is available in the `contracts/` directory of this repository.

*   **Transparency**: We believe in full transparency. You can verify the bytecode on Basescan against the source code provided here.
*   **Security**: All contracts use standard OpenZeppelin libraries where applicable and have been tested for basic security vulnerabilities.

### How to Verify
If you are the deployer or want to verify the contracts yourself:
1.  Go to the [Basescan Verify Contract](https://basescan.org/verifyContract) page.
2.  Enter the contract address and select the compiler version used (check `hardhat.config.ts` or the solidity files).
3.  Upload the flattened source code from the `contracts/` folder.

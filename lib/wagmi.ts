import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

// Coinbase Smart Wallet only - no WalletConnect/MetaMask needed
export const config = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appName: "MomCoin",
            preference: "smartWalletOnly", // Force Smart Wallet for gasless
        }),
    ],
    ssr: true,
    transports: {
        [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
            ? `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
            : undefined),
    },
});

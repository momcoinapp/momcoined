import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "cc97e2d8d1441819bd41f75c101a4ccf";

export const config = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appName: "MomCoin",
            preference: "smartWalletOnly",
        }),
        walletConnect({ projectId, showQrModal: true }),
    ],
    ssr: true,
    transports: {
        [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
            ? `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
            : undefined),
    },
});

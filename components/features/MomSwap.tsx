"use client";

import {
    Swap,
    SwapAmountInput,
    SwapToggleButton,
    SwapButton,
    SwapMessage,
    SwapToast,
} from '@coinbase/onchainkit/swap';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { Card } from "@/components/ui/Card";
import type { Token } from '@coinbase/onchainkit/token';

export default function MomSwap() {
    const { address } = useAccount();

    // MOM Token Address on Base
    const MOM_TOKEN_ADDRESS = "0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07";
    const ETH_ADDRESS = "0x4200000000000000000000000000000000000006"; // WETH on Base

    const ethToken: Token = {
        name: 'Ether',
        address: ETH_ADDRESS,
        symbol: 'ETH',
        decimals: 18,
        image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        chainId: 8453,
    };

    const momToken: Token = {
        name: 'MomCoin',
        address: MOM_TOKEN_ADDRESS,
        symbol: 'MOM',
        decimals: 18,
        image: 'https://momcoined.com/mom-coin-logo.jpg',
        chainId: 8453,
    };

    return (
        <Card className="p-6 border-2 border-blue-500/30 bg-blue-900/10">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Swap for $MOMCOIN</h3>
            <div className="flex justify-center">
                <Swap>
                    <SwapAmountInput
                        label="Sell"
                        swappableTokens={[ethToken]}
                        token={ethToken}
                        type="from"
                    />
                    <SwapToggleButton />
                    <SwapAmountInput
                        label="Buy"
                        swappableTokens={[momToken]}
                        token={momToken}
                        type="to"
                    />
                    <SwapButton />
                    <SwapMessage />
                    <SwapToast />
                </Swap>
            </div>
        </Card>
    );
}

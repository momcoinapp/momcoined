
"use client";

import {
    Swap,
    SwapAmountInput,
    SwapToggleButton,
    SwapButton,
    SwapMessage,
    SwapToast,
} from '@coinbase/onchainkit/swap';
import { Card } from "@/components/ui/Card";
import type { Token } from '@coinbase/onchainkit/token';

export default function MomSwap() {
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
        name: '$MomCoin',
        address: MOM_TOKEN_ADDRESS,
        symbol: '$MOMCOIN',
        decimals: 18,
        image: 'https://momcoined.com/mom-coin-logo.jpg',
        chainId: 8453,
    };

    // Cast components to any to bypass TypeScript errors with React 18
    const SwapAny = Swap as any;
    const SwapAmountInputAny = SwapAmountInput as any;
    const SwapToggleButtonAny = SwapToggleButton as any;
    const SwapButtonAny = SwapButton as any;
    const SwapMessageAny = SwapMessage as any;
    const SwapToastAny = SwapToast as any;

    return (
        <Card className="p-6 border-2 border-blue-500/30 bg-blue-900/10">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Swap for $MOMCOIN</h3>
            <div className="flex justify-center">
                <SwapAny>
                    <SwapAmountInputAny
                        label="Sell"
                        swappableTokens={[ethToken, momToken]}
                        token={ethToken}
                        type="from"
                    />
                    <SwapToggleButtonAny />
                    <SwapAmountInputAny
                        label="Buy"
                        swappableTokens={[ethToken, momToken]}
                        token={momToken}
                        type="to"
                    />
                    <SwapButtonAny />
                    <SwapMessageAny />
                    <SwapToastAny />
                </SwapAny>
            </div>
        </Card>
    );
}

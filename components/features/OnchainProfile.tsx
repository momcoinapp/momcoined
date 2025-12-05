"use client";

import {
    Identity,
    Avatar,
    Name,
    Address,
    EthBalance
} from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";

export function OnchainProfile() {
    const { address } = useAccount();

    if (!address) return null;

    // Cast components to any to bypass TypeScript errors with React 18
    const IdentityAny = Identity as any;
    const AvatarAny = Avatar as any;
    const NameAny = Name as any;
    const AddressAny = Address as any;
    const EthBalanceAny = EthBalance as any;

    return (
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <IdentityAny
                address={address}
                schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9" // Optional: EAS Schema ID
            >
                <AvatarAny className="h-12 w-12 rounded-full" />
                <div className="flex flex-col">
                    <NameAny className="font-bold text-white" />
                    <AddressAny className="text-sm text-gray-400" />
                    <EthBalanceAny className="text-xs text-green-400 font-mono" />
                </div>
            </IdentityAny>
        </div>
    );
}

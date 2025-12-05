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

    return (
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <Identity
                address={address}
                schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9" // Optional: EAS Schema ID
            >
                <Avatar className="h-12 w-12 rounded-full" />
                <div className="flex flex-col">
                    <Name className="font-bold text-white" />
                    <Address className="text-sm text-gray-400" />
                    <EthBalance className="text-xs text-green-400 font-mono" />
                </div>
            </Identity>
        </div>
    );
}

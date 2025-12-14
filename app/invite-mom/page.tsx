```typescript
import { Metadata } from "next";
import { InviteMomContent } from "@/components/features/InviteMomContent";

// Frame Metadata for Farcaster
export const metadata: Metadata = {
    title: "MomCoin Christmas Cards",
    description: "Mint your 2024 MomCoin Christmas Card. Holders Only!",
    openGraph: {
        title: "MomCoin Christmas Cards",
        description: "Official 10-Card Set. Mint now on Base.",
        images: ["https://app.momcoined.com/christmas-preview.png"],
    },
    other: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://app.momcoined.com/christmas-preview.png",
        "fc:frame:button:1": "Mint Random Card",
        "fc:frame:action": "tx",
        "fc:frame:target": "https://app.momcoined.com/api/frame/mint-christmas",
    }
};

export default function InviteMomPage() {
    return <InviteMomContent />;
}
```

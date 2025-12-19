import { CookieJarLayout } from "@/components/features/CookieJarLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mint Mom's Cookie Jar 🍪",
    description: "Free the Moms! Mint your jar and join the family.",
    openGraph: {
        title: "Mint Mom's Cookie Jar 🍪",
        description: "Free the Moms! Mint your jar and join the family.",
        images: ["https://app.momcoined.com/og-image.png"],
    },
    other: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://app.momcoined.com/og-image.png",
        "fc:frame:button:1": "Mint Now 🍪",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": "https://app.momcoined.com/cookiejar",
    },
};

export default function CookieJarPage() {
    return <CookieJarLayout />;
}


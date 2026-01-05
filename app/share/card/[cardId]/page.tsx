import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.momcoined.com";

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ cardId: string }>;
    searchParams: Promise<{ to?: string; from?: string; msg?: string; template?: string }>;
}): Promise<Metadata> {
    const { cardId } = await params;
    const { to, from, msg, template } = await searchParams;

    // Build OG image URL with query params
    const ogImageUrl = new URL(`${BASE_URL}/api/og/card/${cardId}`);
    if (to) ogImageUrl.searchParams.set("to", to);
    if (from) ogImageUrl.searchParams.set("from", from);
    if (msg) ogImageUrl.searchParams.set("msg", msg);
    if (template) ogImageUrl.searchParams.set("template", template);

    const title = `Card for ${to || "You"} from ${from || "Someone Special"}`;
    const description = msg || "You received a special NFT card on Momcoined!";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [ogImageUrl.toString()],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImageUrl.toString()],
        },
        other: {
            "fc:miniapp": JSON.stringify({
                version: "next",
                imageUrl: ogImageUrl.toString(),
                button: {
                    title: "Claim Card 🎁",
                    action: {
                        type: "launch_frame",
                        url: `${BASE_URL}/claim/${cardId}`,
                        name: "Momcoined",
                        splashImageUrl: `${BASE_URL}/mom-visual-5.png`,
                        splashBackgroundColor: "#DC2626",
                    },
                },
            }),
        },
    };
}

export default async function ShareCardPage({
    params,
    searchParams,
}: {
    params: Promise<{ cardId: string }>;
    searchParams: Promise<{ to?: string; from?: string }>;
}) {
    const { cardId } = await params;
    const { to, from } = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                    🎁 You&apos;ve Got a Card!
                </h1>
                <p className="text-xl text-gray-300 mb-2">
                    To: <span className="text-red-400">{to || "You"}</span>
                </p>
                <p className="text-lg text-gray-400 mb-8">
                    From: {from || "Someone Special"} ❤️
                </p>
                <a
                    href={`/claim/${cardId}`}
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105"
                >
                    Open & Claim Card
                </a>
                <p className="text-sm text-gray-500 mt-6">
                    Card #{cardId} • Momcoined on Base
                </p>
            </div>
        </div>
    );
}

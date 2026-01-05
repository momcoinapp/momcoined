import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.momcoined.com";

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ jarId: string }>;
    searchParams: Promise<{ owner?: string; cookies?: string; tier?: string }>;
}): Promise<Metadata> {
    const { jarId } = await params;
    const { owner, cookies, tier } = await searchParams;

    // Build OG image URL with query params
    const ogImageUrl = new URL(`${BASE_URL}/api/og/jar/${jarId}`);
    if (owner) ogImageUrl.searchParams.set("owner", owner);
    if (cookies) ogImageUrl.searchParams.set("cookies", cookies);
    if (tier) ogImageUrl.searchParams.set("tier", tier);

    const title = `${owner || "Someone"}'s Cookie Jar`;
    const description = `${cookies || 0} cookies in this ${tier || "Base"} Mom jar!`;

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
                    title: "View Cookie Jar 🍪",
                    action: {
                        type: "launch_frame",
                        url: `${BASE_URL}/jar/${jarId}`,
                        name: "Momcoined",
                        splashImageUrl: `${BASE_URL}/mom-visual-5.png`,
                        splashBackgroundColor: "#DC2626",
                    },
                },
            }),
        },
    };
}

export default async function ShareJarPage({
    params,
    searchParams,
}: {
    params: Promise<{ jarId: string }>;
    searchParams: Promise<{ owner?: string; cookies?: string; tier?: string }>;
}) {
    const { jarId } = await params;
    const { owner, cookies, tier } = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
            <div className="text-center">
                <div className="text-8xl mb-6">🍪</div>
                <h1 className="text-4xl font-bold text-white mb-4">
                    {owner || "Someone"}&apos;s Cookie Jar
                </h1>
                <p className="text-2xl text-yellow-400 mb-2">
                    {cookies || 0} Cookies
                </p>
                <p className="text-lg text-gray-400 mb-8">
                    {tier || "Base"} Mom Tier
                </p>
                <a
                    href={`/jar/${jarId}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105"
                >
                    View Jar Details
                </a>
                <p className="text-sm text-gray-500 mt-6">
                    Jar #{jarId} • Momcoined on Base
                </p>
            </div>
        </div>
    );
}

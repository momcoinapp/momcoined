import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.momcoined.com";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "home";

    const config = getOgConfig(type);

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* Logo area */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "80px",
                            marginRight: "16px",
                        }}
                    >
                        🍪
                    </div>
                    <div
                        style={{
                            fontSize: "64px",
                            fontWeight: "bold",
                            background: "linear-gradient(90deg, #FF69B4, #FFD700)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Momcoin
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: "48px",
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                        marginBottom: "16px",
                        maxWidth: "900px",
                    }}
                >
                    {config.title}
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: "28px",
                        color: "#a0aec0",
                        textAlign: "center",
                        maxWidth: "800px",
                    }}
                >
                    {config.subtitle}
                </div>

                {/* Features */}
                <div
                    style={{
                        display: "flex",
                        gap: "32px",
                        marginTop: "40px",
                    }}
                >
                    {config.features.map((feature, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "20px 32px",
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: "16px",
                            }}
                        >
                            <span style={{ fontSize: "40px" }}>{feature.icon}</span>
                            <span style={{ color: "white", marginTop: "8px", fontSize: "20px" }}>
                                {feature.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "32px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#718096",
                        fontSize: "20px",
                    }}
                >
                    <span>Built on</span>
                    <span style={{ color: "#3B82F6", fontWeight: "bold" }}>Base</span>
                    <span>by Mom & Son</span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}

function getOgConfig(type: string) {
    const configs: Record<string, {
        title: string;
        subtitle: string;
        features: { icon: string; label: string }[];
    }> = {
        home: {
            title: "Bingo, Cookie Jars, MomAI",
            subtitle: "Family crypto made fun. Win daily, collect cookies, chat with AI.",
            features: [
                { icon: "🎰", label: "Bingo" },
                { icon: "🍪", label: "Cookie Jars" },
                { icon: "🤖", label: "MomAI" },
                { icon: "💌", label: "Cards" },
            ],
        },
        bingo: {
            title: "Daily Bingo Jackpots",
            subtitle: "Hourly burns + 5x USDC games. Free ticket every day!",
            features: [
                { icon: "🎰", label: "Bingo" },
                { icon: "💰", label: "USDC" },
                { icon: "🔥", label: "Burns" },
            ],
        },
        jars: {
            title: "AI-Reveal NFT Jars",
            subtitle: "Collect cookies, fill jars, discover your tier!",
            features: [
                { icon: "🍪", label: "Collect" },
                { icon: "🏺", label: "Fill" },
                { icon: "✨", label: "Reveal" },
            ],
        },
        cards: {
            title: "Holiday Cards on Base",
            subtitle: "Send free NFT cards with MOM token gifts",
            features: [
                { icon: "💌", label: "Send" },
                { icon: "🎁", label: "Gift MOM" },
                { icon: "💜", label: "Share" },
            ],
        },
    };

    return configs[type] || configs.home;
}

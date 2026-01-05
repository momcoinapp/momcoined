import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Card templates for generating dynamic images
const CARD_TEMPLATES: Record<string, { bg: string; accent: string }> = {
    "1": { bg: "#1a1a2e", accent: "#e94560" },
    "2": { bg: "#16213e", accent: "#0f3460" },
    "3": { bg: "#1f1f1f", accent: "#f9a825" },
    default: { bg: "#DC2626", accent: "#ffffff" },
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cardId: string }> }
) {
    const { cardId } = await params;

    // Parse card data from query params or fetch from Firebase
    const searchParams = request.nextUrl.searchParams;
    const recipientName = searchParams.get("to") || "Friend";
    const senderName = searchParams.get("from") || "Someone Special";
    const message = searchParams.get("msg") || "Wishing you the best!";
    const templateId = searchParams.get("template") || "default";

    const template = CARD_TEMPLATES[templateId] || CARD_TEMPLATES.default;

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
                    backgroundColor: template.bg,
                    backgroundImage: `radial-gradient(circle at 25% 25%, ${template.accent}22 0%, transparent 50%)`,
                    fontFamily: "system-ui, sans-serif",
                    padding: "40px",
                }}
            >
                {/* Logo/Brand */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <span style={{ fontSize: "32px", marginRight: "12px" }}>🍪</span>
                    <span style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff" }}>
                        Momcoined
                    </span>
                </div>

                {/* Card Container */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "24px",
                        padding: "40px 60px",
                        border: `2px solid ${template.accent}`,
                        maxWidth: "800px",
                    }}
                >
                    {/* Recipient */}
                    <div style={{ fontSize: "24px", color: "#aaaaaa", marginBottom: "8px" }}>
                        To: {recipientName}
                    </div>

                    {/* Message */}
                    <div
                        style={{
                            fontSize: "36px",
                            fontWeight: "bold",
                            color: "#ffffff",
                            textAlign: "center",
                            lineHeight: 1.3,
                            marginBottom: "20px",
                        }}
                    >
                        {message.length > 80 ? message.substring(0, 80) + "..." : message}
                    </div>

                    {/* Sender */}
                    <div style={{ fontSize: "20px", color: template.accent }}>
                        From: {senderName} ❤️
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        marginTop: "30px",
                        fontSize: "18px",
                        color: "#888888",
                    }}
                >
                    Card #{cardId} • Tap to claim on Base
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}

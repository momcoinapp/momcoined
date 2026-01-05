import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jarId: string }> }
) {
    const { jarId } = await params;

    // Parse jar data from query params
    const searchParams = request.nextUrl.searchParams;
    const ownerName = searchParams.get("owner") || "Anonymous";
    const cookieCount = searchParams.get("cookies") || "0";
    const tier = searchParams.get("tier") || "Base";

    // Tier colors
    const tierColors: Record<string, { bg: string; accent: string }> = {
        OG: { bg: "#FFD700", accent: "#1a1a1a" },
        Far: { bg: "#8B5CF6", accent: "#ffffff" },
        Base: { bg: "#0052FF", accent: "#ffffff" },
        Kid: { bg: "#10B981", accent: "#ffffff" },
    };

    const colors = tierColors[tier] || tierColors.Base;

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
                    backgroundColor: "#1a1a2e",
                    backgroundImage: "radial-gradient(circle at 50% 50%, #2d2d44 0%, #1a1a2e 70%)",
                    fontFamily: "system-ui, sans-serif",
                    padding: "40px",
                }}
            >
                {/* Cookie Jar Emoji */}
                <div style={{ fontSize: "120px", marginBottom: "20px" }}>🍪</div>

                {/* Jar Info */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "24px",
                        padding: "30px 50px",
                        border: `3px solid ${colors.bg}`,
                    }}
                >
                    {/* Tier Badge */}
                    <div
                        style={{
                            backgroundColor: colors.bg,
                            color: colors.accent,
                            padding: "8px 24px",
                            borderRadius: "20px",
                            fontSize: "20px",
                            fontWeight: "bold",
                            marginBottom: "16px",
                        }}
                    >
                        {tier} Mom
                    </div>

                    {/* Cookie Count */}
                    <div
                        style={{
                            fontSize: "64px",
                            fontWeight: "bold",
                            color: "#ffffff",
                            marginBottom: "8px",
                        }}
                    >
                        {cookieCount} 🍪
                    </div>

                    {/* Owner */}
                    <div style={{ fontSize: "24px", color: "#aaaaaa" }}>
                        {ownerName}&apos;s Cookie Jar
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        marginTop: "30px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <span style={{ fontSize: "24px", color: "#888888" }}>
                        Jar #{jarId} • Momcoined on Base
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}

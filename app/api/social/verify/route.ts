
import { NextResponse } from "next/server";
import { verifyLike, verifyRecast, verifyFollow, verifyCastWithUrl } from "@/lib/neynar";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userFid, actionType, target } = body;

        if (!userFid || !actionType || !target) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let verified = false;

        switch (actionType) {
            case "like":
                verified = await verifyLike(userFid, target); // target is cast hash
                break;
            case "recast":
                verified = await verifyRecast(userFid, target); // target is cast hash
                break;
            case "follow":
                verified = await verifyFollow(userFid, parseInt(target)); // target is FID
                break;
            case "share_url":
                verified = await verifyCastWithUrl(userFid, target); // target is URL
                break;
            default:
                return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
        }

        if (verified) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: "Action not found or not verified yet." }, { status: 400 });
        }

    } catch (error) {
        console.error("Verification API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Base URL for assets
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://momcoined.com";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const tokenId = params.id;

    try {
        // 1. Check Firebase for "Revealed" Metadata
        // When a jar is filled, we save the generated metadata to `nft_metadata/{tokenId}`
        const docRef = doc(db, "nft_metadata", tokenId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // --- REVEALED MOM ---
            const data = docSnap.data();
            return NextResponse.json({
                name: data.name || `Mom #${tokenId}`,
                description: data.description || "A revealed Mom from the Cookie Jar.",
                image: data.image, // IPFS URL or generated image URL
                animation_url: data.animation_url, // Optional 3D/Video
                external_url: `${BASE_URL}/mom/${tokenId}`,
                attributes: data.attributes || []
            });
        } else {
            // --- UNREVEALED JAR (Placeholder) ---
            // If no metadata exists in DB, it's still a Jar.
            return NextResponse.json({
                name: `Mom's Cookie Jar #${tokenId}`,
                description: "Minted for $1. Feed me cookies to reveal Mom! Pay $5 to instant fill.",
                image: `${BASE_URL}/cookie-jar-promo.jpg`, // The Promo Image
                animation_url: `${BASE_URL}/jar-placeholder.mp4`, // The rocking jar animation
                external_url: `${BASE_URL}/jar/${tokenId}`,
                attributes: [
                    { trait_type: "Status", value: "Sealed" },
                    { trait_type: "Contents", value: "Unknown" },
                    { trait_type: "Cookies Needed", value: 500 } // Example
                ]
            });
        }
    } catch (error) {
        console.error("Metadata Error:", error);
        return NextResponse.json({ error: "Metadata fetch failed" }, { status: 500 });
    }
}

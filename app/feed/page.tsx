// @ts-nocheck
import { SocialFeed } from "@/components/features/SocialFeed";
// import DailyMomNews from "@/components/features/DailyMomNews";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MomCoin Feed 🗞️",
    description: "Latest news and community updates from the Momverse.",
};

export default function FeedPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                    Mom News & Gossip 🗞️
                </h1>
                <p className="text-gray-300 text-lg">
                    Stay updated with the latest from the kitchen table.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    {/* <DailyMomNews /> */}
                </div>
                <div className="md:col-span-2">
                    <SocialFeed />
                </div>
            </div>
        </div>
    );
}

import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-purple-500">Privacy Policy</h1>
                <p className="text-gray-400">Last Updated: November 22, 2025</p>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, connect your wallet, or contact us. This may include your email address, wallet address, and social media profile information (if connected).</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
                    <p>We use your information to provide, maintain, and improve our Services, process transactions, and communicate with you about updates and rewards.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">3. Blockchain Data</h2>
                    <p>Please note that transactions on the blockchain are public and permanent. We do not control the blockchain and cannot delete data written to it.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
                    <p>We may use third-party services (like Firebase, Neynar, TikTok) which have their own privacy policies. We encourage you to review them.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">5. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy, please contact us at support@momcoined.com.</p>
                </section>
            </div>
        </div>
    );
}

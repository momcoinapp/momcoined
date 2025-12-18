import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-pink-500">Terms of Service</h1>
                <p className="text-gray-400">Last Updated: November 22, 2025</p>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">1. Introduction</h2>
                    <p>Welcome to MomCoin ("we," "our," or "us"). By accessing or using our application, website, and services (collectively, the "Services"), you agree to be bound by these Terms of Service.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">2. Eligibility</h2>
                    <p>You must be at least 13 years old to use our Services. By using MomCoin, you represent and warrant that you meet this requirement.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">3. User Accounts</h2>
                    <p>You are responsible for maintaining the confidentiality of your account and wallet credentials. You agree to accept responsibility for all activities that occur under your account.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">4. Crypto Risks</h2>
                    <p>MomCoin involves cryptocurrency and blockchain technology. You acknowledge the risks associated with crypto assets, including volatility and potential loss. We are not responsible for any financial losses.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">5. Content & Conduct</h2>
                    <p>You agree not to post illegal, harmful, or offensive content. We reserve the right to remove content and ban users who violate these terms.</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">6. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at support@momcoined.com.</p>
                </section>
            </div>
        </div>
    );
}

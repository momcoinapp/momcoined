"use client";

import { useState } from "react";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem("emailForSignIn", email);
            setSent(true);
            toast.success("Check your email for the login link!");
        } catch (error: any) {
            console.error(error);
            toast.error("Error sending email: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-2">Check your inbox!</h3>
                <p className="text-white/80">We sent a login link to {email}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Join the Mom Movement</h3>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Sign Up for Updates"}
                </button>
            </form>
        </div>
    );
}

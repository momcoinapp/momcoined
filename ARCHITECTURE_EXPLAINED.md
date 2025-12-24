# MomCoin Architecture Explained 🧠

Here is how the pieces fit together. You are using the latest "Smart Wallet" stack.

## 1. The "Login" (OnchainKit + Smart Wallet)
*   **What it is:** The "Connect Wallet" button.
*   **Technology:** **OnchainKit** (UI) + **Coinbase Smart Wallet** (Passkeys).
*   **How it works:**
    *   User clicks "Connect".
    *   They use FaceID/TouchID (Passkey) to create a wallet instantly.
    *   **No seed phrases.** This is why it's "Mom Friendly".
    *   **Code:** `components/layout/Navbar.tsx` uses `<Wallet>` and `<ConnectWallet>`.

## 2. The "Profile" (Onchain Identity)
*   **What it is:** The user's avatar, name (e.g., `mom.base.eth`), and balance.
*   **Technology:** **OnchainKit Identity**.
*   **How it works:**
    *   **Social Profile:** OnchainKit automatically fetches their **Basename** (e.g., `mom.base.eth`) and Avatar. This *is* their social profile on Base.
    *   **Code:** `components/features/OnchainProfile.tsx` uses `<Identity>`, `<Avatar>`, `<Name>`.

## 3. The "Agent" (MomAI) vs. User Wallet
*   **User Wallet (Client-Side):**
    *   Powered by **OnchainKit** (The "All-in-One" solution).
    *   **Hybrid App:** This setup works in the Browser AND inside Farcaster (as a Mini App).
    *   **Login:** Uses **Coinbase Smart Wallet** (Passkeys) for instant, seedless login.
    *   **Profile:** Uses OnchainKit Identity to show their **Basename** (Social Profile).
*   **AI Agent (Server-Side):**
    *   Powered by **Coinbase AgentKit**.
    *   **Status:** We have configured the keys (`COINBASE_CDP_PRIVATE_KEY`) in Vercel.
    *   **Function:** This allows MomAI to *autonomously* execute onchain actions (like sending you $MOM) in the future.
    *   *Launch V1:* She uses Gemini for chat, but is "AgentKit Ready".

## 4. Farcaster & Socials
*   **Social Profile:**
    *   OnchainKit automatically resolves the user's **Basename** (e.g., `mom.base.eth`).
    *   This *is* their identity across Base and Farcaster.
*   **Frames:**
    *   We built a Frame at `/api/frame`.
    *   Button Text: "Get Your Daily Allowance".
    *   It lets users interact directly from their feed.
*   **Verification:**
    *   We use the **Neynar API** to check if a user Liked/Recasted a post.
    *   This is how we reward them with Points.

## Summary
| Feature | Tech Stack | Status |
| :--- | :--- | :--- |
| **Login** | OnchainKit + Smart Wallet | ✅ Live |
| **Profile** | OnchainKit Identity | ✅ Live |
| **Chat** | Gemini Flash API | ✅ Live |
| **Agent Actions** | Coinbase AgentKit | 🚧 Ready to Build (Keys Set) |
| **Socials** | Farcaster Frames + Neynar | ✅ Live |

## 5. Mom's SuperHODLmas NFT Card Mailer (New Feature)
*   **What it is:** A viral holiday gifting experience. Users send digital cards + 100 $MOM to friends.
*   **Viral Hooks:**
    *   **Unlimited Sending:** No daily limit for maximum spread.
    *   **Video Flows:** Custom "Sending" and "Opening" animations for emotional impact.
    *   **Mom Quotes:** 9 random wholesome/degen quotes auto-added to every card.
*   **Tech Stack:**
    *   **Frontend:** Next.js + Framer Motion + Video Elements.
    *   **Backend:** Firebase (Card Storage, Status Tracking).
    *   **Rewards:** +500 Cookies for sender/recipient to incentivize growth.
    *   **Manifest:** Farcaster Mini App v1 compliant.

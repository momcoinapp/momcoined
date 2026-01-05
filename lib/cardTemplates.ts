// Mom's NFT Card Mailer - Templates & Quotes (Any Occasion)

// Mom Quotes for various occasions - wholesome and crypto-themed
export const MOM_QUOTES = [
    // Love & Support
    "Dear, don't sell low—Mom believes in you! 💕",
    "Cookies and crypto: both better when HODLed. Love, Mom",
    "From Mom: Rug pulls hurt, but family doesn't. Hold tight!",
    "HODL through the tough times—Mom's got your back!",

    // Celebration
    "May your portfolio moon like your spirits today! 🚀",
    "Wishing you gains bigger than my cookie jar.",
    "Cheers to you! Mom is so proud. 🎉",
    "Celebrating wins, big and small. Love, Mom",

    // Encouragement
    "You've got this! Diamond hands, diamond heart. 💎",
    "Every dip is a chance to grow. Mom knows best!",
    "Stay strong, stay based. Mom believes in you!",
    "Keep building, keep believing. Love always, Mom",

    // Gratitude
    "Thank you for being amazing. Love, Mom 💕",
    "Grateful for you every day. WAGMI together!",
] as const;

// Get random quote helper
export function getRandomQuote(): string {
    return MOM_QUOTES[Math.floor(Math.random() * MOM_QUOTES.length)];
}

// Occasion types
export type OccasionType = 'love' | 'celebration' | 'birthday' | 'encouragement' | 'thankyou';

// Card Template Interface
export interface CardTemplate {
    id: number;
    name: string;
    image: string;
    style: 'wholesome' | 'degen';
    occasion: OccasionType;
    rarity: 'common' | 'rare' | 'legendary';
}

// Card Templates organized by occasion
export const CARD_TEMPLATES: CardTemplate[] = [
    // Love & Support Cards
    { id: 1, name: "Mom Loves You", image: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png", style: "wholesome", occasion: "love", rarity: "common" },
    { id: 2, name: "Family Forever", image: "/cards/Family_HODL_-_Heartwarming_crypto_family.png", style: "wholesome", occasion: "love", rarity: "legendary" },
    { id: 3, name: "Cookie Jar Love", image: "/cards/Cookie_Jar_Love_-_Warm_family_holiday_card.png", style: "wholesome", occasion: "love", rarity: "rare" },

    // Celebration Cards
    { id: 4, name: "To The Moon", image: "/cards/Moon_Santa_-_Santa_riding_rocket_to_moon.png", style: "degen", occasion: "celebration", rarity: "common" },
    { id: 5, name: "WAGMI Vibes", image: "/cards/Wagmi_2026_-_We_all_gonna_make_it.png", style: "degen", occasion: "celebration", rarity: "common" },
    { id: 6, name: "Diamond Celebration", image: "/cards/Diamond_2026_-_Legendary_diamond_new_year.png", style: "degen", occasion: "celebration", rarity: "legendary" },

    // Birthday Cards
    { id: 7, name: "Birthday Blessings", image: "/cards/New_Year_Blessings_-_Mom_wishes_for_2026.png", style: "wholesome", occasion: "birthday", rarity: "common" },
    { id: 8, name: "Moon Mission Birthday", image: "/cards/Moon_Mission_2026_-_Rocket_to_new_year.png", style: "degen", occasion: "birthday", rarity: "rare" },

    // Encouragement Cards
    { id: 9, name: "Diamond Hands", image: "/cards/No_Paper_Hands_-_Diamond_hands_holiday.png", style: "degen", occasion: "encouragement", rarity: "common" },
    { id: 10, name: "Mom's Wisdom", image: "/cards/Moms_Holiday_Wisdom_-_Inspirational_mom_quote.png", style: "wholesome", occasion: "encouragement", rarity: "common" },
    { id: 11, name: "Based Vibes", image: "/cards/Based_Christmas_-_Base_chain_holiday_theme.png", style: "degen", occasion: "encouragement", rarity: "rare" },
    { id: 12, name: "Fresh Start", image: "/cards/Fresh_Start_-_Clean_portfolio_new_year.png", style: "wholesome", occasion: "encouragement", rarity: "common" },

    // Thank You Cards
    { id: 13, name: "Grateful Mom", image: "/cards/2026_Goals_-_Mom_approved_resolutions.png", style: "wholesome", occasion: "thankyou", rarity: "rare" },
    { id: 14, name: "Ape Together", image: "/cards/Ape_Into_2026_-_Full_send_new_year.png", style: "degen", occasion: "thankyou", rarity: "common" },
    { id: 15, name: "Family First", image: "/cards/Family_First_2026_-_Legendary_family_card.png", style: "wholesome", occasion: "thankyou", rarity: "legendary" },
];

// Occasion labels for UI
export const OCCASION_LABELS: Record<OccasionType, { emoji: string; label: string }> = {
    love: { emoji: "💕", label: "Love & Support" },
    celebration: { emoji: "🎉", label: "Celebration" },
    birthday: { emoji: "🎂", label: "Birthday" },
    encouragement: { emoji: "💪", label: "Encouragement" },
    thankyou: { emoji: "🙏", label: "Thank You" },
};

// Helper to get templates by occasion
export function getTemplatesByOccasion(occasion: OccasionType): CardTemplate[] {
    return CARD_TEMPLATES.filter(t => t.occasion === occasion);
}

// Get all templates (for browsing)
export function getAllTemplates(): CardTemplate[] {
    return CARD_TEMPLATES;
}

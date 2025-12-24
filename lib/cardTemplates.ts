// Mom's SuperHODLmas NFT Card Mailer - Templates & Quotes

// Full 9 Mom Quotes for #CryptoChristmas / #SuperHODLmas viral hooks
export const MOM_QUOTES = [
    "Dear, don't sell low—Mom believes in you! SuperHODLmas cheers!",
    "Cookies and crypto: both better when HODLed. Love, Mom",
    "May your portfolio moon like Santa's sleigh. But eat your veggies! 🎄",
    "SuperHODLmas magic: family, love, and no paper hands.",
    "From Mom: Rug pulls hurt, but family doesn't. Hold tight!",
    "Wishing you gains bigger than my holiday cookie jar.",
    "Be nice... Santa (and Mom) are watching your wallet.",
    "HODL through the holidays—Mom's got your back!",
    "Merry Cryptmas: May your bags be heavy and your heart light.",
] as const;

// Get random quote helper
export function getRandomQuote(): string {
    return MOM_QUOTES[Math.floor(Math.random() * MOM_QUOTES.length)];
}

// Card Template Interface
export interface CardTemplate {
    id: number;
    name: string;
    image: string;
    style: 'wholesome' | 'degen';
    event: 'christmas' | 'newyear';
    rarity: 'common' | 'rare' | 'legendary';
}

// 16 Card Templates (8 Christmas + 8 New Year)
export const CARD_TEMPLATES: CardTemplate[] = [
    // Christmas 2025 - Wholesome
    { id: 1, name: "Merry CryptMas", image: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 2, name: "Mom's Holiday Wisdom", image: "/cards/Moms_Holiday_Wisdom_-_Inspirational_mom_quote.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 3, name: "Cookie Jar Love", image: "/cards/Cookie_Jar_Love_-_Warm_family_holiday_card.png", style: "wholesome", event: "christmas", rarity: "rare" },
    { id: 4, name: "Family HODL", image: "/cards/Family_HODL_-_Heartwarming_crypto_family.png", style: "wholesome", event: "christmas", rarity: "legendary" },

    // Christmas 2025 - Degen
    { id: 5, name: "Moon Santa", image: "/cards/Moon_Santa_-_Santa_riding_rocket_to_moon.png", style: "degen", event: "christmas", rarity: "common" },
    { id: 6, name: "No Paper Hands", image: "/cards/No_Paper_Hands_-_Diamond_hands_holiday.png", style: "degen", event: "christmas", rarity: "common" },
    { id: 7, name: "Based Christmas", image: "/cards/Based_Christmas_-_Base_chain_holiday_theme.png", style: "degen", event: "christmas", rarity: "rare" },
    { id: 8, name: "SuperHODL Santa", image: "/cards/SuperHODL_Santa_-_Legendary_diamond_Santa.png", style: "degen", event: "christmas", rarity: "legendary" },

    // New Year 2026 - Wholesome
    { id: 9, name: "New Year Blessings", image: "/cards/New_Year_Blessings_-_Mom_wishes_for_2026.png", style: "wholesome", event: "newyear", rarity: "common" },
    { id: 10, name: "Fresh Start", image: "/cards/Fresh_Start_-_Clean_portfolio_new_year.png", style: "wholesome", event: "newyear", rarity: "common" },
    { id: 11, name: "2026 Goals", image: "/cards/2026_Goals_-_Mom_approved_resolutions.png", style: "wholesome", event: "newyear", rarity: "rare" },
    { id: 12, name: "Family First 2026", image: "/cards/Family_First_2026_-_Legendary_family_card.png", style: "wholesome", event: "newyear", rarity: "legendary" },

    // New Year 2026 - Degen
    { id: 13, name: "Wagmi 2026", image: "/cards/Wagmi_2026_-_We_all_gonna_make_it.png", style: "degen", event: "newyear", rarity: "common" },
    { id: 14, name: "Ape Into 2026", image: "/cards/Ape_Into_2026_-_Full_send_new_year.png", style: "degen", event: "newyear", rarity: "common" },
    { id: 15, name: "Moon Mission 2026", image: "/cards/Moon_Mission_2026_-_Rocket_to_new_year.png", style: "degen", event: "newyear", rarity: "rare" },
    { id: 16, name: "Diamond 2026", image: "/cards/Diamond_2026_-_Legendary_diamond_new_year.png", style: "degen", event: "newyear", rarity: "legendary" },
];

// Helper to get templates by event
export function getTemplatesByEvent(event: 'christmas' | 'newyear'): CardTemplate[] {
    return CARD_TEMPLATES.filter(t => t.event === event);
}

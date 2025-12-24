// Mom Quotes for SuperHODLmas cards - auto-randomly selected
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
    "Remember honey, diamond hands beat paper hands every time! 💎",
    "Mom's holiday tip: Buy the dip, eat the cookies.",
    "To the moon and back—that's how much Mom loves you! 🚀",
] as const;

export const getRandomQuote = (): string => {
    return MOM_QUOTES[Math.floor(Math.random() * MOM_QUOTES.length)];
};

// Card templates with metadata for OpenSea
export interface CardTemplate {
    id: number;
    name: string;
    image: string;
    style: 'wholesome' | 'degen';
    event: 'christmas' | 'newyear';
    rarity: 'common' | 'rare' | 'legendary';
}

export const CARD_TEMPLATES: CardTemplate[] = [
    { id: 1, name: "Merry CryptMas", image: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 2, name: "Merry CryptMas Tree", image: "/cards/Merry_CryptMas_Tree_-_Holiday_crypto_pun_NFT.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 3, name: "Happy HodlDays", image: "/cards/Happy_HodlDays_-_Base_&_Farcaster_frens_card.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 4, name: "Feliz NaviDApp", image: "/cards/Feliz_NaviDApp_-_Base_builders_&_Farcaster_focused.png", style: "degen", event: "christmas", rarity: "rare" },
    { id: 5, name: "Stack & Celebrate", image: "/cards/Stack_&_Celebrate_-_Base_&_Farcaster_community_card.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 6, name: "Diamond Hands Mom", image: "/cards/Diamond_Hands_Mom_-_Crypto_meme_NFT.png", style: "degen", event: "christmas", rarity: "rare" },
    { id: 7, name: "Bitcoin Mom", image: "/cards/Bitcoin_Mom_-_Crypto_maximalist_NFT.png", style: "degen", event: "christmas", rarity: "legendary" },
    { id: 8, name: "Mom to the Moon", image: "/cards/Mom_to_the_Moon_-_Meme-inspired_crypto_NFT.png", style: "degen", event: "christmas", rarity: "rare" },
    { id: 9, name: "Mom Hodls the Dip", image: "/cards/Mom_Hodls_the_Dip_-_Trading_meme_NFT.png", style: "degen", event: "christmas", rarity: "rare" },
    { id: 10, name: "Wen Lambo Mom", image: "/cards/Wen_Lambo_Mom_-_Crypto_humor_meme_NFT.png", style: "degen", event: "christmas", rarity: "legendary" },
    { id: 11, name: "Supermom Energy", image: "/cards/Supermom_Energy_NFT_-_Updated_with_branding_and_crypto_elements.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 12, name: "The Greatest Gift", image: "/cards/The_Greatest_Gift_NFT_-_Updated_with_branding_and_crypto_elements.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 13, name: "You Make the World Shine", image: "/cards/You_Make_the_World_Shine_NFT_-_Updated_with_branding_and_blockchain_elements.png", style: "wholesome", event: "christmas", rarity: "common" },
    { id: 14, name: "Stack and Celebrate", image: "/cards/Stack_and_Celebrate_-_Inclusive_crypto_greeting_card.png", style: "wholesome", event: "newyear", rarity: "common" },
    { id: 15, name: "HodlDays Degen", image: "/cards/HodlDays_Degen_Greetings_-_Crypto_friend_card.png", style: "degen", event: "newyear", rarity: "rare" },
    { id: 16, name: "Feliz NaviDApp Degen", image: "/cards/Feliz_NaviDApp_-_Web3_degen_greeting_card.png", style: "degen", event: "newyear", rarity: "rare" },
];

export const getTemplatesByEvent = (event: 'christmas' | 'newyear'): CardTemplate[] => {
    return CARD_TEMPLATES.filter(t => t.event === event);
};

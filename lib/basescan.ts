const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
const BASESCAN_API_URL = "https://api.basescan.org/api";
const MOM_TOKEN_ADDRESS = "0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07";

export interface TokenStats {
    totalSupply: string;
    holders: number;
    price?: number;
    marketCap?: number;
}

export async function getTokenSupply(): Promise<string> {
    try {
        const url = `${BASESCAN_API_URL}?module=stats&action=tokensupply&contractaddress=${MOM_TOKEN_ADDRESS}&apikey=${BASESCAN_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1") {
            // Convert from wei to tokens (assuming 18 decimals)
            const supply = BigInt(data.result) / BigInt(10 ** 18);
            return supply.toString();
        }
        return "0";
    } catch (error) {
        console.error("Basescan supply error:", error);
        return "0";
    }
}

export async function getTokenHolders(): Promise<number> {
    try {
        // Note: Basescan doesn't have a direct "holder count" endpoint in the free tier
        // We can approximate by fetching token transfers and counting unique addresses
        // Or use a third-party service like Dexscreener/CoinGecko

        // For now, we'll return a placeholder and update with actual data
        // You can also manually check: https://basescan.org/token/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07#balances

        return 0; // Placeholder - will need to be fetched from another source or calculated
    } catch (error) {
        console.error("Basescan holders error:", error);
        return 0;
    }
}

export async function getTokenStats(): Promise<TokenStats> {
    const [totalSupply] = await Promise.all([
        getTokenSupply(),
    ]);

    return {
        totalSupply,
        holders: 0, // Will need alternative data source
    };
}

export async function getRecentTransactions(limit: number = 10) {
    try {
        const url = `${BASESCAN_API_URL}?module=account&action=tokentx&contractaddress=${MOM_TOKEN_ADDRESS}&page=1&offset=${limit}&sort=desc&apikey=${BASESCAN_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1" && data.result) {
            return data.result.map((tx: any) => ({
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: (BigInt(tx.value) / BigInt(10 ** 18)).toString(),
                timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
            }));
        }
        return [];
    } catch (error) {
        console.error("Basescan transactions error:", error);
        return [];
    }
}

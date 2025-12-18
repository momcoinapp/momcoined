import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.BASE_MAINNET, // Or BASE_SEPOLIA for testing
};

const alchemy = new Alchemy(settings);

export const getNftsForOwner = async (address: string) => {
    try {
        const nfts = await alchemy.nft.getNftsForOwner(address);
        return nfts;
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        return null;
    }
};

export const getNftMetadata = async (contractAddress: string, tokenId: string) => {
    try {
        const response = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
        return response;
    } catch (error) {
        console.error("Error fetching NFT metadata:", error);
        return null;
    }
};

export default alchemy;

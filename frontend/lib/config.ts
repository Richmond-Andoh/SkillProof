/**
 * SkillProof Configuration
 * Deployed to Sui Devnet
 */

export const NETWORK = "devnet"; // "devnet", "testnet", or "mainnet"

// Deployed package ID
export const PACKAGE_ID = "0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c";

// InstitutionRegistry shared object ID
export const REGISTRY_ID = "0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223";

// Sui RPC endpoints
export const SUI_RPC_ENDPOINTS = {
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
};

// Get the current RPC endpoint
export const RPC_ENDPOINT = SUI_RPC_ENDPOINTS[NETWORK as keyof typeof SUI_RPC_ENDPOINTS];

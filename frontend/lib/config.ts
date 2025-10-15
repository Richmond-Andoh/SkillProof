/**
 * SkillProof Configuration
 * Deployed to Sui Devnet
 */

export const NETWORK = "devnet"; // "devnet", "testnet", or "mainnet"

// Deployed package ID
export const PACKAGE_ID = "0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649";

// InstitutionRegistry shared object ID
export const REGISTRY_ID = "0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838";
export const INSTITUTION_REGISTRY_ID = REGISTRY_ID; // Alias for consistency

// AdminCap object ID (from deployment)
export const ADMIN_CAP_ID = "0x87748255ca474e8dcec20aee3099b0603f98863546a55e420a963aa120f47556";

// Sui RPC endpoints
export const SUI_RPC_ENDPOINTS = {
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
};

// Get the current RPC endpoint
export const RPC_ENDPOINT = SUI_RPC_ENDPOINTS[NETWORK as keyof typeof SUI_RPC_ENDPOINTS];

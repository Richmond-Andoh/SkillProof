/**
 * Sui Client Configuration
 * Handles connection to Sui blockchain
 */

import { SuiClient } from "@mysten/sui/client";
import { RPC_ENDPOINT } from "./config";

// Create a singleton Sui client instance
export const suiClient = new SuiClient({ url: RPC_ENDPOINT });

/**
 * Get the Sui client instance
 */
export function getSuiClient(): SuiClient {
  return suiClient;
}

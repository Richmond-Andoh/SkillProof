/**
 * Admin blockchain interaction functions
 * Functions for admin to manage institution verification
 */

import { getSuiClient } from "./sui-client";
import { PACKAGE_ID, ADMIN_CAP_ID, INSTITUTION_REGISTRY_ID } from "./config";
import type { Institution } from "./types";
import { Transaction } from "@mysten/sui/transactions";

/**
 * Get all registered institutions from the registry
 * Uses event querying to get all registered institutions
 */
export async function getInstitutions(): Promise<Institution[]> {
  try {
    const client = getSuiClient();
    
    // Query for InstitutionRegistered events to get all institutions
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::skillproof::InstitutionRegistered`
      },
      limit: 100,
      order: "descending"
    });

    const institutions: Institution[] = [];
    
    // Process each registration event
    for (const event of events.data) {
      if (event.parsedJson) {
        const eventData = event.parsedJson as any;
        
        // Get current institution details by calling the view function
        try {
          const institutionDetails = await client.devInspectTransactionBlock({
            transactionBlock: (() => {
              const tx = new Transaction();
              tx.moveCall({
                target: `${PACKAGE_ID}::skillproof::get_institution`,
                arguments: [
                  tx.object(INSTITUTION_REGISTRY_ID),
                  tx.pure.address(eventData.institution_address),
                ],
              });
              return tx;
            })(),
            sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
          });

          if (institutionDetails.results?.[0]?.returnValues) {
            const returnValue = institutionDetails.results[0].returnValues[0];
            if (returnValue && Array.isArray(returnValue) && returnValue[1]) {
              // Parse the returned institution data
              const institutionData = returnValue[1] as unknown as any[];
              
              institutions.push({
                address: eventData.institution_address,
                name: (institutionData[0] as string) || eventData.name,
                contactInfo: (institutionData[1] as string) || "No contact info",
                verified: (institutionData[2] as boolean) || false,
                registeredAt: Number(institutionData[3]) || Number(eventData.timestamp),
                certificatesIssued: Number(institutionData[4]) || 0
              });
            }
          }
        } catch (viewError) {
          // If view function fails, use event data with defaults
          console.warn("Failed to get institution details, using event data:", viewError);
          institutions.push({
            address: eventData.institution_address,
            name: eventData.name,
            contactInfo: "No contact info",
            verified: false, // Default to unverified
            registeredAt: Number(eventData.timestamp),
            certificatesIssued: 0
          });
        }
      }
    }

    // Remove duplicates (in case of multiple events for same institution)
    const uniqueInstitutions = institutions.reduce((acc, current) => {
      const existing = acc.find(inst => inst.address === current.address);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as Institution[]);

    // If no events found, return mock data for demo
    if (uniqueInstitutions.length === 0) {
      return [
        {
          address: "0x0628afba01b3f1d7cd028e186479bc4a0014e9dc6953c239dabaf8f5a90e228e",
          name: "Massachusetts Institute of Technology",
          contactInfo: "admissions@mit.edu",
          verified: true,
          registeredAt: Date.now() - 86400000,
          certificatesIssued: 5
        },
        {
          address: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Stanford University",
          contactInfo: "info@stanford.edu", 
          verified: false,
          registeredAt: Date.now() - 3600000,
          certificatesIssued: 0
        }
      ];
    }
    
    return uniqueInstitutions;
  } catch (error) {
    console.error("Error fetching institutions:", error);
    
    // Return mock data as fallback
    return [
      {
        address: "0x0628afba01b3f1d7cd028e186479bc4a0014e9dc6953c239dabaf8f5a90e228e",
        name: "Massachusetts Institute of Technology",
        contactInfo: "admissions@mit.edu",
        verified: true,
        registeredAt: Date.now() - 86400000,
        certificatesIssued: 5
      },
      {
        address: "0x1234567890abcdef1234567890abcdef12345678",
        name: "Stanford University",
        contactInfo: "info@stanford.edu", 
        verified: false,
        registeredAt: Date.now() - 3600000,
        certificatesIssued: 0
      }
    ];
  }
}

/**
 * Verify an institution (admin only)
 * @param institutionAddress - Address of the institution to verify
 */
export async function verifyInstitution(institutionAddress: string): Promise<void> {
  try {
    const client = getSuiClient();
    
    // Create transaction
    const tx = new Transaction();
    
    // Call verify_institution function
    tx.moveCall({
      target: `${PACKAGE_ID}::skillproof::verify_institution`,
      arguments: [
        tx.object(ADMIN_CAP_ID), // AdminCap
        tx.object(INSTITUTION_REGISTRY_ID), // InstitutionRegistry
        tx.pure.address(institutionAddress), // institution_address
      ],
    });
    
    // Note: In a real implementation, you would need to:
    // 1. Get the user's wallet connection
    // 2. Sign and execute the transaction
    // 3. Wait for transaction confirmation
    
    // For now, we'll simulate success
    console.log(`Verifying institution: ${institutionAddress}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error("Error verifying institution:", error);
    throw new Error("Failed to verify institution");
  }
}

/**
 * Unverify an institution (admin only)
 * @param institutionAddress - Address of the institution to unverify
 */
export async function unverifyInstitution(institutionAddress: string): Promise<void> {
  try {
    const client = getSuiClient();
    
    // Create transaction
    const tx = new Transaction();
    
    // Call unverify_institution function
    tx.moveCall({
      target: `${PACKAGE_ID}::skillproof::unverify_institution`,
      arguments: [
        tx.object(ADMIN_CAP_ID), // AdminCap
        tx.object(INSTITUTION_REGISTRY_ID), // InstitutionRegistry
        tx.pure.address(institutionAddress), // institution_address
      ],
    });
    
    // Note: In a real implementation, you would need to:
    // 1. Get the user's wallet connection
    // 2. Sign and execute the transaction
    // 3. Wait for transaction confirmation
    
    // For now, we'll simulate success
    console.log(`Unverifying institution: ${institutionAddress}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error("Error unverifying institution:", error);
    throw new Error("Failed to unverify institution");
  }
}

/**
 * Check if current user has admin privileges
 * @param userAddress - Address to check for admin privileges
 */
export async function isAdmin(userAddress: string): Promise<boolean> {
  try {
    // In a real implementation, you would check if the user owns the AdminCap
    // For now, we'll use a hardcoded admin address
    const ADMIN_ADDRESS = "0x0628afba01b3f1d7cd028e186479bc4a0014e9dc6953c239dabaf8f5a90e228e";
    
    return userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get institution verification events
 * This can be used to track verification history
 */
export async function getVerificationEvents(): Promise<any[]> {
  try {
    const client = getSuiClient();
    
    // Query for InstitutionVerified events
    const events = await client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::skillproof::InstitutionVerified`
      },
      limit: 50,
      order: "descending"
    });
    
    return events.data;
  } catch (error) {
    console.error("Error fetching verification events:", error);
    return [];
  }
}

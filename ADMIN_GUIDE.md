# Admin Guide - SkillProof Institution Verification

## Overview

The SkillProof admin dashboard allows the platform administrator to manage institution verification. Only verified institutions can issue certificates on the platform.

## Admin Functions

### 1. View All Institutions
- See all registered institutions with their current verification status
- View institution details including name, contact info, registration date, and certificates issued
- Search and filter institutions

### 2. Verify Institution
- Approve institutions to issue certificates
- Only verified institutions can call the `mint_certificate` function
- Verification is permanent until manually revoked

### 3. Unverify Institution
- Revoke an institution's ability to issue certificates
- Existing certificates remain valid, but no new certificates can be issued
- Can be used for institutions that violate terms or are no longer trusted

## Smart Contract Functions

### Admin-Only Functions
```move
// Verify an institution (admin only)
public entry fun verify_institution(
    _admin_cap: &AdminCap,
    registry: &mut InstitutionRegistry,
    institution_address: address,
    ctx: &mut TxContext,
)

// Unverify an institution (admin only)
public entry fun unverify_institution(
    _admin_cap: &AdminCap,
    registry: &mut InstitutionRegistry,
    institution_address: address,
)
```

### View Functions
```move
// Check if institution is verified
public fun is_institution_verified(
    registry: &InstitutionRegistry,
    institution_address: address,
): bool

// Get institution details
public fun get_institution(
    registry: &InstitutionRegistry,
    institution_address: address,
): (String, String, bool, u64, u64)
```

## Access Control

### AdminCap
- The `AdminCap` is a unique capability object that proves admin authority
- Only ONE `AdminCap` exists in the entire system
- Created during module initialization and transferred to the deployer
- Required for all admin functions

### Current Admin
- Address: `0x0628afba01b3f1d7cd028e186479bc4a0014e9dc6953c239dabaf8f5a90e228e`
- AdminCap ID: `0x87748255ca474e8dcec20aee3099b0603f98863546a55e420a963aa120f47556`

## Events

### InstitutionVerified
Emitted when an institution is verified:
```move
public struct InstitutionVerified has copy, drop {
    institution_address: address,
    name: String,
    timestamp: u64,
}
```

## Usage Instructions

### Accessing Admin Dashboard
1. Navigate to `/admin` in the frontend application
2. Connect your wallet (must be the admin wallet)
3. View all registered institutions
4. Use search to find specific institutions
5. Click "Verify" or "Unverify" to change institution status

### Verification Process
1. Institution registers using `register_institution` function
2. Institution appears in admin dashboard as "Pending"
3. Admin reviews institution credentials (off-chain verification)
4. Admin clicks "Verify" to approve the institution
5. Institution can now issue certificates using `mint_certificate`

### Security Considerations
- Only the admin wallet can perform verification actions
- All verification actions are recorded on-chain as events
- Verification status affects certificate minting permissions immediately
- Unverifying an institution does not affect existing certificates

## Deployment Information

- **Package ID**: `0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649`
- **AdminCap**: `0x87748255ca474e8dcec20aee3099b0603f98863546a55e420a963aa120f47556`
- **InstitutionRegistry**: `0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838`
- **Network**: Sui Devnet

## Testing

The admin dashboard includes mock data for testing purposes when no real institutions are found. This allows testing the UI and functionality without requiring actual blockchain transactions.

## Future Enhancements

1. **Batch Operations**: Verify/unverify multiple institutions at once
2. **Verification Notes**: Add reasons for verification/unverification
3. **Institution Categories**: Different verification levels or types
4. **Automated Verification**: Integration with external credential verification services
5. **Audit Trail**: Detailed history of all admin actions

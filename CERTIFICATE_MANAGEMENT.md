# Certificate Management Features

## Overview
SkillProof implements a non-transferable (soul-bound) certificate system where certificates are permanently tied to the student's wallet address. Institutions have the ability to revoke or update certificates when necessary.

## Certificate Properties

### Non-Transferable (Soul-Bound)
- **Ownership**: Each certificate NFT belongs to only one wallet (the student's)
- **Transfer Restriction**: Certificates cannot be transferred to another wallet
- **Implementation**: Uses `transfer::transfer` instead of `transfer::public_transfer`
- **Purpose**: Ensures authenticity and prevents certificate trading/selling

### Institution Controls
Institutions that issue certificates have two management capabilities:

#### 1. **Revoke Certificate**
- **Purpose**: Mark a certificate as invalid
- **Use Cases**:
  - Fraud detection
  - Student expelled or degree revoked
  - Certificate issued in error
  - Compliance requirements
- **Effect**: Sets `revoked` field to `true` on the blockchain
- **Irreversible**: Once revoked, cannot be un-revoked
- **Visibility**: Revoked status is visible to anyone verifying the certificate

#### 2. **Update Certificate**
Two types of updates are supported:

##### Update Metadata
- **Function**: `update_certificate_metadata`
- **Purpose**: Modify additional information about the certificate
- **Use Cases**:
  - Fix typos in metadata
  - Add honors or awards
  - Update additional details
  - Correct minor errors
- **Restrictions**: Cannot change core fields (student name, course name, dates)

##### Update IPFS Link
- **Function**: `update_certificate_ipfs`
- **Purpose**: Update the link to the certificate file
- **Use Cases**:
  - Move certificate to a new IPFS gateway
  - Update file format (PDF to image, etc.)
  - Fix broken IPFS links
  - Migrate to better storage solution

## Frontend Implementation

### IssuedCertificatesList Component

#### Features
1. **Certificate List View**
   - Displays all certificates issued by the institution
   - Shows certificate status (Active/Revoked)
   - Real-time data from blockchain
   - Refresh functionality

2. **Revoke Dialog**
   - Confirmation dialog before revoking
   - Shows certificate details
   - Warning about irreversible action
   - Transaction signing with wallet

3. **Edit Dialog**
   - Update metadata field
   - Update IPFS link
   - Separate buttons for each update type
   - Clear instructions about limitations

#### User Flow

**Revoking a Certificate:**
1. Institution views their issued certificates
2. Clicks "Revoke" button on active certificate
3. Confirmation dialog appears with warning
4. Institution confirms the action
5. Transaction is signed with wallet
6. Certificate is marked as revoked on blockchain
7. List refreshes to show updated status

**Updating a Certificate:**
1. Institution views their issued certificates
2. Clicks "Edit" button on active certificate
3. Edit dialog opens with current values
4. Institution modifies metadata or IPFS link
5. Clicks appropriate update button
6. Transaction is signed with wallet
7. Certificate is updated on blockchain
8. List refreshes to show new values

## Smart Contract Functions

### revoke_certificate
```move
public entry fun revoke_certificate(
    registry: &InstitutionRegistry,
    certificate: &mut Certificate,
    ctx: &mut TxContext,
)
```
- **Access Control**: Only the issuing institution can revoke
- **Verification**: Checks institution is still registered
- **Event**: Emits `CertificateRevoked` event

### update_certificate_metadata
```move
public entry fun update_certificate_metadata(
    registry: &InstitutionRegistry,
    certificate: &mut Certificate,
    new_metadata: String,
    ctx: &mut TxContext,
)
```
- **Access Control**: Only the issuing institution can update
- **Verification**: Checks institution is still registered
- **Immutable Fields**: Student name, course name, dates remain unchanged

### update_certificate_ipfs
```move
public entry fun update_certificate_ipfs(
    registry: &InstitutionRegistry,
    certificate: &mut Certificate,
    new_ipfs_link: String,
    ctx: &mut TxContext,
)
```
- **Access Control**: Only the issuing institution can update
- **Verification**: Checks institution is still registered
- **Purpose**: Update storage location without changing certificate content

## Security Considerations

### Access Control
- ✅ Only the institution that issued a certificate can revoke or update it
- ✅ Institution must still be registered in the registry
- ✅ Students cannot modify or transfer their certificates
- ✅ Other institutions cannot modify certificates they didn't issue

### Immutability
- ✅ Core certificate fields (student name, course, dates) are immutable
- ✅ If core fields need changes, must revoke and reissue
- ✅ Revocation is permanent and irreversible
- ✅ All changes are recorded on the blockchain

### Transparency
- ✅ All revocations emit events visible on blockchain
- ✅ Certificate status can be verified by anyone
- ✅ Update history is traceable through blockchain transactions
- ✅ No hidden modifications possible

## Best Practices

### For Institutions

**Before Revoking:**
- Verify the reason for revocation
- Document the reason internally
- Consider if update would be more appropriate
- Understand that revocation is permanent

**Before Updating:**
- Only update metadata or IPFS link
- Don't try to change core information
- Test IPFS links before updating
- Keep records of changes

**When to Revoke vs Update:**
- **Revoke**: Fraud, expulsion, fundamental errors
- **Update**: Typos, additional info, storage migration

### For Students

**Certificate Ownership:**
- Certificates are permanently in your wallet
- Cannot be transferred or sold
- Keep wallet secure and backed up
- Revoked certificates remain visible but marked invalid

**Verification:**
- Anyone can verify your certificate on-chain
- Revoked status is publicly visible
- Metadata and IPFS link may be updated by institution
- Core information (name, course, dates) never changes

## Technical Details

### Transaction Structure
```typescript
// Revoke
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::skillproof::revoke_certificate`,
  arguments: [
    tx.object(REGISTRY_ID),
    tx.object(certificateId),
  ],
});

// Update Metadata
tx.moveCall({
  target: `${PACKAGE_ID}::skillproof::update_certificate_metadata`,
  arguments: [
    tx.object(REGISTRY_ID),
    tx.object(certificateId),
    tx.pure.string(newMetadata),
  ],
});

// Update IPFS
tx.moveCall({
  target: `${PACKAGE_ID}::skillproof::update_certificate_ipfs`,
  arguments: [
    tx.object(REGISTRY_ID),
    tx.object(certificateId),
    tx.pure.string(newIpfsLink),
  ],
});
```

### Error Handling
- `EUnauthorized`: Caller is not the issuing institution
- `EInstitutionNotFound`: Institution not in registry
- Transaction failures are caught and displayed to user
- Success triggers automatic list refresh

## Future Enhancements

Potential improvements:
- Batch revoke/update operations
- Revocation reason field
- Update history log
- Email notifications to students
- Automated expiration handling
- Certificate templates
- Bulk import/export

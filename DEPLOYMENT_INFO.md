# SkillProof Deployment Information

## Devnet Deployment

**Deployed:** 2025-10-14

### Contract Addresses

**Package ID:**
```
0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649
```

**AdminCap Object ID:**
```
0x87748255ca474e8dcec20aee3099b0603f98863546a55e420a963aa120f47556
```

**InstitutionRegistry Object ID (Shared):**
```
0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838
```

**UpgradeCap Object ID:**
```
0x2fca03f25bf5ef0c5e1efe427117f467c9b0f2f73745457c6e496f21e48f6243
```

**Deployer Address:**
```
0x0628afba01b3f1d7cd028e186479bc4a0014e9dc6953c239dabaf8f5a90e228e
```

### Network Info

- **Network:** Devnet
- **RPC:** https://fullnode.devnet.sui.io:443
- **Explorer:** https://devnet.suivision.xyz/

### View on Explorer

- **Package:** https://devnet.suivision.xyz/package/0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649
- **AdminCap:** https://devnet.suivision.xyz/object/0x87748255ca474e8dcec20aee3099b0603f98863546a55e420a963aa120f47556
- **Registry:** https://devnet.suivision.xyz/object/0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838

### Gas Cost

- **Deployment Cost:** 0.03346948 SUI (~33.47 MIST)

---

## Quick Commands

### Register an Institution
```bash
sui client call \
  --package 0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649 \
  --module skillproof \
  --function register_institution \
  --args 0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838 "\"Your Institution Name\"" "\"contact@institution.edu\"" \
  --gas-budget 10000000
```

### Verify an Institution (Admin Only)
```bash
sui client call \
  --package 0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649 \
  --module skillproof \
  --function verify_institution \
  --args 0x87748255ca474e8dcec20aee3099b0603f98863546a55e420a963aa120f47556 0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838 INSTITUTION_ADDRESS \
  --gas-budget 10000000
```

### Mint a Certificate (Verified Institution Only)
```bash
sui client call \
  --package 0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649 \
  --module skillproof \
  --function mint_certificate \
  --args 0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838 "\"Student Name\"" "\"Course Name\"" STUDENT_ADDRESS 0 "\"ipfs://QmHash\"" "\"sha256:hash\"" "\"GPA: 4.0\"" \
  --gas-budget 10000000
```

---

## Frontend Configuration

Update `frontend/lib/config.ts` with:

```typescript
export const NETWORK = "devnet";
export const PACKAGE_ID = "0x8d2b009a4b35cc9fe831b87f385f0d16b6c904aedd9a3a3c129495cc60cbd649";
export const REGISTRY_ID = "0x58900e9d7fba73feced9c7e5695c1f195b735c50cc1118fc5b27e564242cc838";
```

---

## Test Data

### Test Institution
- **Name:** MIT
- **Address:** 0x0628afba01b3f1d7cd028e186479bc4a0014e9dc6953c239dabaf8f5a90e228e
- **Status:** ✅ Verified

### Test Certificate
- **Certificate ID:** 0x0f1833d2d0d9b517c4b1519e3a101499c83c5a2155401583b43574eab7742807
- **Student:** Alice Johnson
- **Course:** Computer Science Degree
- **Institution:** MIT
- **Metadata:** GPA: 4.0, Summa Cum Laude
- **View:** https://devnet.suivision.xyz/object/0x0f1833d2d0d9b517c4b1519e3a101499c83c5a2155401583b43574eab7742807

---

## Notes

- **AdminCap** is owned by the deployer address and is required for verifying institutions
- **InstitutionRegistry** is a shared object accessible by everyone
- Keep the **UpgradeCap** safe if you plan to upgrade the contract later
- All addresses are on **Devnet** - for production, deploy to Mainnet
- Test certificate can be verified on the frontend using its Object ID

# SkillProof Deployment Information

## Devnet Deployment

**Deployed:** 2025-10-10

### Contract Addresses

**Package ID:**
```
0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c
```

**AdminCap Object ID:**
```
0x163ff28381a86f8afb9b83a5508471902b3885fd92b641c1174928a6cebdaf8b
```

**InstitutionRegistry Object ID (Shared):**
```
0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223
```

**UpgradeCap Object ID:**
```
0x6daae3fde90ea423c3b883e1e788691f3349464a9826497d0b8bf78e0b242c83
```

**Deployer Address:**
```
0x7984832a9b054a1a9d698bf0cda4cfe656db7dcface2ed4092353d85eb286af5
```

### Network Info

- **Network:** Devnet
- **RPC:** https://fullnode.devnet.sui.io:443
- **Explorer:** https://devnet.suivision.xyz/

### View on Explorer

- **Package:** https://devnet.suivision.xyz/package/0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c
- **AdminCap:** https://devnet.suivision.xyz/object/0x163ff28381a86f8afb9b83a5508471902b3885fd92b641c1174928a6cebdaf8b
- **Registry:** https://devnet.suivision.xyz/object/0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223

### Gas Cost

- **Deployment Cost:** 0.03346948 SUI (~33.47 MIST)

---

## Quick Commands

### Register an Institution
```bash
sui client call \
  --package 0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c \
  --module skillproof \
  --function register_institution \
  --args 0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223 "\"Your Institution Name\"" "\"contact@institution.edu\"" \
  --gas-budget 10000000
```

### Verify an Institution (Admin Only)
```bash
sui client call \
  --package 0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c \
  --module skillproof \
  --function verify_institution \
  --args 0x163ff28381a86f8afb9b83a5508471902b3885fd92b641c1174928a6cebdaf8b 0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223 INSTITUTION_ADDRESS \
  --gas-budget 10000000
```

### Mint a Certificate (Verified Institution Only)
```bash
sui client call \
  --package 0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c \
  --module skillproof \
  --function mint_certificate \
  --args 0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223 "\"Student Name\"" "\"Course Name\"" STUDENT_ADDRESS 0 "\"ipfs://QmHash\"" "\"sha256:hash\"" "\"GPA: 4.0\"" \
  --gas-budget 10000000
```

---

## Frontend Configuration

Update `frontend/lib/config.ts` with:

```typescript
export const NETWORK = "devnet";
export const PACKAGE_ID = "0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c";
export const REGISTRY_ID = "0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223";
```

---

## Test Data

### Test Institution
- **Name:** MIT
- **Address:** 0x7984832a9b054a1a9d698bf0cda4cfe656db7dcface2ed4092353d85eb286af5
- **Status:** ✅ Verified

### Test Certificate
- **Certificate ID:** 0x5ccca5f18bfade3cf4d9000ac1aaa35da01c22b0789b05663cbeb459d51d619e
- **Student:** Alice Johnson
- **Course:** Computer Science Degree
- **Institution:** MIT
- **Metadata:** GPA: 4.0, Summa Cum Laude
- **View:** https://devnet.suivision.xyz/object/0x5ccca5f18bfade3cf4d9000ac1aaa35da01c22b0789b05663cbeb459d51d619e

---

## Notes

- **AdminCap** is owned by the deployer address and is required for verifying institutions
- **InstitutionRegistry** is a shared object accessible by everyone
- Keep the **UpgradeCap** safe if you plan to upgrade the contract later
- All addresses are on **Devnet** - for production, deploy to Mainnet
- Test certificate can be verified on the frontend using its Object ID

# 🎓 SkillProof - On-chain Certificate Verification Platform

A blockchain-based platform for issuing, managing, and verifying educational certificates on the Sui blockchain. Tamper-proof, transparent, and instantly verifiable.

---

## 🎯 Overview

SkillProof enables:
- **Institutions** to issue tamper-proof blockchain certificates
- **Students** to own their certificates as non-transferable NFTs
- **Employers** to instantly verify certificate authenticity

All certificate data is stored on-chain, making it impossible to forge or alter.

---

## ✨ Key Features

### For Institutions 🏫
- Register and get verified as a legitimate issuer
- Mint certificate NFTs for students
- Revoke certificates if needed
- Update certificate metadata
- Track total certificates issued

### For Students 🎓
- Certificates stored in Sui wallet as NFTs
- Non-transferable (soul-bound tokens)
- Permanent proof of achievement
- Share certificate ID for verification

### For Employers 💼
- Public verification portal (no wallet needed)
- Instant authenticity checks
- View complete certificate details
- Check revocation status and expiration

---

## 🏗️ Architecture

```
SkillProof/
├── sources/
│   └── skillproof.move          # Smart contract (Sui Move)
├── frontend/                     # Verification portal (Next.js + TypeScript)
│   ├── app/                     # Next.js app router
│   ├── components/              # React components
│   └── lib/                     # Blockchain utilities
└── DEPLOYMENT_GUIDE.md          # Step-by-step deployment
```

---

## 🚀 Quick Start

### 1. Deploy Smart Contract

```bash
# Build the contract
sui move build

# Publish to Sui testnet
sui client publish --gas-budget 100000000
```

**Save the Package ID and Registry ID!**

### 2. Configure Frontend

Edit `frontend/lib/config.ts`:
```typescript
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID";
export const REGISTRY_ID = "0xYOUR_REGISTRY_ID";
export const NETWORK = "testnet";
```

### 3. Run Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Visit http://localhost:3000

**For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

---

## 📋 Smart Contract Features

### Core Structs

- **`Certificate`**: Non-transferable NFT with student/course/institution data
- **`Institution`**: Verified issuer with registration details
- **`InstitutionRegistry`**: Shared object storing all institutions
- **`AdminCap`**: One-time capability for platform administration

### Key Functions

#### Institution Management
- `register_institution()` - Anyone can register
- `verify_institution()` - Admin approves institutions
- `unverify_institution()` - Admin revokes verification

#### Certificate Operations
- `mint_certificate()` - Verified institutions mint certificates
- `revoke_certificate()` - Institutions can revoke their certificates
- `update_certificate_metadata()` - Update additional info
- `update_certificate_ipfs()` - Update document link

#### Verification
- `get_certificate_details()` - Fetch complete certificate data
- `is_certificate_valid()` - Check revocation and expiration
- `is_institution_verified()` - Check institution status

---

## 🔐 Security Model

### Non-Transferable Certificates
Certificates have **only** the `key` ability (not `store`), making them:
- ✅ Owned by wallets
- ❌ Cannot be transferred
- ❌ Cannot be sold
- ❌ Cannot be wrapped

This ensures certificates remain with the original recipient.

### Access Control
```
Admin (AdminCap holder):
├── Verify institutions
└── Unverify institutions

Verified Institutions:
├── Mint certificates
├── Revoke their certificates
└── Update their certificate metadata

Anyone:
├── Register as institution
├── Read certificate data
└── Verify certificates
```

### Immutability
Core fields (student name, course, institution, dates) are **immutable**. Only metadata and IPFS links can be updated.

---

## 📊 Data Flow

### Certificate Issuance
```
1. Institution registers → Unverified
2. Admin verifies institution → Verified
3. Institution mints certificate → Sent to student wallet
4. Certificate stored on-chain → Permanent record
```

### Certificate Verification
```
1. User enters certificate ID
2. Frontend queries Sui blockchain
3. Smart contract returns certificate data
4. Frontend validates (not revoked, not expired)
5. Display results to user
```

---

## 🛠️ Technology Stack

### Smart Contract
- **Language**: Sui Move
- **Blockchain**: Sui
- **Network**: Testnet/Mainnet

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain SDK**: @mysten/sui
- **Icons**: Lucide React

---

## 📱 Frontend Pages

### Phase 4: Verification Portal ✅ (Completed)
- Public certificate verification
- No wallet connection required
- Real-time blockchain queries
- Beautiful certificate display

### Phase 5: Institution Dashboard (Coming Soon)
- Wallet connection for institutions
- Mint certificates interface
- View issued certificates
- Manage certificate metadata

### Phase 6: Student Dashboard (Coming Soon)
- Wallet connection for students
- View owned certificates
- Generate shareable links
- QR code generation

---

## 🧪 Testing

### Test on Sui Testnet

1. **Register an institution**:
```bash
sui client call --package <PKG> --module skillproof \
  --function register_institution \
  --args <REGISTRY> "\"Harvard\"" "\"admin@harvard.edu\""
```

2. **Verify institution (as admin)**:
```bash
sui client call --package <PKG> --module skillproof \
  --function verify_institution \
  --args <ADMIN_CAP> <REGISTRY> <INSTITUTION_ADDR>
```

3. **Mint certificate**:
```bash
sui client call --package <PKG> --module skillproof \
  --function mint_certificate \
  --args <REGISTRY> "\"Alice Smith\"" "\"CS Degree\"" \
    <STUDENT_ADDR> 0 "\"ipfs://...\"" "\"hash123\"" "\"GPA: 4.0\""
```

4. **Verify on frontend**: Enter certificate ID at your frontend URL

---

## 📈 Roadmap

- [x] Phase 1: Core data structures & institution management
- [x] Phase 2: Certificate minting
- [x] Phase 3: Certificate management (revoke, update)
- [x] Phase 4: Public verification portal
- [ ] Phase 5: Institution dashboard
- [ ] Phase 6: Student dashboard
- [ ] QR code generation and scanning
- [ ] Batch certificate minting
- [ ] Certificate templates
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional verification methods
- Enhanced UI/UX
- Mobile app development
- Integration with existing LMS platforms
- Analytics dashboard

---

## 📄 License

This project is open source. See LICENSE file for details.

---

## 🙏 Acknowledgments

Built on:
- [Sui Blockchain](https://sui.io/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---


---

## 🎉 Get Started

Ready to deploy? Follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions!

```bash
# Clone the repo
git clone <your-repo-url>
cd SkillProof

# Deploy smart contract
sui move build
sui client publish --gas-budget 100000000

# Configure and run frontend
cd frontend
npm install
npm run dev
```

**Your blockchain certificate platform awaits! 🚀**

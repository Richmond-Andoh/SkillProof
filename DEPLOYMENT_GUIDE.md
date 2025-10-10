# SkillProof - Complete Deployment Guide

Step-by-step guide to deploy the SkillProof platform from smart contract to frontend.

---

## 📋 Prerequisites

- **Sui CLI** installed and configured
- **Node.js 18+** and npm
- **Sui wallet** with testnet/mainnet SUI tokens
- **Git** for version control

---

## Part 1: Deploy Smart Contract

### Step 1: Configure Sui CLI

```bash
# Check Sui CLI version
sui --version

# Configure for testnet (or mainnet)
sui client switch --env testnet

# Check your active address
sui client active-address

# Get testnet tokens (if needed)
# Visit: https://discord.com/channels/916379725201563759/971488439931392130
```

### Step 2: Build the Smart Contract

```bash
cd /path/to/SkillProof

# Build the Move package
sui move build
```

**Expected output**: "Build Successful"

### Step 3: Publish the Contract

```bash
sui client publish --gas-budget 100000000
```

**⚠️ IMPORTANT**: Save the output! You'll need:
- **Package ID**: The published package address
- **AdminCap Object ID**: Your admin capability
- **InstitutionRegistry Object ID**: The shared registry object

**Example output to save**:
```
Published Objects:
├─ PackageID: 0xabcd1234...
├─ AdminCap: 0xef567890...
└─ InstitutionRegistry: 0x12345678...
```

### Step 4: Verify Deployment

```bash
# Check the package exists
sui client object <PACKAGE_ID>

# Check the registry
sui client object <REGISTRY_ID>
```

---

## Part 2: Configure Frontend

### Step 1: Update Configuration

Edit `frontend/lib/config.ts`:

```typescript
export const NETWORK = "testnet"; // or "mainnet"

// Replace with YOUR values from deployment
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID_HERE";
export const REGISTRY_ID = "0xYOUR_REGISTRY_ID_HERE";
```

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

### Step 3: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 to see the verification portal.

---

## Part 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel
```

3. **Follow prompts**:
   - Link to your Vercel account
   - Choose project name
   - Accept default settings

4. **Production deployment**:
```bash
vercel --prod
```

### Option B: Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build and deploy**:
```bash
cd frontend
npm run build
netlify deploy --prod
```

### Option C: Traditional Hosting

1. **Build the app**:
```bash
cd frontend
npm run build
```

2. **Start production server**:
```bash
npm start
```

3. **Use PM2 for production** (recommended):
```bash
npm install -g pm2
pm2 start npm --name "skillproof" -- start
pm2 save
pm2 startup
```

---

## Part 4: Testing the Platform

### Test 1: Register an Institution

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module skillproof \
  --function register_institution \
  --args <REGISTRY_ID> "\"MIT\"" "\"contact@mit.edu\"" \
  --gas-budget 10000000
```

### Test 2: Verify the Institution (as Admin)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module skillproof \
  --function verify_institution \
  --args <ADMIN_CAP_ID> <REGISTRY_ID> <INSTITUTION_ADDRESS> \
  --gas-budget 10000000
```

### Test 3: Mint a Certificate

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module skillproof \
  --function mint_certificate \
  --args <REGISTRY_ID> "\"John Doe\"" "\"Computer Science Degree\"" <STUDENT_ADDRESS> 0 "\"ipfs://Qm...\"" "\"sha256:abc123...\"" "\"GPA: 3.8\"" \
  --gas-budget 10000000
```

**Save the Certificate Object ID** from the output!

### Test 4: Verify on Frontend

1. Go to your deployed frontend URL
2. Enter the Certificate Object ID
3. Click "Verify"
4. You should see the certificate details!

---

## Part 5: Production Checklist

### Smart Contract
- [ ] Deployed to correct network (testnet/mainnet)
- [ ] AdminCap stored securely
- [ ] Package ID documented
- [ ] Registry ID documented

### Frontend
- [ ] Config updated with correct IDs
- [ ] Build successful (`npm run build`)
- [ ] Deployed to hosting platform
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Testing
- [ ] Institution registration works
- [ ] Admin can verify institutions
- [ ] Verified institutions can mint certificates
- [ ] Frontend can verify certificates
- [ ] Revocation works correctly

---

## 🔒 Security Best Practices

### Protect Your AdminCap

The AdminCap is the ONLY way to verify institutions. Keep it safe:

```bash
# Export your AdminCap object ID
export ADMIN_CAP=0x...

# Store in a secure location (password manager, vault)
```

### Recommended: Multi-sig Admin

For production, consider using a multi-sig wallet for the AdminCap:
1. Create a multi-sig wallet on Sui
2. Transfer AdminCap to the multi-sig
3. Require multiple approvals for institution verification

---

## 🐛 Troubleshooting

### "Insufficient gas"
```bash
# Increase gas budget
--gas-budget 100000000
```

### "Object not found"
- Verify you're on the correct network (testnet vs mainnet)
- Check object IDs are correct
- Ensure objects weren't deleted/consumed

### Frontend shows "Certificate not found"
- Verify PACKAGE_ID and REGISTRY_ID in config.ts
- Check certificate ID is correct
- Ensure you're querying the right network

### Build fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Monitoring & Maintenance

### Check Registry Status

```bash
# View registry object
sui client object <REGISTRY_ID> --json

# Count institutions (look at total_institutions field)
```

### View Events

```bash
# Query certificate minted events
sui client events --package <PACKAGE_ID>
```

### Update Frontend

```bash
cd frontend
git pull
npm install
npm run build
# Redeploy to your hosting platform
```

---

## 🚀 Next Steps

After deployment:

1. **Create institution onboarding docs**
2. **Set up monitoring/analytics**
3. **Create institution dashboard** (Phase 5)
4. **Create student dashboard** (Phase 6)
5. **Add QR code generation**
6. **Implement batch certificate minting**

---

## 📞 Support

For issues:
1. Check this guide's troubleshooting section
2. Review Sui documentation: https://docs.sui.io
3. Check Next.js docs: https://nextjs.org/docs

---

## 📝 Deployment Checklist Summary

```
SMART CONTRACT:
✓ Built successfully
✓ Published to Sui
✓ Package ID: _________________
✓ AdminCap ID: _________________
✓ Registry ID: _________________

FRONTEND:
✓ Config updated
✓ Dependencies installed
✓ Build successful
✓ Deployed to: _________________
✓ URL: _________________

TESTING:
✓ Institution registered
✓ Institution verified
✓ Certificate minted
✓ Certificate verified on frontend
```

---

**Congratulations! Your SkillProof platform is now live! 🎉**

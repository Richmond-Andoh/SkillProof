# Phase 5: Institution Dashboard - Complete ✅

## Overview

Phase 5 implements a comprehensive institution dashboard that allows educational institutions to:
- Register their institution on the platform
- Mint certificates for students
- View and manage issued certificates
- Track institution statistics

## Features Implemented

### 1. Institution Dashboard (`/institution`)

**Main Dashboard Page** (`app/institution/page.tsx`)
- Three-tab interface: Mint Certificate, My Certificates, Profile
- Wallet connection requirement
- Responsive design with mobile support

### 2. Certificate Minting

**MintCertificateForm Component** (`components/institution/MintCertificateForm.tsx`)
- Form fields:
  - Student Name (required)
  - Course/Program Name (required)
  - Recipient Wallet Address (required)
  - Expiration Date (optional)
  - IPFS Link (optional)
  - Certificate Hash (optional)
  - Additional Metadata (optional)
- Real-time transaction feedback
- Form validation
- Success/error alerts
- Automatic form reset on success

### 3. Certificate Management

**IssuedCertificatesList Component** (`components/institution/IssuedCertificatesList.tsx`)
- Displays all certificates issued by the institution
- Fetches data from blockchain events
- Shows certificate details:
  - Student name
  - Course name
  - Issue date
  - Expiration date
  - Revocation status
  - Metadata
- Actions (UI ready, functionality to be implemented):
  - View on explorer
  - Edit metadata
  - Revoke certificate
- Refresh functionality
- Empty state handling

### 4. Institution Profile

**InstitutionProfile Component** (`components/institution/InstitutionProfile.tsx`)
- Displays institution information:
  - Institution name
  - Contact information
  - Verification status
  - Registration date
  - Total certificates issued
  - Wallet address
- Statistics dashboard:
  - Total certificates issued
  - Account status
  - Days active
- Verification status badge
- Pending verification alert

**RegisterInstitutionForm Component** (`components/institution/RegisterInstitutionForm.tsx`)
- Registration form for new institutions
- Fields:
  - Institution Name
  - Contact Information (email or website)
- Transaction handling
- Success callback to refresh profile
- Informational alerts about verification process

### 5. Navigation

**Navigation Component** (`components/Navigation.tsx`)
- Global navigation bar with:
  - Logo and branding
  - Navigation links (Home, Institution, Student)
  - Wallet connect button
  - Active route highlighting
  - Mobile-responsive design

**Providers Setup** (`app/providers.tsx`)
- Sui client provider configuration
- Wallet provider with auto-connect
- Query client for data fetching
- Network configuration (devnet/testnet/mainnet)

## Smart Contract Integration

All components integrate with the deployed smart contract:

### Contract Calls
1. **register_institution** - Register new institution
2. **mint_certificate** - Issue new certificate
3. **get_institution** - Fetch institution details (view function)

### Event Queries
- **CertificateMinted** - Track issued certificates
- **InstitutionRegistered** - Track registration events
- **InstitutionVerified** - Track verification events

## File Structure

```
frontend/
├── app/
│   ├── institution/
│   │   └── page.tsx                 # Main institution dashboard
│   ├── student/
│   │   └── page.tsx                 # Student dashboard (placeholder)
│   ├── layout.tsx                   # Updated with Navigation
│   ├── providers.tsx                # Sui/Wallet providers
│   └── page.tsx                     # Home page (updated)
├── components/
│   ├── institution/
│   │   ├── MintCertificateForm.tsx
│   │   ├── IssuedCertificatesList.tsx
│   │   ├── InstitutionProfile.tsx
│   │   └── RegisterInstitutionForm.tsx
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── alert.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── tabs.tsx
│   └── Navigation.tsx               # Global navigation
└── lib/
    └── config.ts                    # Updated with deployment addresses
```

## UI Components Added

Installed shadcn/ui components:
- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Textarea
- ✅ Alert
- ✅ Card
- ✅ Badge
- ✅ Tabs

## Configuration

### Network Configuration (`lib/config.ts`)
```typescript
export const NETWORK = "devnet";
export const PACKAGE_ID = "0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c";
export const REGISTRY_ID = "0x4f02239f3c5e2a358f3357a3449cc8335e7cc2b683556becac60834b5f531223";
```

## Usage Guide

### For Institutions

#### 1. Register Your Institution
1. Navigate to `/institution`
2. Connect your Sui wallet
3. Go to "Profile" tab
4. Fill in institution name and contact info
5. Submit registration
6. Wait for admin verification

#### 2. Mint a Certificate (After Verification)
1. Go to "Mint Certificate" tab
2. Fill in all required fields:
   - Student name
   - Course name
   - Student's wallet address
3. Optionally add:
   - Expiration date
   - IPFS link to certificate document
   - Certificate hash for verification
   - Additional metadata (grades, honors, etc.)
4. Click "Mint Certificate"
5. Approve transaction in wallet

#### 3. View Issued Certificates
1. Go to "My Certificates" tab
2. See all certificates you've issued
3. Click "View" to see on blockchain explorer
4. Use "Refresh" to update the list

### For Administrators

To verify an institution, use the CLI:
```bash
sui client call \
  --package 0xeff3b0cb6f2f7d08dc447eab3be9b9c085fbdd6316e4858c8a351eb7f2acb49c \
  --module skillproof \
  --function verify_institution \
  --args ADMIN_CAP_ID REGISTRY_ID INSTITUTION_ADDRESS \
  --gas-budget 10000000
```

## Testing Checklist

- [x] Institution registration flow
- [x] Profile display after registration
- [x] Certificate minting form validation
- [x] Certificate minting transaction
- [x] Certificate list display
- [x] Navigation between tabs
- [x] Wallet connection requirement
- [x] Mobile responsive design
- [ ] Certificate revocation (UI ready)
- [ ] Certificate metadata update (UI ready)

## Known Limitations

1. **Certificate Management Actions**: Revoke and Edit buttons are disabled (UI ready, blockchain integration pending)
2. **View Function Parsing**: Institution profile data parsing may need adjustment based on actual blockchain response format
3. **Event Pagination**: Certificate list currently limited to 50 most recent events
4. **Real-time Updates**: No automatic refresh when new certificates are minted (manual refresh required)

## Next Steps (Phase 6)

1. Implement Student Dashboard
2. Add certificate revocation functionality
3. Add certificate metadata update functionality
4. Implement certificate search and filtering
5. Add pagination for certificate lists
6. Add real-time event listeners
7. Implement QR code generation for certificates
8. Add certificate download/export features

## Dependencies

```json
{
  "@mysten/dapp-kit": "latest",
  "@mysten/sui": "latest",
  "@tanstack/react-query": "latest",
  "lucide-react": "latest",
  "next": "15.x",
  "react": "19.x",
  "tailwindcss": "4.x"
}
```

## Screenshots & Demo

To test the institution dashboard:

1. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open http://localhost:3000/institution

3. Connect your Sui wallet (must be on devnet)

4. Test the features:
   - Register if not already registered
   - Mint a test certificate
   - View your issued certificates

## Support

For issues or questions:
- Check the deployment info in `DEPLOYMENT_INFO.md`
- Review smart contract in `sources/skillproof.move`
- Check blockchain explorer: https://devnet.suivision.xyz/

---

**Status**: ✅ Phase 5 Complete
**Next Phase**: Phase 6 - Student Dashboard

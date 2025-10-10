# SkillProof Frontend - Certificate Verification Portal

Public-facing web application for verifying educational certificates stored on the Sui blockchain.

## 🚀 Features

- **Certificate Verification**: Instantly verify certificates by entering their Sui object ID
- **Real-time Blockchain Data**: Fetches certificate data directly from Sui blockchain
- **Validity Checks**: Automatically checks if certificates are revoked or expired
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **TypeScript**: Fully typed for better developer experience

## 📋 Prerequisites

- Node.js 18+ and npm
- A deployed SkillProof smart contract on Sui (testnet or mainnet)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Configure your contract addresses in `lib/config.ts`:
```typescript
export const PACKAGE_ID = "YOUR_PACKAGE_ID_HERE";
export const REGISTRY_ID = "YOUR_REGISTRY_ID_HERE";
export const NETWORK = "testnet"; // or "mainnet"
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main verification page
│   └── globals.css         # Global styles and animations
├── components/
│   └── CertificateCard.tsx # Certificate display component
├── lib/
│   ├── config.ts           # Contract addresses and network config
│   ├── sui-client.ts       # Sui blockchain client
│   ├── blockchain.ts       # Blockchain interaction functions
│   └── types.ts            # TypeScript type definitions
└── public/                 # Static assets
```

## 🔧 Configuration

### Network Configuration (`lib/config.ts`)

After deploying your smart contract, update these values:

```typescript
// Your deployed package ID (from sui client publish)
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID";

// Your InstitutionRegistry shared object ID
export const REGISTRY_ID = "0xYOUR_REGISTRY_ID";

// Network: "testnet", "mainnet", or "devnet"
export const NETWORK = "testnet";
```

### How to Get These Values

1. **PACKAGE_ID**: After running `sui client publish`, look for "Published Objects" in the output
2. **REGISTRY_ID**: Look for the `InstitutionRegistry` shared object ID in the publish output

## 🎨 Customization

### Styling
- Modify `app/globals.css` for global styles
- Tailwind CSS classes are used throughout components
- Color scheme can be adjusted in component files

### Branding
- Update `app/layout.tsx` for page title and description
- Replace logo/icons in the header section of `app/page.tsx`

## 📊 How It Works

1. **User enters certificate ID**: The Sui object ID of a certificate
2. **Blockchain query**: App fetches certificate data using `@mysten/sui` SDK
3. **Validation**: Checks if certificate exists, is not revoked, and not expired
4. **Display results**: Shows certificate details in a formatted card

## 🔍 Key Functions

### `verifyCertificate(certificateId)`
Main verification function that:
- Fetches certificate from blockchain
- Checks revocation status
- Validates expiration date
- Returns formatted verification result

### `getCertificateById(certificateId)`
Fetches raw certificate data from Sui blockchain

### `formatDate(timestamp)`
Converts Unix timestamps to readable dates

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
vercel
```

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Google Cloud Run
- Any Node.js hosting platform

## 🔐 Security Notes

- No wallet connection required for verification (public read-only)
- All data is fetched directly from blockchain
- No backend server needed
- Certificate IDs are public information

## 📝 Environment Variables (Optional)

Create `.env.local` for environment-specific config:
```env
NEXT_PUBLIC_PACKAGE_ID=0x...
NEXT_PUBLIC_REGISTRY_ID=0x...
NEXT_PUBLIC_NETWORK=testnet
```

Then update `lib/config.ts` to use these variables.

## 🐛 Troubleshooting

### "Certificate not found"
- Verify the certificate ID is correct (starts with 0x)
- Ensure you're on the correct network (testnet vs mainnet)
- Check that the certificate was actually minted

### RPC Connection Issues
- Check your internet connection
- Verify the RPC endpoint in `lib/config.ts` is accessible
- Try switching to a different Sui RPC endpoint

## 📚 Learn More

- [Sui Documentation](https://docs.sui.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [@mysten/sui SDK](https://sdk.mystenlabs.com/typescript)

## 🤝 Contributing

This is part of the SkillProof project. See the main project README for contribution guidelines.

## 📄 License

Part of the SkillProof project.

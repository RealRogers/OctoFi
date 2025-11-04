# 🚀 OctoFi Deployment Guide

This guide covers the complete deployment process for OctoFi from development to production.

## 📋 Prerequisites

- Node.js 18+
- npm or bun
- MetaMask wallet with Somnia Testnet configured
- Private key for contract deployment
- Vercel account (for frontend deployment)

## 🔧 Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd OctoFi
npm install
npm run contracts:install
```

### 2. Configure Environment Variables

#### Frontend Environment (`.env`)
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Somnia Testnet
VITE_SOMNIA_RPC_URL=https://testnet.rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=997
VITE_SOMNIA_EXPLORER=https://testnet.explorer.somnia.network

# Contract Addresses (will be populated after deployment)
VITE_USDC_ADDRESS=
VITE_USDT_ADDRESS=
VITE_ARB_ADDRESS=
VITE_USDC_POOL_ADDRESS=
VITE_USDT_POOL_ADDRESS=
VITE_ARB_POOL_ADDRESS=

# Optional: Analytics and Monitoring
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-google-analytics-id
```

#### Contracts Environment (`contracts/.env`)
```bash
cd contracts
cp .env.example .env
```

Edit `contracts/.env`:
```env
SOMNIA_RPC_URL=https://testnet.rpc.somnia.network
PRIVATE_KEY=your-private-key-here
SOMNIA_API_KEY=your-api-key-here
```

## 📦 Smart Contract Deployment

### 1. Compile Contracts
```bash
npm run contracts:compile
```

### 2. Run Tests
```bash
npm run contracts:test
```

### 3. Deploy to Somnia Testnet
```bash
npm run contracts:deploy
```

This will:
- Deploy MockERC20 tokens (USDC, USDT, ARB)
- Deploy StakingPool contracts for each token
- Add initial rewards to pools
- Output contract addresses for environment configuration

### 4. Update Environment Variables

Copy the contract addresses from the deployment output and update your `.env` file:

```env
VITE_USDC_ADDRESS=0x...
VITE_USDT_ADDRESS=0x...
VITE_ARB_ADDRESS=0x...
VITE_USDC_POOL_ADDRESS=0x...
VITE_USDT_POOL_ADDRESS=0x...
VITE_ARB_POOL_ADDRESS=0x...
```

### 5. Verify Contracts (Optional)

```bash
cd contracts
npx hardhat verify --network somnia-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🌐 Frontend Deployment

### 1. Switch to Real Contract Mode

Update `src/services/stakingService.ts`:
```typescript
private useMockData = false // Change from true to false
```

### 2. Update Staking Constants

Update `src/lib/stakingConstants.ts` with deployed contract addresses:
```typescript
export const STAKING_POOLS = {
  USDC: {
    name: 'USDC Staking',
    symbol: 'USDC',
    address: process.env.VITE_USDC_POOL_ADDRESS!,
    tokenAddress: process.env.VITE_USDC_ADDRESS!,
  },
  // ... update other pools
}
```

### 3. Run Tests
```bash
npm run test:coverage
npm run type-check
npm run lint
```

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to Vercel

#### Option A: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

#### Option B: GitHub Integration
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions pipeline that:

### Automated Testing
- Runs ESLint and TypeScript checks
- Executes frontend and contract tests
- Generates coverage reports
- Performs security audits

### Quality Assurance
- Bundle size analysis
- Lighthouse performance testing
- Dependency vulnerability scanning

### Deployment
- **Staging**: Auto-deploy `develop` branch to staging environment
- **Production**: Auto-deploy `main` branch to production
- **Contracts**: Deploy contracts when commit message contains `[deploy-contracts]`

### Required GitHub Secrets

Add these secrets to your GitHub repository:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
SNYK_TOKEN=your-snyk-token
SLACK_WEBHOOK_URL=your-slack-webhook
MAINNET_PRIVATE_KEY=your-mainnet-private-key
MAINNET_RPC_URL=your-mainnet-rpc-url
```

## 🧪 Testing Strategy

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:coverage
```

### Contract Tests
```bash
npm run contracts:test
```

### E2E Tests (Manual)
1. Connect MetaMask to Somnia Testnet
2. Get test tokens from faucet
3. Test complete staking workflow:
   - Stake tokens
   - View positions
   - Claim rewards
   - Withdraw tokens

## 📊 Monitoring and Analytics

### Performance Monitoring
- Lighthouse CI for performance metrics
- Bundle size tracking
- Core Web Vitals monitoring

### Error Tracking
- Sentry for error monitoring
- Console error tracking
- Transaction failure analysis

### Analytics
- Google Analytics for user behavior
- Custom events for DeFi interactions
- Conversion funnel analysis

## 🔒 Security Considerations

### Smart Contracts
- Use OpenZeppelin battle-tested contracts
- Implement proper access controls
- Add emergency pause functionality
- Conduct security audits before mainnet

### Frontend
- Validate all user inputs
- Sanitize data before blockchain interactions
- Implement proper error handling
- Use HTTPS for all communications

### Infrastructure
- Secure private key management
- Environment variable protection
- Regular dependency updates
- Security scanning in CI/CD

## 🚨 Troubleshooting

### Common Issues

#### Contract Deployment Fails
```bash
# Check network configuration
npx hardhat run scripts/deploy.js --network somnia-testnet

# Verify RPC URL and private key
echo $SOMNIA_RPC_URL
```

#### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### Transaction Failures
- Ensure sufficient gas limit
- Check token approvals
- Verify contract addresses
- Confirm network connection

### Debug Mode

Enable debug logging:
```typescript
// In stakingService.ts
console.log('Debug mode enabled')
```

## 📈 Performance Optimization

### Bundle Optimization
- Code splitting by routes
- Tree shaking unused code
- Image optimization
- Font loading optimization

### Runtime Performance
- React.memo for expensive components
- useMemo for heavy calculations
- Lazy loading for non-critical components
- Service worker for caching

## 🔄 Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor security advisories
- Review performance metrics
- Update documentation

### Scaling Considerations
- CDN for static assets
- Database for transaction history
- Caching layer for API responses
- Load balancing for high traffic

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Contact the development team
4. Create an issue in the repository

---

**Last Updated**: November 2024
**Version**: 1.0.0
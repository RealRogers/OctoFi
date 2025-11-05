# 🧪 OctoFi Testing Guide

**How to Test the OctoFi App with Real Smart Contracts**

---

## 🚀 Quick Start Testing

### 1. Install Dependencies & Start App
```bash
# Install frontend dependencies
npm install

# Install contract dependencies
cd contracts && npm install && cd ..

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔧 MetaMask Setup for Somnia Testnet

### Add Somnia Network to MetaMask

1. **Open MetaMask** → Click network dropdown → "Add Network"
2. **Enter Network Details:**
   ```
   Network Name: Somnia Testnet
   RPC URL: https://dream-rpc.somnia.network
   Chain ID: 50312
   Currency Symbol: STT
   Block Explorer: https://explorer.somnia.network
   ```
3. **Save** and switch to Somnia Testnet

### Get Test STT Tokens
- You'll need STT tokens for gas fees
- Contact Somnia team or use their faucet if available
- Alternative: Import the test wallet we used for deployment

---

## 💰 Get Test Tokens for Staking

### Method 1: Use Faucet Functions (Recommended)
```javascript
// Open browser console on the app
// Connect to the deployed token contracts and call faucet

// USDC Faucet (get 1000 USDC)
const usdcAddress = "0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB"
const usdcContract = new ethers.Contract(usdcAddress, [
  "function faucet(uint256 amount)"
], signer)
await usdcContract.faucet(ethers.parseUnits("1000", 6))

// USDT Faucet (get 1000 USDT)  
const usdtAddress = "0xa233487B7FB5941Dd81A28A4A547519760BFE89e"
const usdtContract = new ethers.Contract(usdtAddress, [
  "function faucet(uint256 amount)"
], signer)
await usdtContract.faucet(ethers.parseUnits("1000", 6))

// ARB Faucet (get 1000 ARB)
const arbAddress = "0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030"
const arbContract = new ethers.Contract(arbAddress, [
  "function faucet(uint256 amount)"
], signer)
await arbContract.faucet(ethers.parseUnits("1000", 18))
```

### Method 2: Use Hardhat Script
```bash
cd contracts
npx hardhat run scripts/faucet.js --network somnia-testnet
```

---

## 🎯 Complete Testing Workflow

### 1. Dashboard Testing
1. **Navigate to Dashboard** (`/dashboard`)
2. **Connect MetaMask** - Click "Connect Wallet"
3. **Verify Data Loading:**
   - Portfolio metrics should load
   - Asset prices should display
   - Charts should render
   - AI predictions should appear

### 2. Staking Testing (Full Flow)

#### Step 1: Navigate to Staking
- Go to `/stake` or `/stake-full`
- Verify pools load with real data from contracts

#### Step 2: Get Test Tokens
- Use faucet functions above to get USDC/USDT/ARB
- Check your wallet balance updates

#### Step 3: Stake Tokens
1. **Select Pool** - Choose USDC pool (only one deployed)
2. **Enter Amount** - Try staking 100 USDC
3. **Approve Tokens** - First transaction to approve spending
4. **Stake** - Second transaction to actually stake
5. **Verify Success** - Check your position appears

#### Step 4: Monitor Position
- Refresh page and verify staked amount shows
- Check rewards accumulation (may be minimal initially)
- Verify lock period and unlock time

#### Step 5: Claim Rewards
- Wait a few minutes for rewards to accumulate
- Click "Claim Rewards" 
- Verify transaction and balance update

#### Step 6: Withdraw
- Try partial withdrawal
- Try full withdrawal (if not locked)
- Verify balances update correctly

### 3. Swap Testing
1. **Navigate to Swap** (`/swap` or `/swap-original`)
2. **Select Tokens** - Choose from deployed tokens
3. **Enter Amount** - Try swapping between USDC/USDT
4. **Execute Swap** - Note: This may use mock data for now

### 4. AI Agent Testing
1. **Go to Agent Dashboard** (`/agent-dashboard`)
2. **Enable Agent** - Toggle the AI trading agent
3. **Monitor Metrics** - Check performance data
4. **Review Decisions** - Look at AI decision history

---

## 🔍 Advanced Testing

### Contract Interaction Testing
```bash
# Test contract functions directly
cd contracts
npx hardhat console --network somnia-testnet

# In console:
const StakingPool = await ethers.getContractFactory("StakingPool")
const pool = StakingPool.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")

// Check pool data
await pool.totalSupply()
await pool.rewardRate()
await pool.balanceOf("YOUR_ADDRESS")
```

### Frontend Testing
```bash
# Run component tests
npm run test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test -- src/tests/integration/

# Run specific test file
npm run test -- src/services/stakingService.test.ts
```

### Contract Testing
```bash
cd contracts
npm run test
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Wallet Not Connected"
- **Solution:** Ensure MetaMask is connected to Somnia Testnet
- **Check:** Network is 50312, RPC is correct

#### 2. "Insufficient Balance"
- **Solution:** Get STT tokens for gas fees
- **Check:** Use faucet functions to get test tokens

#### 3. "Transaction Failed"
- **Solution:** Check gas limits and token approvals
- **Debug:** Look at browser console for error details

#### 4. "Pool Not Found"
- **Solution:** Only USDC pool is deployed currently
- **Workaround:** Use USDC pool for testing

#### 5. "Contract Not Responding"
- **Solution:** Verify contract addresses in constants
- **Check:** Network connection and RPC endpoint

### Debug Mode
Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'octofi:*')
```

---

## 📊 Test Scenarios

### Scenario 1: New User Journey
1. Connect wallet → Get test tokens → Stake → Monitor → Claim → Withdraw

### Scenario 2: Multiple Positions
1. Stake in multiple pools (when available)
2. Manage different lock periods
3. Compare APY and rewards

### Scenario 3: Error Handling
1. Try staking without approval
2. Try withdrawing more than staked
3. Test with insufficient gas

### Scenario 4: UI/UX Testing
1. Test responsive design on mobile
2. Test dark/light theme switching
3. Test accessibility features

---

## 📈 Performance Testing

### Load Testing
```bash
# Install dependencies
npm install -g lighthouse artillery

# Run Lighthouse audit
lighthouse http://localhost:5173 --output html

# Load test API endpoints
artillery quick --count 10 --num 5 http://localhost:5173
```

### Bundle Analysis
```bash
npm run build:analyze
```

---

## 🔐 Security Testing

### Manual Security Checks
1. **Check for sensitive data** in browser dev tools
2. **Verify HTTPS** in production
3. **Test wallet disconnection** scenarios
4. **Check for XSS vulnerabilities** in inputs

### Automated Security Scan
```bash
# Install security tools
npm install -g snyk

# Scan for vulnerabilities
snyk test
```

---

## 📝 Test Reporting

### Create Test Report
1. **Document Issues** found during testing
2. **Screenshot Problems** for bug reports
3. **Record Performance** metrics
4. **Note User Experience** feedback

### Test Checklist
- [ ] MetaMask connection works
- [ ] Test tokens can be obtained
- [ ] Staking flow completes successfully
- [ ] Rewards accumulate correctly
- [ ] Withdrawals work properly
- [ ] UI is responsive and accessible
- [ ] Error handling works appropriately
- [ ] Performance is acceptable

---

## 🎉 Success Criteria

**The app is working correctly if:**
- ✅ Wallet connects to Somnia Testnet
- ✅ Real contract data loads in dashboard
- ✅ Staking transactions complete successfully
- ✅ Positions and rewards display accurately
- ✅ Withdrawals and claims work properly
- ✅ UI is responsive and user-friendly
- ✅ No critical errors in console

---

## 🚀 Next Steps After Testing

1. **Report Issues** - Document any bugs found
2. **Deploy Remaining Pools** - USDT and ARB pools
3. **Optimize Performance** - Based on testing results
4. **Prepare for Mainnet** - After thorough testing
5. **User Acceptance Testing** - Get feedback from real users

---

**Happy Testing! 🧪✨**

For questions or issues, refer to the documentation or create an issue in the repository.
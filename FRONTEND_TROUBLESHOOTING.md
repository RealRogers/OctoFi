# 🔧 Frontend Troubleshooting Guide

**OctoFi App Connection Issues - Solutions**

---

## 🚀 App is Running Successfully!

✅ **App URL:** `http://localhost:8081/` (Note: Port 8081, not 5173)  
✅ **Build Status:** Successful  
✅ **TypeScript Errors:** Fixed  
✅ **Test Tokens:** 1M+ USDC/USDT/ARB in your wallet

---

## 🔍 MetaMask Connection Troubleshooting

### Step 1: Verify MetaMask Setup

#### ✅ Check Network Configuration
1. **Open MetaMask** → Click network dropdown
2. **Verify Somnia Testnet** is added with these exact settings:
   ```
   Network Name: Somnia Testnet
   RPC URL: https://dream-rpc.somnia.network
   Chain ID: 50312
   Currency Symbol: STT
   Block Explorer: https://explorer.somnia.network
   ```

#### ✅ Check Account
1. **Verify Address:** `0xc5ce44d994c00f2fea2079408e8b6c18b6d2f156`
2. **Check Token Balances:**
   - USDC: 1,001,500
   - USDT: 1,001,500  
   - ARB: 1,001,500

### Step 2: Browser Console Debugging

#### 🔍 Open Developer Tools
1. **Right-click** on the app → "Inspect" or press `F12`
2. **Go to Console tab**
3. **Look for errors** related to:
   - MetaMask connection
   - Network issues
   - Contract calls

#### 🔍 Common Error Messages & Solutions

**Error:** `"MetaMask not found"`
- **Solution:** Install MetaMask browser extension
- **Check:** `window.ethereum` exists in console

**Error:** `"User rejected the connection request"`
- **Solution:** Click "Connect" in MetaMask popup
- **Check:** Allow the connection request

**Error:** `"Wrong network"`
- **Solution:** Switch to Somnia Testnet in MetaMask
- **Check:** Chain ID is 50312

**Error:** `"Provider not initialized"`
- **Solution:** Refresh page and try connecting again
- **Check:** Clear browser cache if needed

### Step 3: Manual Connection Test

#### 🧪 Test in Browser Console
```javascript
// Test 1: Check if MetaMask is available
console.log('MetaMask available:', !!window.ethereum)

// Test 2: Check current network
if (window.ethereum) {
  window.ethereum.request({ method: 'eth_chainId' })
    .then(chainId => console.log('Current Chain ID:', parseInt(chainId, 16)))
}

// Test 3: Check connected accounts
if (window.ethereum) {
  window.ethereum.request({ method: 'eth_accounts' })
    .then(accounts => console.log('Connected accounts:', accounts))
}

// Test 4: Request connection
if (window.ethereum) {
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(accounts => console.log('Connected to:', accounts[0]))
    .catch(err => console.error('Connection failed:', err))
}
```

### Step 4: App-Specific Debugging

#### 🔍 Check Connect Wallet Button
1. **Navigate to:** `http://localhost:8081/`
2. **Look for:** "Connect Wallet" button
3. **Click and observe:** MetaMask popup should appear
4. **Check console:** For any JavaScript errors

#### 🔍 Test Different Pages
1. **Dashboard:** `http://localhost:8081/dashboard`
2. **Staking:** `http://localhost:8081/stake`
3. **Swap:** `http://localhost:8081/swap`

---

## 🛠️ Advanced Troubleshooting

### Clear Browser Data
```bash
# Chrome/Edge: Settings → Privacy → Clear browsing data
# Firefox: Settings → Privacy → Clear Data
# Safari: Develop → Empty Caches
```

### Reset MetaMask
1. **MetaMask Settings** → Advanced → Reset Account
2. **Re-import** your wallet with seed phrase
3. **Re-add** Somnia Testnet

### Check Browser Compatibility
- ✅ **Chrome/Chromium** (Recommended)
- ✅ **Firefox** 
- ✅ **Edge**
- ⚠️ **Safari** (May have issues)

---

## 🎯 Step-by-Step Testing Process

### 1. Basic Connection Test
```bash
# 1. Open app
open http://localhost:8081/

# 2. Open DevTools (F12)
# 3. Go to Console tab
# 4. Run this test:
```
```javascript
// Check MetaMask
console.log('MetaMask:', !!window.ethereum)
console.log('Chain ID:', window.ethereum?.chainId)
```

### 2. Network Verification
1. **MetaMask** → Network dropdown
2. **Should show:** "Somnia Testnet"
3. **Chain ID:** 50312
4. **If wrong:** Add network manually

### 3. Account Verification  
1. **MetaMask** → Account dropdown
2. **Should show:** `0xc5ce...f156`
3. **Token balances** should be visible
4. **If wrong:** Switch to correct account

### 4. Connection Flow Test
1. **Click** "Connect Wallet" in app
2. **MetaMask popup** should appear
3. **Click** "Connect" in MetaMask
4. **App should show** connected state
5. **Check console** for success/error messages

---

## 🔧 Quick Fixes

### Fix 1: Refresh Everything
```bash
# 1. Close MetaMask
# 2. Refresh browser page (Ctrl+F5)
# 3. Open MetaMask
# 4. Try connecting again
```

### Fix 2: Switch Networks
```bash
# 1. MetaMask → Switch to Ethereum Mainnet
# 2. Wait 2 seconds
# 3. Switch back to Somnia Testnet
# 4. Try connecting again
```

### Fix 3: Restart Development Server
```bash
# In terminal, press Ctrl+C to stop
# Then restart:
npm run dev
```

---

## 📊 Expected Behavior

### ✅ When Working Correctly:
1. **App loads** at `http://localhost:8081/`
2. **"Connect Wallet" button** is visible
3. **Clicking button** opens MetaMask popup
4. **After connecting** → Button shows wallet address
5. **Dashboard shows** real data from contracts
6. **Staking page** shows USDC pool with real data
7. **Token balances** are visible in UI

### ❌ When Not Working:
1. **No MetaMask popup** when clicking connect
2. **Console errors** about provider/network
3. **"Wrong network" messages**
4. **Loading states** that never resolve
5. **Empty data** or mock data showing

---

## 🆘 If Still Not Working

### Last Resort Solutions:

#### 1. Use Different Browser
- Try Chrome if using Firefox
- Try Firefox if using Chrome
- Disable all browser extensions except MetaMask

#### 2. Use Different MetaMask Account
- Create new account in MetaMask
- Send tokens to new account using our script
- Test with fresh account

#### 3. Check Network Status
- Visit: `https://explorer.somnia.network`
- Verify network is operational
- Check RPC endpoint: `https://dream-rpc.somnia.network`

#### 4. Manual Token Addition
Add tokens manually to MetaMask:
```
USDC: 0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB
USDT: 0xa233487B7FB5941Dd81A28A4A547519760BFE89e
ARB: 0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030
```

---

## 📞 Debug Information to Collect

If you need help, please provide:

1. **Browser & Version:** (e.g., Chrome 119.0.6045.105)
2. **MetaMask Version:** (Settings → About)
3. **Console Errors:** (Copy/paste from DevTools)
4. **Network Settings:** (Screenshot of MetaMask network)
5. **Account Address:** (Confirm it matches expected)
6. **App URL:** (Confirm using port 8081)

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ MetaMask connects without errors
- ✅ Dashboard shows your token balances
- ✅ Staking page loads USDC pool data
- ✅ You can interact with staking functions
- ✅ Transactions can be initiated (approve/stake)

**The app is production-ready - let's get you connected! 🚀**
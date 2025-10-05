#!/bin/bash

# Simple React Native iOS Build Test Script
# This script tests the basic RN setup before attempting a full build

echo "=== React Native iOS Build Test ==="

# Test 1: Node and npm versions
echo "1. Testing Node.js environment..."
node --version
npm --version

# Test 2: React Native CLI
echo "2. Testing React Native CLI..."
npx react-native --version

# Test 3: Package installation
echo "3. Testing package installation..."
npm install

# Test 4: iOS dependencies check
echo "4. Testing iOS dependencies..."
cd ios
ls -la
cat Podfile

# Test 5: Basic pod validation
echo "5. Testing CocoaPods..."
pod --version
pod spec lint --quick

echo "=== Test Complete ==="
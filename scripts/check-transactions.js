#!/usr/bin/env node

/**
 * Check Transactions and Generate HashScan Links
 * 
 * This script checks the database for transactions and generates
 * HashScan links for on-chain activity verification.
 */

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function checkTransactions() {
  console.log('🔍 Checking database transactions...\n');

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();

    // Check donations
    console.log('📊 DONATIONS:');
    const donations = await prisma.donation.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        post: {
          select: { title: true, community: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    if (donations.length === 0) {
      console.log('   No donations found in database');
    } else {
      donations.forEach((donation, index) => {
        console.log(`   ${index + 1}. ${donation.user?.name || 'Unknown'} donated ${donation.amount} Smiles`);
        console.log(`      Post: ${donation.post?.title || 'Unknown'}`);
        console.log(`      Community: ${donation.post?.community?.name || 'Unknown'}`);
        console.log(`      Date: ${donation.createdAt.toISOString()}`);
        if (donation.blockchainTransactionId) {
          console.log(`      HashScan: https://hashscan.io/testnet/transaction/${donation.blockchainTransactionId}`);
        }
        console.log('');
      });
    }

    // Check user wallets
    console.log('👤 USER WALLETS:');
    const userWallets = await prisma.custodialWallet.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    if (userWallets.length === 0) {
      console.log('   No user wallets found');
    } else {
      userWallets.forEach((wallet, index) => {
        console.log(`   ${index + 1}. ${wallet.user?.name || 'Unknown'} (${wallet.user?.email || 'Unknown'})`);
        console.log(`      Account ID: ${wallet.accountId}`);
        console.log(`      HashScan: https://hashscan.io/testnet/account/${wallet.accountId}`);
        console.log(`      Created: ${wallet.createdAt.toISOString()}`);
        console.log('');
      });
    }

    // Check community wallets
    console.log('🏢 COMMUNITY WALLETS:');
    const communityWallets = await prisma.communityWallet.findMany({
      include: {
        community: {
          select: { name: true }
        }
      },
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    if (communityWallets.length === 0) {
      console.log('   No community wallets found');
    } else {
      communityWallets.forEach((wallet, index) => {
        console.log(`   ${index + 1}. ${wallet.community?.name || 'Unknown Community'}`);
        console.log(`      Account ID: ${wallet.accountId}`);
        console.log(`      HashScan: https://hashscan.io/testnet/account/${wallet.accountId}`);
        console.log(`      Created: ${wallet.createdAt.toISOString()}`);
        console.log('');
      });
    }

    // Check recent transactions from blockchain logs
    console.log('⛓️ BLOCKCHAIN TRANSACTIONS:');
    const transactions = await prisma.blockchainTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    if (transactions.length === 0) {
      console.log('   No blockchain transactions found in database');
    } else {
      transactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ${tx.transactionType} - ${tx.txId}`);
        console.log(`      Transaction ID: ${tx.txId}`);
        console.log(`      HashScan: https://hashscan.io/testnet/transaction/${tx.txId}`);
        console.log(`      Amount: ${tx.amount || 'N/A'}`);
        console.log(`      Status: ${tx.status}`);
        console.log(`      Date: ${tx.createdAt.toISOString()}`);
        console.log('');
      });
    }

    // Summary
    console.log('📈 SUMMARY:');
    const totalDonations = await prisma.donation.count();
    const totalUsers = await prisma.custodialWallet.count({ where: { isActive: true } });
    const totalCommunities = await prisma.communityWallet.count({ where: { isActive: true } });
    const totalTransactions = await prisma.blockchainTransaction.count();

    console.log(`   Total Donations: ${totalDonations}`);
    console.log(`   Active User Wallets: ${totalUsers}`);
    console.log(`   Active Community Wallets: ${totalCommunities}`);
    console.log(`   Blockchain Transactions: ${totalTransactions}`);

    // Generate quick links
    console.log('\n🔗 QUICK LINKS:');
    console.log('   Hedera Testnet Explorer: https://hashscan.io/testnet');
    console.log('   Smiles Token (if deployed): https://hashscan.io/testnet/token/' + (process.env.HEDERA_SMILES_TOKEN_ID || 'NOT_SET'));
    
    if (process.env.HEDERA_OPERATOR_ID) {
      console.log('   Operator Account: https://hashscan.io/testnet/account/' + process.env.HEDERA_OPERATOR_ID);
    }

  } catch (error) {
    console.error('❌ Error checking transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkTransactions().catch(console.error); 
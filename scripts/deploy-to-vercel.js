#!/usr/bin/env node

/**
 * Vercel Deployment Script for SmileUp ImpactChain
 * This script helps prepare and deploy the application to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SmileUp ImpactChain - Vercel Deployment Script');
console.log('================================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`📋 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function main() {
  log('🔍 Checking prerequisites...', 'yellow');
  
  // Check if we're in the right directory
  if (!checkFileExists('package.json')) {
    log('❌ package.json not found. Please run this script from the project root.', 'red');
    process.exit(1);
  }
  
  if (!checkFileExists('.env.local')) {
    log('⚠️  .env.local not found. Make sure your environment variables are configured.', 'yellow');
  }
  
  log('✅ Prerequisites check completed', 'green');
  
  // Step 1: Check git status
  log('\n📊 Checking git status...', 'yellow');
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
      log('⚠️  You have uncommitted changes:', 'yellow');
      console.log(gitStatus);
      log('💡 Consider committing your changes before deployment', 'blue');
    } else {
      log('✅ Working directory is clean', 'green');
    }
  } catch (error) {
    log('⚠️  Git not initialized or not a git repository', 'yellow');
  }
  
  // Step 2: Install dependencies
  if (!runCommand('npm install', 'Installing dependencies')) {
    log('❌ Failed to install dependencies. Please check your package.json', 'red');
    process.exit(1);
  }
  
  // Step 3: Build the project
  if (!runCommand('npm run build', 'Building the project')) {
    log('❌ Build failed. Please fix the build errors before deployment.', 'red');
    process.exit(1);
  }
  
  // Step 4: Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    log('✅ Vercel CLI is installed', 'green');
  } catch (error) {
    log('📦 Installing Vercel CLI...', 'blue');
    if (!runCommand('npm install -g vercel', 'Installing Vercel CLI')) {
      log('❌ Failed to install Vercel CLI', 'red');
      process.exit(1);
    }
  }
  
  // Step 5: Deploy to Vercel
  log('\n🚀 Starting Vercel deployment...', 'yellow');
  log('💡 This will open the Vercel deployment wizard', 'blue');
  log('💡 Make sure to configure your environment variables in the Vercel dashboard', 'blue');
  
  if (!runCommand('vercel --prod', 'Deploying to Vercel')) {
    log('❌ Deployment failed. Please check the error messages above.', 'red');
    process.exit(1);
  }
  
  log('\n🎉 Deployment completed successfully!', 'green');
  log('📋 Next steps:', 'blue');
  log('   1. Configure environment variables in Vercel dashboard', 'blue');
  log('   2. Test all functionality on the deployed URL', 'blue');
  log('   3. Set up custom domain if needed', 'blue');
  log('   4. Configure monitoring and analytics', 'blue');
  
  log('\n📚 For detailed instructions, see: plans/25_vercel_deployment_guide.md', 'blue');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 SmileUp ImpactChain - Vercel Deployment Script

Usage:
  node scripts/deploy-to-vercel.js [options]

Options:
  --help, -h    Show this help message
  --check       Only check prerequisites without deploying
  --build       Only build the project without deploying

Examples:
  node scripts/deploy-to-vercel.js
  node scripts/deploy-to-vercel.js --check
  node scripts/deploy-to-vercel.js --build
`);
  process.exit(0);
}

if (args.includes('--check')) {
  log('🔍 Running prerequisite check only...', 'yellow');
  // Only run the check part
  main();
  process.exit(0);
}

if (args.includes('--build')) {
  log('🔨 Running build only...', 'yellow');
  if (!runCommand('npm install', 'Installing dependencies')) {
    process.exit(1);
  }
  if (!runCommand('npm run build', 'Building the project')) {
    process.exit(1);
  }
  log('✅ Build completed successfully!', 'green');
  process.exit(0);
}

// Run the main deployment process
main(); 
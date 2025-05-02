const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if firestore.rules exists
if (!fs.existsSync('./firestore.rules')) {
  console.error('Error: firestore.rules file not found');
  process.exit(1);
}

console.log('🔥 Firebase Rules Deployment Helper');
console.log('-----------------------------------');
console.log('This script will help you deploy your Firestore rules.');
console.log('\nBefore proceeding, make sure:');
console.log('1. You have the Firebase CLI installed (npm install -g firebase-tools)');
console.log('2. You are logged in to Firebase (firebase login)');
console.log('3. Your project is properly set up (firebase use <project-id>)\n');

rl.question('Do you want to continue? (y/n): ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Deployment canceled.');
    rl.close();
    return;
  }
  
  console.log('\nCurrent Firestore rules:');
  console.log('------------------------');
  console.log(fs.readFileSync('./firestore.rules', 'utf8'));
  console.log('------------------------\n');
  
  rl.question('Do you want to deploy these rules? (y/n): ', (confirm) => {
    if (confirm.toLowerCase() !== 'y') {
      console.log('Deployment canceled.');
      rl.close();
      return;
    }
    
    try {
      console.log('\nDeploying Firestore rules...');
      execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
      console.log('\n✅ Firestore rules deployed successfully!');
    } catch (error) {
      console.error('\n❌ Error deploying Firestore rules:', error.message);
      console.log('\nTry running the following command manually:');
      console.log('firebase deploy --only firestore:rules');
    }
    
    rl.close();
  });
});
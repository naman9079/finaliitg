// Quick test script to verify dataset loading
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Dataset Integration...\n');

const dataDir = path.join(__dirname, 'public', 'data');
const files = [
  'campus_card_swipes.csv',
  'wifi_associations_logs.csv',
  'cctv_frames.csv',
  'lab_bookings.csv',
  'profiles.csv'
];

let allFilesExist = true;

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').length - 1;
    console.log(`✅ ${file}`);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Records: ~${lines.toLocaleString()}\n`);
  } else {
    console.log(`❌ ${file} - NOT FOUND\n`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✨ All dataset files are present and ready!\n');
  console.log('📊 Dataset Summary:');
  console.log('   - Card swipes for physical access tracking');
  console.log('   - WiFi logs for network-based occupancy');
  console.log('   - CCTV frames for visual surveillance');
  console.log('   - Lab bookings for space utilization');
  console.log('   - User profiles for entity identification\n');
  console.log('🚀 Run "npm run dev" to start the application');
} else {
  console.log('⚠️  Some dataset files are missing. Please check the integration.');
}

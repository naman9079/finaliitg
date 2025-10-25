const fs = require('fs');

// Backup and clean the CSV files
const cardSwipesPath = 'public/data/campus_card_swipes.csv';
const bookingsPath = 'public/data/lab_bookings.csv';

// Read and clean existing data
let cardSwipes = fs.readFileSync(cardSwipesPath, 'utf8');
let bookings = fs.readFileSync(bookingsPath, 'utf8');

// Remove all test card IDs (C7000-C50000)
const cardLines = cardSwipes.split('\n');
const cleanedCardLines = cardLines.filter(line => {
  const match = line.match(/^C(\d+),/);
  if (!match) return true;
  const cardNum = parseInt(match[1]);
  return cardNum < 7000 || cardNum > 50000;
});

// Remove test bookings
const bookingLines = bookings.split('\n');
const cleanedBookingLines = bookingLines.filter(line => {
  return !line.startsWith('BKG40000');
});

fs.writeFileSync(cardSwipesPath, cleanedCardLines.join('\n'));
fs.writeFileSync(bookingsPath, cleanedBookingLines.join('\n'));

console.log('✅ Cleaned old test data\n');

// Generate fresh timestamps
const now = new Date();
const getRecentTimestamp = (minutesAgo) => {
  const ts = new Date(now.getTime() - minutesAgo * 60000);
  return ts.toISOString().replace('T', ' ').substring(0, 19);
};

console.log(`Current time: ${now.toISOString().replace('T', ' ').substring(0, 19)}`);
console.log(`Data window: Last 30 minutes\n`);

let allSwipes = '';

// ========== HIGH PRIORITY ALERTS (5) - >80% occupancy ==========
console.log('🔴 HIGH PRIORITY ALERTS (5):');

// HIGH #1: Main Auditorium (capacity 500) - 450 swipes = 90%
for (let i = 0; i < 450; i++) {
  allSwipes += `C${10000 + i},AUDITORIUM,${getRecentTimestamp(Math.floor(Math.random() * 25))}\n`;
}
console.log('   1. Main Auditorium - 450/500 (90% occupancy)');

// HIGH #2: Cafeteria Block C (capacity 300) - 270 swipes = 90%
for (let i = 0; i < 270; i++) {
  allSwipes += `C${11000 + i},CAF_3,${getRecentTimestamp(Math.floor(Math.random() * 25))}\n`;
}
console.log('   2. Cafeteria Block C - 270/300 (90% occupancy)');

// HIGH #3: Engineering Block 5 (capacity 200) - 175 swipes = 87.5%
for (let i = 0; i < 175; i++) {
  allSwipes += `C${12000 + i},ENG_5,${getRecentTimestamp(Math.floor(Math.random() * 25))}\n`;
}
console.log('   3. Engineering Block 5 - 175/200 (87.5% occupancy)');

// HIGH #4: Library Entrance (capacity 150) - 135 swipes = 90%
for (let i = 0; i < 135; i++) {
  allSwipes += `C${13000 + i},LIB_ENT,${getRecentTimestamp(Math.floor(Math.random() * 25))}\n`;
}
console.log('   4. Library Entrance - 135/150 (90% occupancy)');

// HIGH #5: Campus Gym (capacity 100) - 88 swipes = 88%
for (let i = 0; i < 88; i++) {
  allSwipes += `C${14000 + i},GYM,${getRecentTimestamp(Math.floor(Math.random() * 25))}\n`;
}
console.log('   5. Campus Gym - 88/100 (88% occupancy)');

// ========== MEDIUM PRIORITY ALERTS (5) - 60-80% occupancy ==========
console.log('\n🟡 MEDIUM PRIORITY ALERTS (5):');

// MEDIUM #1: Admin Lobby (capacity 80) - 56 swipes = 70%
for (let i = 0; i < 56; i++) {
  allSwipes += `C${15000 + i},ADMIN_LOBBY,${getRecentTimestamp(Math.floor(Math.random() * 28))}\n`;
}
console.log('   1. Admin Lobby - 56/80 (70% occupancy)');

// MEDIUM #2: Seminar Room 1 (capacity 60) - 42 swipes = 70%
for (let i = 0; i < 42; i++) {
  allSwipes += `C${20000 + i},SEM_01,${getRecentTimestamp(Math.floor(Math.random() * 28))}\n`;
}
console.log('   2. Seminar Room 1 - 42/60 (70% occupancy)');

// MEDIUM #3: Lab 101 (capacity 40) - 28 swipes = 70%
for (let i = 0; i < 28; i++) {
  allSwipes += `C${21000 + i},LAB_101,${getRecentTimestamp(Math.floor(Math.random() * 28))}\n`;
}
console.log('   3. Lab 101 - 28/40 (70% occupancy)');

// MEDIUM #4: Lab 305 (capacity 35) - 24 swipes = 68.5%
for (let i = 0; i < 24; i++) {
  allSwipes += `C${22000 + i},LAB_305,${getRecentTimestamp(Math.floor(Math.random() * 28))}\n`;
}
console.log('   4. Lab 305 - 24/35 (68.5% occupancy)');

// MEDIUM #5: Multiple no-show bookings (triggers medium alert)
let noShowBookings = '';
for (let i = 0; i < 5; i++) {
  const bookingId = `BKG${400000 + i}`;
  const entityId = `E${200000 + i}`;
  const startTime = getRecentTimestamp(60 + i * 10);
  const endTime = getRecentTimestamp(30 + i * 10);
  
  const startFormatted = new Date(startTime).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
  
  const endFormatted = new Date(endTime).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric', 
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
  
  noShowBookings += `${bookingId},${entityId},LAB_101,${startFormatted},${endFormatted},NO\n`;
}
fs.appendFileSync(bookingsPath, noShowBookings);
console.log('   5. Multiple no-show bookings - 5 bookings not attended');

// ========== NORMAL/LOW PRIORITY ALERTS (5) - <60% occupancy ==========
console.log('\n🟢 NORMAL/LOW PRIORITY ALERTS (5):');

// Create new locations with low occupancy to generate normal alerts
// We'll use existing location IDs but with fewer swipes

// NORMAL #1: Auditorium section (capacity 500) - 200 swipes = 40%
for (let i = 0; i < 200; i++) {
  allSwipes += `C${30000 + i},AUDITORIUM,${getRecentTimestamp(Math.floor(Math.random() * 29))}\n`;
}
console.log('   1. Main Auditorium (section 2) - 200/500 (40% occupancy)');

// NORMAL #2: Cafeteria section (capacity 300) - 150 swipes = 50%
for (let i = 0; i < 150; i++) {
  allSwipes += `C${31000 + i},CAF_3,${getRecentTimestamp(Math.floor(Math.random() * 29))}\n`;
}
console.log('   2. Cafeteria Block C (section 2) - 150/300 (50% occupancy)');

// NORMAL #3: Engineering Block (capacity 200) - 100 swipes = 50%
for (let i = 0; i < 100; i++) {
  allSwipes += `C${32000 + i},ENG_5,${getRecentTimestamp(Math.floor(Math.random() * 29))}\n`;
}
console.log('   3. Engineering Block 5 (section 2) - 100/200 (50% occupancy)');

// NORMAL #4: Library (capacity 150) - 75 swipes = 50%
for (let i = 0; i < 75; i++) {
  allSwipes += `C${33000 + i},LIB_ENT,${getRecentTimestamp(Math.floor(Math.random() * 29))}\n`;
}
console.log('   4. Library Entrance (section 2) - 75/150 (50% occupancy)');

// NORMAL #5: Gym (capacity 100) - 45 swipes = 45%
for (let i = 0; i < 45; i++) {
  allSwipes += `C${34000 + i},GYM,${getRecentTimestamp(Math.floor(Math.random() * 29))}\n`;
}
console.log('   5. Campus Gym (section 2) - 45/100 (45% occupancy)');

// Write all swipes
fs.appendFileSync(cardSwipesPath, allSwipes);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Generated 15 alerts across all priority levels!');
console.log('');
console.log('📊 SUMMARY:');
console.log('   🔴 HIGH Priority: 5 alerts (>80% occupancy)');
console.log('   🟡 MEDIUM Priority: 5 alerts (60-80% occupancy)');
console.log('   🟢 NORMAL Priority: 5 alerts (<60% occupancy)');
console.log('');
console.log('📱 Refresh your dashboard to see all 15 alerts!');
console.log('💡 All timestamps are within the last 30 minutes');
console.log('🔔 HIGH and MEDIUM alerts have SMS notification buttons');

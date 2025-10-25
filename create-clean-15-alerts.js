const fs = require('fs');

console.log('🧹 Creating clean dataset with exactly 15 alerts...\n');

// Backup original files
const cardSwipesPath = 'public/data/campus_card_swipes.csv';
const bookingsPath = 'public/data/lab_bookings.csv';

// Read original data
let cardSwipes = fs.readFileSync(cardSwipesPath, 'utf8');
let bookings = fs.readFileSync(bookingsPath, 'utf8');

// Keep only the header and original data (remove all test data)
const cardLines = cardSwipes.split('\n');
const originalCardLines = cardLines.filter(line => {
  if (!line.trim() || line.startsWith('card_id')) return true; // Keep header and empty lines
  const match = line.match(/^C(\d+),/);
  if (!match) return true;
  const cardNum = parseInt(match[1]);
  return cardNum < 7000; // Keep only original data
});

const bookingLines = bookings.split('\n');
const originalBookingLines = bookingLines.filter(line => {
  if (!line.trim() || line.startsWith('booking_id')) return true;
  return !line.startsWith('BKG40000');
});

// Write cleaned files
fs.writeFileSync(cardSwipesPath, originalCardLines.join('\n'));
fs.writeFileSync(bookingsPath, originalBookingLines.join('\n'));

console.log('✅ Cleaned test data\n');

// Generate fresh timestamps
const now = new Date();
const getRecentTimestamp = (minutesAgo) => {
  const ts = new Date(now.getTime() - minutesAgo * 60000);
  return ts.toISOString().replace('T', ' ').substring(0, 19);
};

console.log(`Current time: ${now.toISOString().replace('T', ' ').substring(0, 19)}`);
console.log(`Window: Last 30 minutes\n`);

// Define exactly 15 locations with precise occupancy targets
const alerts = [
  // HIGH PRIORITY (5) - Need >80% occupancy
  { loc: 'AUDITORIUM', name: 'Main Auditorium', cap: 500, target: 450, priority: 'HIGH' },
  { loc: 'CAF_3', name: 'Cafeteria Block C', cap: 300, target: 270, priority: 'HIGH' },
  { loc: 'ENG_5', name: 'Engineering Block 5', cap: 200, target: 175, priority: 'HIGH' },
  { loc: 'LIB_ENT', name: 'Library Entrance', cap: 150, target: 135, priority: 'HIGH' },
  { loc: 'GYM', name: 'Campus Gym', cap: 100, target: 88, priority: 'HIGH' },
  
  // MEDIUM PRIORITY (5) - Need 60-80% occupancy
  { loc: 'ADMIN_LOBBY', name: 'Admin Lobby', cap: 80, target: 56, priority: 'MEDIUM' },
  { loc: 'SEM_01', name: 'Seminar Room 1', cap: 60, target: 42, priority: 'MEDIUM' },
  { loc: 'SEM_02', name: 'Seminar Room 2', cap: 65, target: 45, priority: 'MEDIUM' },
  { loc: 'LAB_101', name: 'Lab 101', cap: 40, target: 28, priority: 'MEDIUM' },
  { loc: 'LAB_305', name: 'Lab 305', cap: 35, target: 24, priority: 'MEDIUM' },
  
  // NORMAL PRIORITY (5) - Need <60% occupancy
  { loc: 'LAB_202', name: 'Lab 202', cap: 45, target: 22, priority: 'NORMAL' },
  { loc: 'LAB_303', name: 'Lab 303', cap: 38, target: 19, priority: 'NORMAL' },
  { loc: 'SEM_03', name: 'Seminar Room 3', cap: 55, target: 27, priority: 'NORMAL' },
  { loc: 'CAF_1', name: 'Cafeteria Block A', cap: 250, target: 125, priority: 'NORMAL' },
  { loc: 'CAF_2', name: 'Cafeteria Block B', cap: 280, target: 140, priority: 'NORMAL' }
];

let allSwipes = '';
let cardStart = 10000;

console.log('🔴 HIGH PRIORITY ALERTS (5):');
let highCount = 0, medCount = 0, normCount = 0;

alerts.forEach((alert) => {
  // Generate exact number of unique card swipes
  for (let i = 0; i < alert.target; i++) {
    const cardId = `C${cardStart + i}`;
    const mins = alert.priority === 'HIGH' ? Math.floor(Math.random() * 25) :
                 alert.priority === 'MEDIUM' ? Math.floor(Math.random() * 28) :
                 Math.floor(Math.random() * 29);
    allSwipes += `${cardId},${alert.loc},${getRecentTimestamp(mins)}\n`;
  }
  
  const percent = Math.round((alert.target / alert.cap) * 100);
  
  if (alert.priority === 'HIGH') {
    highCount++;
    console.log(`   ${highCount}. ${alert.name} - ${alert.target}/${alert.cap} (${percent}%)`);
  } else if (alert.priority === 'MEDIUM') {
    if (medCount === 0) console.log('\n🟡 MEDIUM PRIORITY ALERTS (5):');
    medCount++;
    console.log(`   ${medCount}. ${alert.name} - ${alert.target}/${alert.cap} (${percent}%)`);
  } else {
    if (normCount === 0) console.log('\n🟢 NORMAL PRIORITY ALERTS (5):');
    normCount++;
    console.log(`   ${normCount}. ${alert.name} - ${alert.target}/${alert.cap} (${percent}%)`);
  }
  
  cardStart += alert.target;
});

// Write all swipes at once
fs.appendFileSync(cardSwipesPath, allSwipes);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Created exactly 15 alerts!');
console.log('');
console.log('📊 BREAKDOWN:');
console.log(`   🔴 HIGH: ${highCount} alerts (>80% occupancy)`);
console.log(`   🟡 MEDIUM: ${medCount} alerts (60-80% occupancy)`);
console.log(`   🟢 NORMAL: ${normCount} alerts (<60% occupancy)`);
console.log('');
console.log('📱 Refresh your dashboard now!');
console.log('💡 Make sure you\'re viewing REAL DATASET mode');
console.log('🔔 HIGH and MEDIUM alerts have notification buttons');

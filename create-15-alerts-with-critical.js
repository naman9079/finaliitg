const fs = require('fs');

console.log('🧹 Creating dataset with HIGH (critical + high) alerts...\n');

const cardSwipesPath = 'public/data/campus_card_swipes.csv';
const bookingsPath = 'public/data/lab_bookings.csv';

// Read and clean
let cardSwipes = fs.readFileSync(cardSwipesPath, 'utf8');
let bookings = fs.readFileSync(bookingsPath, 'utf8');

const cardLines = cardSwipes.split('\n');
const originalCardLines = cardLines.filter(line => {
  if (!line.trim() || line.startsWith('card_id')) return true;
  const match = line.match(/^C(\d+),/);
  if (!match) return true;
  const cardNum = parseInt(match[1]);
  return cardNum < 7000;
});

const bookingLines = bookings.split('\n');
const originalBookingLines = bookingLines.filter(line => {
  if (!line.trim() || line.startsWith('booking_id')) return true;
  return !line.startsWith('BKG40000');
});

fs.writeFileSync(cardSwipesPath, originalCardLines.join('\n'));
fs.writeFileSync(bookingsPath, originalBookingLines.join('\n'));

console.log('✅ Cleaned test data\n');

const now = new Date();
const getRecentTimestamp = (minutesAgo) => {
  const ts = new Date(now.getTime() - minutesAgo * 60000);
  return ts.toISOString().replace('T', ' ').substring(0, 19);
};

console.log(`Current time: ${now.toISOString().replace('T', ' ').substring(0, 19)}`);
console.log(`Window: Last 30 minutes\n`);

// Define 15 locations - mix of critical (>95%) and high (80-95%)
const alerts = [
  // HIGH PRIORITY (5) - Mix of critical (>95%) and high (80-95%)
  { loc: 'AUDITORIUM', name: 'Main Auditorium', cap: 500, target: 485, priority: 'CRITICAL', percent: 97 },
  { loc: 'CAF_3', name: 'Cafeteria Block C', cap: 300, target: 290, priority: 'CRITICAL', percent: 97 },
  { loc: 'ENG_5', name: 'Engineering Block 5', cap: 200, target: 195, priority: 'CRITICAL', percent: 98 },
  { loc: 'LIB_ENT', name: 'Library Entrance', cap: 150, target: 135, priority: 'HIGH', percent: 90 },
  { loc: 'GYM', name: 'Campus Gym', cap: 100, target: 88, priority: 'HIGH', percent: 88 },
  
  // MEDIUM PRIORITY (5) - 60-80% occupancy
  { loc: 'ADMIN_LOBBY', name: 'Admin Lobby', cap: 80, target: 56, priority: 'MEDIUM', percent: 70 },
  { loc: 'SEM_01', name: 'Seminar Room 1', cap: 60, target: 42, priority: 'MEDIUM', percent: 70 },
  { loc: 'SEM_02', name: 'Seminar Room 2', cap: 65, target: 45, priority: 'MEDIUM', percent: 69 },
  { loc: 'LAB_101', name: 'Lab 101', cap: 40, target: 28, priority: 'MEDIUM', percent: 70 },
  { loc: 'LAB_305', name: 'Lab 305', cap: 35, target: 24, priority: 'MEDIUM', percent: 69 },
  
  // NORMAL PRIORITY (5) - <60% occupancy
  { loc: 'LAB_202', name: 'Lab 202', cap: 45, target: 22, priority: 'NORMAL', percent: 49 },
  { loc: 'LAB_303', name: 'Lab 303', cap: 38, target: 19, priority: 'NORMAL', percent: 50 },
  { loc: 'SEM_03', name: 'Seminar Room 3', cap: 55, target: 27, priority: 'NORMAL', percent: 49 },
  { loc: 'CAF_1', name: 'Cafeteria Block A', cap: 250, target: 125, priority: 'NORMAL', percent: 50 },
  { loc: 'CAF_2', name: 'Cafeteria Block B', cap: 280, target: 140, priority: 'NORMAL', percent: 50 }
];

let allSwipes = '';
let cardStart = 10000;

console.log('🔴 HIGH PRIORITY ALERTS (5):');
let critCount = 0, highCount = 0, medCount = 0, normCount = 0;

alerts.forEach((alert) => {
  // Generate exact number of unique card swipes
  for (let i = 0; i < alert.target; i++) {
    const cardId = `C${cardStart + i}`;
    const mins = (alert.priority === 'CRITICAL' || alert.priority === 'HIGH') ? Math.floor(Math.random() * 25) :
                 alert.priority === 'MEDIUM' ? Math.floor(Math.random() * 28) :
                 Math.floor(Math.random() * 29);
    allSwipes += `${cardId},${alert.loc},${getRecentTimestamp(mins)}\n`;
  }
  
  if (alert.priority === 'CRITICAL') {
    critCount++;
    console.log(`   ${critCount}. ${alert.name} - ${alert.target}/${alert.cap} (${alert.percent}%) ⚠️ CRITICAL`);
  } else if (alert.priority === 'HIGH') {
    highCount++;
    console.log(`   ${critCount + highCount}. ${alert.name} - ${alert.target}/${alert.cap} (${alert.percent}%) 🔴 HIGH`);
  } else if (alert.priority === 'MEDIUM') {
    if (medCount === 0) console.log('\n🟡 MEDIUM PRIORITY ALERTS (5):');
    medCount++;
    console.log(`   ${medCount}. ${alert.name} - ${alert.target}/${alert.cap} (${alert.percent}%)`);
  } else {
    if (normCount === 0) console.log('\n🟢 NORMAL PRIORITY ALERTS (5):');
    normCount++;
    console.log(`   ${normCount}. ${alert.name} - ${alert.target}/${alert.cap} (${alert.percent}%)`);
  }
  
  cardStart += alert.target;
});

fs.appendFileSync(cardSwipesPath, allSwipes);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Created exactly 15 alerts!');
console.log('');
console.log('📊 BREAKDOWN:');
console.log(`   ⚠️  CRITICAL: ${critCount} alerts (>95% occupancy)`);
console.log(`   🔴 HIGH: ${highCount} alerts (80-95% occupancy)`);
console.log(`   🟡 MEDIUM: ${medCount} alerts (60-80% occupancy)`);
console.log(`   🟢 NORMAL: ${normCount} alerts (<60% occupancy)`);
console.log('');
console.log('📱 Refresh your dashboard now!');
console.log('💡 Make sure you\'re viewing REAL DATASET mode');
console.log('🔔 CRITICAL, HIGH, and MEDIUM alerts have notification buttons');

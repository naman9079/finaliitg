const fs = require('fs');

// Clean the CSV files
const cardSwipesPath = 'public/data/campus_card_swipes.csv';
const bookingsPath = 'public/data/lab_bookings.csv';

let cardSwipes = fs.readFileSync(cardSwipesPath, 'utf8');
let bookings = fs.readFileSync(bookingsPath, 'utf8');

// Remove test data
const cardLines = cardSwipes.split('\n');
const cleanedCardLines = cardLines.filter(line => {
  const match = line.match(/^C(\d+),/);
  if (!match) return true;
  const cardNum = parseInt(match[1]);
  return cardNum < 7000 || cardNum > 50000;
});

const bookingLines = bookings.split('\n');
const cleanedBookingLines = bookingLines.filter(line => {
  return !line.startsWith('BKG40000');
});

fs.writeFileSync(cardSwipesPath, cleanedCardLines.join('\n'));
fs.writeFileSync(bookingsPath, cleanedBookingLines.join('\n'));

console.log('✅ Cleaned old test data\n');

// Generate timestamps
const now = new Date();
const getRecentTimestamp = (minutesAgo) => {
  const ts = new Date(now.getTime() - minutesAgo * 60000);
  return ts.toISOString().replace('T', ' ').substring(0, 19);
};

console.log(`Current time: ${now.toISOString().replace('T', ' ').substring(0, 19)}`);
console.log(`Data window: Last 30 minutes\n`);

let allSwipes = '';
let cardIdStart = 10000;

// Define 15 unique locations with their capacities and target occupancy
const alertConfigs = [
  // HIGH PRIORITY (5) - >80% occupancy
  { location: 'AUDITORIUM', name: 'Main Auditorium', capacity: 500, count: 450, priority: 'HIGH', percent: 90 },
  { location: 'CAF_3', name: 'Cafeteria Block C', capacity: 300, count: 270, priority: 'HIGH', percent: 90 },
  { location: 'ENG_5', name: 'Engineering Block 5', capacity: 200, count: 175, priority: 'HIGH', percent: 87.5 },
  { location: 'LIB_ENT', name: 'Library Entrance', capacity: 150, count: 135, priority: 'HIGH', percent: 90 },
  { location: 'GYM', name: 'Campus Gym', capacity: 100, count: 88, priority: 'HIGH', percent: 88 },
  
  // MEDIUM PRIORITY (5) - 60-80% occupancy
  { location: 'ADMIN_LOBBY', name: 'Admin Lobby', capacity: 80, count: 56, priority: 'MEDIUM', percent: 70 },
  { location: 'SEM_01', name: 'Seminar Room 1', capacity: 60, count: 42, priority: 'MEDIUM', percent: 70 },
  { location: 'LAB_101', name: 'Lab 101', capacity: 40, count: 28, priority: 'MEDIUM', percent: 70 },
  { location: 'LAB_305', name: 'Lab 305', capacity: 35, count: 24, priority: 'MEDIUM', percent: 68.5 },
  { location: 'SEM_02', name: 'Seminar Room 2', capacity: 65, count: 45, priority: 'MEDIUM', percent: 69 },
  
  // NORMAL/LOW PRIORITY (5) - <60% occupancy
  { location: 'LAB_202', name: 'Lab 202', capacity: 45, count: 22, priority: 'NORMAL', percent: 49 },
  { location: 'LAB_303', name: 'Lab 303', capacity: 38, count: 19, priority: 'NORMAL', percent: 50 },
  { location: 'SEM_03', name: 'Seminar Room 3', capacity: 55, count: 27, priority: 'NORMAL', percent: 49 },
  { location: 'CAF_1', name: 'Cafeteria Block A', capacity: 250, count: 125, priority: 'NORMAL', percent: 50 },
  { location: 'CAF_2', name: 'Cafeteria Block B', capacity: 280, count: 140, priority: 'NORMAL', percent: 50 }
];

console.log('🔴 HIGH PRIORITY ALERTS (5):');
let highCount = 0;
let mediumCount = 0;
let normalCount = 0;

alertConfigs.forEach((config, index) => {
  // Generate card swipes for this location
  for (let i = 0; i < config.count; i++) {
    const cardId = `C${cardIdStart + i}`;
    const minutesAgo = config.priority === 'HIGH' ? Math.floor(Math.random() * 25) : 
                       config.priority === 'MEDIUM' ? Math.floor(Math.random() * 28) :
                       Math.floor(Math.random() * 29);
    allSwipes += `${cardId},${config.location},${getRecentTimestamp(minutesAgo)}\n`;
  }
  
  // Log the alert
  if (config.priority === 'HIGH') {
    highCount++;
    console.log(`   ${highCount}. ${config.name} - ${config.count}/${config.capacity} (${config.percent}% occupancy)`);
  } else if (config.priority === 'MEDIUM' && highCount === 5 && mediumCount === 0) {
    console.log('\n🟡 MEDIUM PRIORITY ALERTS (5):');
    mediumCount++;
    console.log(`   ${mediumCount}. ${config.name} - ${config.count}/${config.capacity} (${config.percent}% occupancy)`);
  } else if (config.priority === 'MEDIUM') {
    mediumCount++;
    console.log(`   ${mediumCount}. ${config.name} - ${config.count}/${config.capacity} (${config.percent}% occupancy)`);
  } else if (config.priority === 'NORMAL' && mediumCount === 5 && normalCount === 0) {
    console.log('\n🟢 NORMAL/LOW PRIORITY ALERTS (5):');
    normalCount++;
    console.log(`   ${normalCount}. ${config.name} - ${config.count}/${config.capacity} (${config.percent}% occupancy)`);
  } else if (config.priority === 'NORMAL') {
    normalCount++;
    console.log(`   ${normalCount}. ${config.name} - ${config.count}/${config.capacity} (${config.percent}% occupancy)`);
  }
  
  cardIdStart += config.count;
});

// Write all swipes
fs.appendFileSync(cardSwipesPath, allSwipes);

// Add no-show bookings for an additional medium alert
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

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Generated 15+ unique location alerts!');
console.log('');
console.log('📊 SUMMARY:');
console.log('   🔴 HIGH Priority: 5 alerts (>80% occupancy)');
console.log('   🟡 MEDIUM Priority: 5 alerts (60-80% occupancy) + 1 no-show alert');
console.log('   🟢 NORMAL Priority: 5 alerts (<60% occupancy)');
console.log('');
console.log('📱 Refresh your dashboard to see all 15+ alerts!');
console.log('💡 Each alert uses a unique location');
console.log('🔔 HIGH and MEDIUM alerts have SMS notification buttons');

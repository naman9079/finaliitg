const fs = require('fs');
const { execSync } = require('child_process');

console.log('🧹 Generating alerts with CURRENT timestamp...\n');

// Get actual current time from system
const systemTime = execSync('powershell -Command "Get-Date -Format \\"yyyy-MM-dd HH:mm:ss\\""').toString().trim();
console.log(`System time from PowerShell: ${systemTime}`);

const now = new Date(systemTime);
console.log(`Parsed as: ${now.toISOString()}`);

const cardSwipesPath = 'public/data/campus_card_swipes.csv';
const bookingsPath = 'public/data/lab_bookings.csv';

// Clean old data
let cardSwipes = fs.readFileSync(cardSwipesPath, 'utf8');
const cardLines = cardSwipes.split('\n');
const originalCardLines = cardLines.filter(line => {
  if (!line.trim() || line.startsWith('card_id')) return true;
  const match = line.match(/^C(\d+),/);
  if (!match) return true;
  const cardNum = parseInt(match[1]);
  return cardNum < 7000;
});

fs.writeFileSync(cardSwipesPath, originalCardLines.join('\n'));
console.log('✅ Cleaned old test data\n');

const getRecentTimestamp = (minutesAgo) => {
  const ts = new Date(now.getTime() - minutesAgo * 60000);
  // Format as local time string
  const year = ts.getFullYear();
  const month = String(ts.getMonth() + 1).padStart(2, '0');
  const day = String(ts.getDate()).padStart(2, '0');
  const hours = String(ts.getHours()).padStart(2, '0');
  const minutes = String(ts.getMinutes()).padStart(2, '0');
  const seconds = String(ts.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatLocal = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

console.log(`Current time: ${formatLocal(now)}`);
console.log(`30 min ago: ${getRecentTimestamp(30)}\n`);

const alerts = [
  // CRITICAL (3) - >95%
  { loc: 'AUDITORIUM', name: 'Main Auditorium', cap: 500, target: 485, priority: 'CRITICAL' },
  { loc: 'CAF_3', name: 'Cafeteria Block C', cap: 300, target: 290, priority: 'CRITICAL' },
  { loc: 'ENG_5', name: 'Engineering Block 5', cap: 200, target: 195, priority: 'CRITICAL' },
  
  // HIGH (2) - 80-95%
  { loc: 'LIB_ENT', name: 'Library Entrance', cap: 150, target: 135, priority: 'HIGH' },
  { loc: 'GYM', name: 'Campus Gym', cap: 100, target: 88, priority: 'HIGH' },
  
  // MEDIUM (5) - 60-80%
  { loc: 'ADMIN_LOBBY', name: 'Admin Lobby', cap: 80, target: 56, priority: 'MEDIUM' },
  { loc: 'SEM_01', name: 'Seminar Room 1', cap: 60, target: 42, priority: 'MEDIUM' },
  { loc: 'SEM_02', name: 'Seminar Room 2', cap: 65, target: 45, priority: 'MEDIUM' },
  { loc: 'LAB_101', name: 'Lab 101', cap: 40, target: 28, priority: 'MEDIUM' },
  { loc: 'LAB_305', name: 'Lab 305', cap: 35, target: 24, priority: 'MEDIUM' },
  
  // NORMAL (5) - <60%
  { loc: 'LAB_202', name: 'Lab 202', cap: 45, target: 22, priority: 'NORMAL' },
  { loc: 'LAB_303', name: 'Lab 303', cap: 38, target: 19, priority: 'NORMAL' },
  { loc: 'SEM_03', name: 'Seminar Room 3', cap: 55, target: 27, priority: 'NORMAL' },
  { loc: 'CAF_1', name: 'Cafeteria Block A', cap: 250, target: 125, priority: 'NORMAL' },
  { loc: 'CAF_2', name: 'Cafeteria Block B', cap: 280, target: 140, priority: 'NORMAL' }
];

let allSwipes = '';
let cardStart = 10000;

console.log('⚠️  CRITICAL PRIORITY (3):');
let counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, NORMAL: 0 };

alerts.forEach((alert) => {
  for (let i = 0; i < alert.target; i++) {
    const cardId = `C${cardStart + i}`;
    const mins = (alert.priority === 'CRITICAL' || alert.priority === 'HIGH') ? Math.floor(Math.random() * 25) :
                 alert.priority === 'MEDIUM' ? Math.floor(Math.random() * 28) :
                 Math.floor(Math.random() * 29);
    allSwipes += `${cardId},${alert.loc},${getRecentTimestamp(mins)}\n`;
  }
  
  const percent = Math.round((alert.target / alert.cap) * 100);
  counts[alert.priority]++;
  
  if (alert.priority === 'CRITICAL') {
    console.log(`   ${counts.CRITICAL}. ${alert.name} - ${alert.target}/${alert.cap} (${percent}%)`);
  } else if (alert.priority === 'HIGH') {
    if (counts.HIGH === 1) console.log('\n🔴 HIGH PRIORITY (2):');
    console.log(`   ${counts.HIGH}. ${alert.name} - ${alert.target}/${alert.cap} (${percent}%)`);
  } else if (alert.priority === 'MEDIUM') {
    if (counts.MEDIUM === 1) console.log('\n🟡 MEDIUM PRIORITY (5):');
    console.log(`   ${counts.MEDIUM}. ${alert.name} - ${alert.target}/${alert.cap} (${percent}%)`);
  } else {
    if (counts.NORMAL === 1) console.log('\n🟢 NORMAL PRIORITY (5):');
    console.log(`   ${counts.NORMAL}. ${alert.name} - ${alert.target}/${alert.cap} (${percent}%)`);
  }
  
  cardStart += alert.target;
});

fs.appendFileSync(cardSwipesPath, allSwipes);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Generated 15 alerts with CURRENT timestamps!');
console.log(`📱 Refresh dashboard NOW (data valid for 30 min from ${systemTime})`);

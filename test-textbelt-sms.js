// Test Textbelt SMS (FREE)
const PHONE = '+919079282554';

async function testTextbeltSMS() {
  console.log('🧪 Testing Textbelt SMS (FREE)...\n');
  console.log(`Phone: ${PHONE}`);
  console.log('Service: Textbelt (1 free SMS per day per IP)\n');
  console.log('Sending test SMS...\n');

  try {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: PHONE,
        message: '🚨 ETHOS ALERT TEST\n\nThis is a test from ETHOS Vision Campus Intelligence.\n\nSMS integration is working!',
        key: 'textbelt' // Free tier
      })
    });

    const data = await response.json();
    
    console.log('📱 Response from Textbelt:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ SUCCESS! SMS sent to', PHONE);
      console.log('📊 Quota remaining today:', data.quotaRemaining);
      console.log('📱 Check your phone - SMS should arrive within 10-30 seconds!');
      console.log('\n💡 Note: Free tier = 1 SMS per day per IP address');
    } else {
      console.log('\n⚠️  Response:', data.error);
      if (data.error && data.error.includes('quota')) {
        console.log('💡 You\'ve used your free SMS for today. Try again tomorrow!');
        console.log('💡 Or get unlimited SMS: https://textbelt.com/ ($0.0075 per SMS)');
      }
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

testTextbeltSMS();

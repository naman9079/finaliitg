// Quick SMS Test Script
const API_KEY = 'lV6HNGhnfP78pJkQZOSczjsRIbtMXoDYd3rg4WKCxiL09EmewUgWvrM40kqefYXJNwSHdLszD7yhxKIO';
const PHONE = '9079282554';

async function testSMS() {
  console.log('🧪 Testing Fast2SMS API...\n');
  console.log(`Phone: ${PHONE}`);
  console.log(`API Key: ${API_KEY.substring(0, 20)}...`);
  console.log('\nSending test SMS...\n');

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: '🚨 ETHOS ALERT TEST\n\nThis is a test message from ETHOS Vision Campus Intelligence System.\n\nIf you received this, SMS integration is working!',
        language: 'english',
        flash: 0,
        numbers: PHONE
      })
    });

    const data = await response.json();
    
    console.log('📱 Response from Fast2SMS:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.return === true) {
      console.log('\n✅ SUCCESS! SMS sent to', PHONE);
      console.log('📱 Check your phone - you should receive the SMS within 5-10 seconds!');
    } else {
      console.log('\n❌ FAILED:', data.message);
      console.log('💡 Check your Fast2SMS account balance and API key');
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

testSMS();

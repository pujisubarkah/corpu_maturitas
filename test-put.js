import fetch from 'node-fetch';

async function testSurveyPUT() {
  try {
    console.log('Testing PUT /api/struktur_asn_corpu...');

    const response = await fetch('http://localhost:3002/api/struktur_asn_corpu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        surveiId: 33,
        p7: 1,
        p8: 2,
        p9: 3,
        p10: 4,
        buktiDukung: 'test update'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (response.ok) {
      console.log('✅ PUT /api/struktur_asn_corpu test passed!');
    } else {
      console.log('❌ PUT /api/struktur_asn_corpu test failed!');
    }

  } catch (error) {
    console.error('Error testing PUT endpoint:', error);
  }
}

testSurveyPUT();
import fetch from 'node-fetch';

async function testSurveyAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/kompetensi_generik_nasional', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        surveiId: 33,
        p1: 1,
        p2: 2,
        p3: 3,
        p4: 4,
        p5: 5,
        p6: 6,
        buktiDukung: 'test update'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (response.ok) {
      console.log('✅ Survey API test passed!');
    } else {
      console.log('❌ Survey API test failed!');
    }

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testSurveyAPI();
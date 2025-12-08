
async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Hello AI' }),
        });

        const status = response.status;
        const text = await response.text();

        console.log('Status:', status);
        console.log('Body:', text);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testApi();

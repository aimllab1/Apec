async function test() {
  try {
    const queries = [
      "Hi",
      "Good morning!",
      "thank you so much",
      "help"
    ];

    for (const query of queries) {
      console.log(`\n=================== TESTING QUERY: "${query}" ===================`);
      const response = await fetch('http://localhost:5173/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await response.json();
      console.log("Response:");
      console.log(data.response);
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();

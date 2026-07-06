async function test() {
  try {
    const queries = [
      "Who is the principal?",
      "What are the library rules?",
      "Who won the World Cup in 2022?"
    ];

    for (const query of queries) {
      console.log(`\nTesting query: "${query}"`);
      const response = await fetch('http://localhost:5173/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      console.log("Status code:", response.status);
      const data = await response.json();
      console.log("Response:", data);
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();

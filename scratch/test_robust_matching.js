async function test() {
  try {
    const queries = [
      "Who is the principal?",
      "cutoff formula",
      "bank to pay fees",
      "Is there a bus from Chengalpattu?",
      "Route 04 timing",
      "accreditation of the college"
    ];

    for (const query of queries) {
      console.log(`\n=================== TESTING QUERY: "${query}" ===================`);
      const response = await fetch('http://localhost:5173/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      console.log("Status code:", response.status);
      const data = await response.json();
      console.log("Response:");
      console.log(data.response);
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();

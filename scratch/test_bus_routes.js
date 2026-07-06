async function test() {
  try {
    const queries = [
      "What is the route of Bus 03 (Chengalpattu)?",
      "Give me the phone number of the driver for Route 06",
      "What are the timings of the bus stops for Cheyyar Route 10?",
      "Is there a bus from Marakkanam?"
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

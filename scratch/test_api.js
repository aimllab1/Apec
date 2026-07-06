async function test() {
  try {
    const response = await fetch('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Who is the principal?" })
    });
    const data = await response.json();
    console.log("API Server Response for 'Who is the principal?':");
    console.log(data);
    
    const response2 = await fetch('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "What are the courses offered?" })
    });
    const data2 = await response2.json();
    console.log("\nAPI Server Response for 'What are the courses offered?':");
    console.log(data2);
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();

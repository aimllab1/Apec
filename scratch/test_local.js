async function test() {
  try {
    const response = await fetch('http://127.0.0.1:5001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Who is the principal?" })
    });
    const data = await response.json();
    console.log("Local Python Model Answering 'Who is the principal?':");
    console.log(data);
    
    const response2 = await fetch('http://127.0.0.1:5001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "What are the courses offered?" })
    });
    const data2 = await response2.json();
    console.log("\nLocal Python Model Answering 'What are the courses offered?':");
    console.log(data2);
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();

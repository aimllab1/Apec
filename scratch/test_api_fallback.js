async function test() {
  try {
    const response = await fetch('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "What is the general overview of the college?" })
    });
    const data = await response.json();
    console.log("Local/RAG response:");
    console.log(data);
    
    // Now ask something completely outside the database that triggers Gemini fallback
    const response2 = await fetch('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "What is the capital of France?" })
    });
    const data2 = await response2.json();
    console.log("\nFallback response (should be the 'I couldn't find this information...' fallback from Gemini or a Gemini response if the prompt matches):");
    console.log(data2);
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();

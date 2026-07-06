async function test() {
  try {
    const response = await fetch('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "List the names of all scholarships available for students." })
    });
    const data = await response.json();
    console.log("RAG Gemini response:");
    console.log(data);
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();

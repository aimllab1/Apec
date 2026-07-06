// Multi-turn conversation stress test
async function testConversation() {
  const sessionId = `test-session-${Date.now()}`;

  const conversation = [
    "Hello",
    "What courses does APEC offer?",
    "Tell me about the CSE department",
    "What about placements in CSE?",
    "Who is the HOD?",
    "How do I pay the fees?",
    "What is the IFSC code?",
    "Is there a hostel?",
    "Tell me about the library",
    "What is the cutoff formula?",
    "Tell me about bus routes",
    "Is there a bus from Chengalpattu?",
    "What is the phone number of the principal?",
    "Any scholarships available?",
    "What are the admission requirements?",
    "What is the minimum marks for OC category?",
    "Tell me about placements",
    "Which companies visit campus?",
    "What is the highest package?",
    "Tell me about the ECE department",
    "Thank you"
  ];

  console.log("=== MULTI-TURN CONVERSATION STRESS TEST ===\n");
  for (let i = 0; i < conversation.length; i++) {
    const q = conversation[i];
    console.log(`[Q${i+1}] User: "${q}"`);
    try {
      const res = await fetch('http://localhost:5173/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, sessionId })
      });
      const data = await res.json();
      const preview = data.response.replace(/\n+/g, ' ').slice(0, 100);
      const hasFallback = data.response.includes("couldn't find") || data.response.includes("I don't have");
      console.log(`[A${i+1}] ${hasFallback ? '❌ FALLBACK' : '✅ OK'}: ${preview}...`);
    } catch (err) {
      console.log(`[A${i+1}] ❌ ERROR: ${err.message}`);
    }
    console.log('');
    // Small delay between messages
    await new Promise(r => setTimeout(r, 300));
  }
  console.log("=== TEST COMPLETE ===");
}

testConversation();

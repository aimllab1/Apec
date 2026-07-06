const fs = require('fs');
const path = require('path');

const messagesDir = 'C:\\Users\\Admin\\.gemini\\antigravity-cli\\brain\\b2bfc70b-a610-4ca8-b9d9-d7d7951dc69d\\.system_generated\\messages';
fs.readdir(messagesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const messages = [];
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'read.json') {
      const content = fs.readFileSync(path.join(messagesDir, file), 'utf8');
      try {
        const msg = JSON.parse(content);
        messages.push(msg);
      } catch (e) {
        console.error('Error parsing', file, e);
      }
    }
  });
  
  // Sort by timestamp
  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Print non-hidden messages, or analyze which ones are user vs assistant
  console.log(`Found ${messages.length} total messages.`);
  
  messages.forEach((msg, idx) => {
    // If it's a message containing user prompt or assistant response
    // Let's filter out background task reports if they are marked hideFromUser: true
    // Wait, let's see which ones have hideFromUser: false or are user prompts.
    const isUser = msg.sender && !msg.sender.includes('/') && msg.sender !== 'b2bfc70b-a610-4ca8-b9d9-d7d7951dc69d';
    // Let's just print basic metadata for all, and full content for non-hidden ones.
    console.log(`\n[Msg #${idx + 1}] Sender: ${msg.sender} | Time: ${msg.timestamp} | HideFromUser: ${msg.hideFromUser}`);
    if (msg.renderDetails) {
      console.log(`Title: ${JSON.stringify(msg.renderDetails)}`);
    }
    if (!msg.hideFromUser) {
      console.log(`Content:\n${msg.content}\n--------------------------------------`);
    } else {
      console.log(`Content (Truncated first 100 chars): ${msg.content ? msg.content.substring(0, 100).replace(/\n/g, ' ') : '(none)'}`);
    }
  });
});

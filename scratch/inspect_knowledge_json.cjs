const fs = require('fs');

const data = JSON.parse(fs.readFileSync('Z:\\data\\college_knowledge.json', 'utf8'));
console.log("Keys in college_knowledge.json:", Object.keys(data));
console.log("\nFacilities:", JSON.stringify(data.facilities.map(f => f.name), null, 2));

// check if there is a transport facility
const transport = data.facilities.find(f => f.name.toLowerCase().includes('transport') || f.name.toLowerCase().includes('bus'));
console.log("\nTransport Facility:", JSON.stringify(transport, null, 2));

const fs = require('fs');
const vm = require('vm');

try {
  const content = fs.readFileSync('Z:\\src\\pages\\FacilityDetail.jsx', 'utf8');
  const startIdx = content.indexOf('const busRoutesData = [');
  if (startIdx === -1) {
    throw new Error("Could not find busRoutesData in FacilityDetail.jsx");
  }
  const endMarker = "export default function FacilityDetail()";
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx === -1) {
    throw new Error("Could not find end marker in FacilityDetail.jsx");
  }
  let arrayCode = content.substring(startIdx, endIdx).trim();
  
  // Append assignment to this so it gets exported to the sandbox
  arrayCode += "\nthis.busRoutesData = busRoutesData;";

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(arrayCode, sandbox);
  const busRoutes = sandbox.busRoutesData;
  
  if (busRoutes) {
    console.log("Success! Extracted routes count:", busRoutes.length);
    console.log("Sample route 02:", JSON.stringify(busRoutes[0], null, 2));
  } else {
    console.log("sandbox.busRoutesData is undefined. sandbox keys:", Object.keys(sandbox));
  }
} catch (e) {
  console.error("Extraction failed:", e);
}

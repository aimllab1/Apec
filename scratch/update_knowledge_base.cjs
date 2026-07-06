const fs = require('fs');
const vm = require('vm');
const path = require('path');

try {
  // 1. Read FacilityDetail.jsx and extract busRoutesData
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
  arrayCode += "\nthis.busRoutesData = busRoutesData;";

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(arrayCode, sandbox);
  const busRoutes = sandbox.busRoutesData;

  if (!busRoutes || busRoutes.length === 0) {
    throw new Error("Failed to extract busRoutes");
  }

  // Clean coords from stops to save tokens
  const cleanBusRoutes = busRoutes.map(route => {
    return {
      id: route.id,
      name: route.name,
      busNo: route.busNo,
      driver: route.driver,
      phone: route.phone,
      stops: route.stops.map(stop => ({
        name: stop.name,
        time: stop.time,
        threeMonth: stop.threeMonth,
        sixMonth: stop.sixMonth
      }))
    };
  });

  // 2. Read and parse data/college_knowledge.json
  const kbPath = 'Z:\\data\\college_knowledge.json';
  const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));

  // 3. Find the Transport facility and merge routes
  const transportFacility = kb.facilities.find(f => f.name === "Transport & Bus Routes");
  if (!transportFacility) {
    throw new Error("Could not find 'Transport & Bus Routes' facility in college_knowledge.json");
  }

  transportFacility.bus_routes = cleanBusRoutes;

  // 4. Save updated college_knowledge.json
  fs.writeFileSync(kbPath, JSON.stringify(kb, null, 2), 'utf8');
  console.log("Successfully updated Z:\\data\\college_knowledge.json with 8 detailed bus routes!");

} catch (e) {
  console.error("Update failed:", e);
}

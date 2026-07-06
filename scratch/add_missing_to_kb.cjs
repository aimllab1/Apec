const fs = require('fs');

try {
  const kbPath = 'Z:\\data\\college_knowledge.json';
  const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));

  // Add TNEA Cutoff Calculator details
  kb.cutoff_calculator = {
    description: "APEC provides an online TNEA Cutoff Calculator tool for students to calculate their engineering admission cutoff score out of 200 marks.",
    formula: "Cutoff = Mathematics (100) + (Physics / 2) (50) + (Chemistry / 2) (50)",
    instructions: "Enter your marks out of 100 in Mathematics, Physics, and Chemistry. The calculator takes the full Mathematics score, adds half of the Physics score, and adds half of the Chemistry score to output a total out of 200."
  };

  // Add Fee Payment Details
  kb.fee_payment = {
    payment_modes: ["Net Banking", "UPI Payment (GPay, PhonePe, Paytm, etc.)", "Direct Bank Deposit"],
    bank_details: {
      bank_name: "Central Bank of India",
      branch: "Melmaruvathur",
      ifsc_code: "CBIN0283083",
      account_name: "Adhiparasakthi Engineering College"
    },
    upi_scan_to_pay: "The Smart Fee Portal allows users to input Student Name, Department, and Amount to generate a customized UPI QR Code for instant scanning and payment.",
    important_instructions: "Please make sure to mention your Admission Number / Register Number in the transaction remarks or notes for payment verification."
  };

  fs.writeFileSync(kbPath, JSON.stringify(kb, null, 2), 'utf8');
  console.log("Successfully added Cutoff Calculator and Fee Payment details to college_knowledge.json!");

} catch (e) {
  console.error("Failed to add missing topics:", e);
}

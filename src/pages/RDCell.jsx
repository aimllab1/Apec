import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Award, GraduationCap, DollarSign, Search, Filter, 
  MapPin, Clock, FileText, ChevronRight, CheckCircle2, ListFilter
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

export default function RDCell() {
  const [activeTab, setActiveTab] = useState('compliance'); // compliance, supervisors, scholars, grants
  const [scholarSearch, setScholarSearch] = useState('');
  const [scholarDeptFilter, setScholarDeptFilter] = useState('All');
  const [grantSearch, setGrantSearch] = useState('');
  const [grantDeptFilter, setGrantDeptFilter] = useState('All');

  // Stats Counters
  const totalAwardedScholars = 79;
  const recognizedSupervisorsCount = 13;
  const approvedResearchCentresCount = 4;
  const totalDoctorates = 29; // Sum of completed

  // Anna University Approved Research Centres
  const approvedCentres = [
    { name: "Civil Engineering", code: "4140105", validity: "December 2025" },
    { name: "Mechanical Engineering", code: "4140117", validity: "December 2025" },
    { name: "Electrical and Electronics Engineering", code: "4140108", validity: "December 2025" },
    { name: "Electronics and Communication Engineering", code: "4140107", validity: "December 2025" }
  ];

  // Recognised Research Supervisors
  const supervisors = [
    { name: "Dr. V. Ramasamy", refNum: "2810002", dept: "Civil Engineering" },
    { name: "Dr. K. Thiagarajan", refNum: "4110027", dept: "Civil Engineering" },
    { name: "Dr. C.K. Dhinakar Raj", refNum: "4220016", dept: "Mechanical Engineering" },
    { name: "Dr. R. Kamal Jayaraj", refNum: "3320050", dept: "Mechanical Engineering" },
    { name: "Dr. S. Mothilal", refNum: "2720087", dept: "Mechanical Engineering" },
    { name: "Dr. S. A. Elankurisil", refNum: "2830016", dept: "Electrical and Electronics Engineering" },
    { name: "Dr. R. Srivel", refNum: "4230003", dept: "Electrical and Electronics Engineering" },
    { name: "Dr. J. Raja", refNum: "2630001", dept: "Electronics and Communication Engineering" },
    { name: "Dr. P. Thirumaraiselvan", refNum: "3540012", dept: "Electronics and Communication Engineering" },
    { name: "Dr. S. Jayashri", refNum: "8840118", dept: "Computer Science and Engineering" },
    { name: "Dr. S. Sakthi Raadha", refNum: "2870075", dept: "Science and Humanities" },
    { name: "Dr. N. Papayee", refNum: "8670411", dept: "Chemical Engineering" },
    { name: "Dr. V. Vijayasundaram", refNum: "2670018", dept: "Science and Humanities" }
  ];

  // Doctorates statistics
  const doctorateStats = [
    { dept: "CIVIL", completed: 4, pursuing: 2 },
    { dept: "MECH", completed: 3, pursuing: 0 },
    { dept: "ECE", completed: 4, pursuing: 0 },
    { dept: "EEE", completed: 5, pursuing: 1 },
    { dept: "CSE", completed: 2, pursuing: 3 },
    { dept: "IT", completed: 1, pursuing: 2 },
    { dept: "CHEMICAL", completed: 2, pursuing: 3 },
    { dept: "AIML", completed: 1, pursuing: 0 },
    { dept: "S & H", completed: 5, pursuing: 2 },
    { dept: "MBA", completed: 2, pursuing: 1 },
    { dept: "MCA", completed: 1, pursuing: 1 }
  ];

  // Registered Scholars
  const scholars = [
    { regNo: "2011171006", name: "R. S. Muralitharan", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awarded Degree in 2021" },
    { regNo: "2011171001", name: "D. Kamal Nataraj", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awarded Degree in 2021" },
    { regNo: "1314199111", name: "S. Venkatraman", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awarded Degree in 2022" },
    { regNo: "19121997127", name: "J. Vengadesh Marshall Raman", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awarded Degree in 2023" },
    { regNo: "1523119145", name: "M. Thanmanaselvi", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awaiting for Viva-Voce" },
    { regNo: "17221991181", name: "P. Somiyadevi", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awaiting for Viva-Voce" },
    { regNo: "17141997119", name: "R. K. Manikandan", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awaiting for Viva-Voce" },
    { regNo: "17231197144", name: "M. Archana", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Awaiting for Viva-Voce" },
    { regNo: "17141997183", name: "S. E. Kaarthic", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Thesis Under Preparation" },
    { regNo: "19141997103", name: "N. R. MonishRaaj", supervisor: "Dr. V. Ramasamy", dept: "Civil", status: "Synopsis Under Preparation" },
    { regNo: "1613399190", name: "Moorthi K", supervisor: "Dr. J. Raja", dept: "ECE", status: "Awarded Degree in 2022" },
    { regNo: "1614499247", name: "Parthiban V", supervisor: "Dr. J. Raja", dept: "ECE", status: "Confirmation Completed" },
    { regNo: "1614499474", name: "Shanmugam P", supervisor: "Dr. J. Raja", dept: "ECE", status: "Awarded Degree in 2022" },
    { regNo: "1624499221", name: "Mookhambika N", supervisor: "Dr. J. Raja", dept: "ECE", status: "Synopsis Submitted" },
    { regNo: "16253997143", name: "Aruna Rajendran", supervisor: "Dr. J. Raja", dept: "ECE", status: "Confirmation Completed" },
    { regNo: "18147991165", name: "Balamurugan N", supervisor: "Dr. J. Raja", dept: "ECE", status: "Awarded Degree in 2022" },
    { regNo: "20114022003", name: "Gunasekaran K", supervisor: "Dr. J. Raja", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "1324499127", name: "Revathi A", supervisor: "Dr. J. Raja (Joint)", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "23134997173", name: "Sekar G", supervisor: "Dr. J. Raja", dept: "ECE", status: "Course Work" },
    { regNo: "23134997257", name: "Ezhilvendan M", supervisor: "Dr. J. Raja", dept: "ECE", status: "Course Work" },
    { regNo: "23224997417", name: "Gajalakshmi P", supervisor: "Dr. J. Raja", dept: "ECE", status: "Course Work" },
    { regNo: "23244997365", name: "Uma Maheshwari T", supervisor: "Dr. J. Raja", dept: "ECE", status: "Course Work" },
    { regNo: "23247991129", name: "Suganya N", supervisor: "Dr. J. Raja", dept: "ECE", status: "Course Work" },
    { regNo: "17244997461", name: "Rajeshwari J", supervisor: "Dr. J. Raja", dept: "ECE", status: "Viva-Voce Completed" },
    { regNo: "7089053107", name: "Dr. V. Chandrasekaran", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2015" },
    { regNo: "2011173028", name: "Dr. S. Muthukumar", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2015" },
    { regNo: "2011174046", name: "Dr. R. Jothichitra", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2015" },
    { regNo: "1214499724", name: "Dr. C. Annadurai", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2016" },
    { regNo: "1313399197", name: "Dr. K. Sakthidasan", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2016" },
    { regNo: "2011114133", name: "Dr. A. Jagan", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2017" },
    { regNo: "1313499325", name: "Dr. B. Partibane", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2017" },
    { regNo: "2011147014", name: "Dr. M. Balasaraswathi", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2017" },
    { regNo: "2011174125", name: "Dr. V. Sivasankaran", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2018" },
    { regNo: "1424499761", name: "Dr. S. A. Ammutha Jeevakumari", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2018" },
    { regNo: "201114119", name: "Dr. P. Balaji Srikanth", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "1214499734", name: "Dr. M. Jayekumar", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "2011114056", name: "Dr. A. K. Gnanasekar", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "17254191310", name: "S. Vijayalakshmi", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "1612499209", name: "Mr. S. Sivasakthiselvan", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2020" },
    { regNo: "1625499428", name: "Ms. N. Sridevi", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2020" },
    { regNo: "17284991224", name: "Mrs. M. Jenath", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2021" },
    { regNo: "17144947161", name: "Mr. K. E. Purushothaman", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2021" },
    { regNo: "18134991243", name: "Dr. K. Manikannan", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2021" },
    { regNo: "18134991120", name: "Dr. R. Dhilipkumar", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2021" },
    { regNo: "17144991230", name: "Mr. K. Pavendan", supervisor: "Dr. V. Nagarajan", dept: "ECE", status: "Awarded Degree in 2023" },
    { regNo: "23134997450", name: "Mr. K. Vijayakumar", supervisor: "Dr. P. Thirumaraiselvan", dept: "ECE", status: "Course Work" },
    { regNo: "23144997342", name: "Mr. K. Chairmadurai", supervisor: "Dr. P. Thirumaraiselvan", dept: "ECE", status: "Course Work" },
    { regNo: "23254991147", name: "Ms. V. Pooja", supervisor: "Dr. P. Thirumaraiselvan", dept: "ECE", status: "Course Work" },
    { regNo: "24237991151", name: "Ms. P. Vithiya", supervisor: "Dr. P. Thirumaraiselvan", dept: "ECE", status: "Course Work" },
    { regNo: "20144991168", name: "Mr. M. PremAnand", supervisor: "Dr. P. Thirumaraiselvan (Joint)", dept: "ECE", status: "Confirmation Completed" },
    { regNo: "2011114018", name: "Mangayarkarasi P", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2016" },
    { regNo: "2011174084", name: "Pitchai R", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2017" },
    { regNo: "1325499116", name: "Supraja P", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2017" },
    { regNo: "2011114051", name: "Malathi M", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2017" },
    { regNo: "2011174061", name: "Latha A", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2018" },
    { regNo: "2011174138", name: "Thirumaraiselvan P", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2018" },
    { regNo: "2011174181", name: "Subha T", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2018" },
    { regNo: "1324499793", name: "Veeramakali T", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2018" },
    { regNo: "2011174057", name: "Lakshmi Joshitha K", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "1215499755", name: "Prakash B", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "1214499891", name: "Prabaharan G", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "1614499421", name: "Sakthitharan S", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2019" },
    { regNo: "1224499859", name: "Elamathi N", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2020" },
    { regNo: "17244991502", name: "Subalatha M", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2021" },
    { regNo: "17244991372", name: "Sowmya J", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2021" },
    { regNo: "17244997461", name: "Rajeswari J", supervisor: "Dr. S. Jayashri", dept: "ECE", status: "Awarded Degree in 2024" },
    { regNo: "1314299130", name: "P. Saravanan", supervisor: "Dr. M. Kannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "1313299212", name: "P. Balu", supervisor: "Dr. M. Kannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "1512299182", name: "A. R. Magesh Kumar", supervisor: "Dr. M. Kannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "1514299145", name: "D. Thamilselvan", supervisor: "Dr. M. Kannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "1514299154", name: "G. Loganathan", supervisor: "Dr. M. Kannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "1412299726", name: "B. Elamvazhudhi", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Awarded Degree in 2021" },
    { regNo: "1413299727", name: "J. Prakash", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Awarded Degree in 2021" },
    { regNo: "1413299862", name: "S. Gopikannan", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Awarded Degree in 2024" },
    { regNo: "1415299867", name: "R. Ilandjezian", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "1513299143", name: "R. Pachaiyappan", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "1513269245", name: "S. Vishvanath Perumal", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Awarded Degree in 2017" },
    { regNo: "1512299816", name: "K. Arun", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "16132997243", name: "V. Pugazhenthi", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "17132997296", name: "T. Narayanan", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "20117201028", name: "Madhana Gopal A", supervisor: "Dr. S. Gopalakannan", dept: "Mechanical", status: "Awarded Degree in 2021" },
    { regNo: "1415219106", name: "Thirumalvalavan S", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Awarded Degree in 2020" },
    { regNo: "16122997139", name: "Anbunathan P.E", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "16142997251", name: "Sundarselvam S", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "17132991311", name: "Saravanan M", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "17142997148", name: "Vasanthakumar P", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "17142997156", name: "Dhinakarraj C.K", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Awarded Degree in 2022" },
    { regNo: "17142997339", name: "Pachaiyappan S", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "17252997135", name: "Gajalakshmi K", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Awarded Degree in 2020" },
    { regNo: "18152991224", name: "Rajeshkumar S", supervisor: "Dr. N. Senthilkumar", dept: "Mechanical", status: "Course Work Completed" },
    { regNo: "17132891248", name: "Stalin A", supervisor: "Dr. Mothilal S", dept: "Mechanical", status: "Awarded Degree in 2023" },
    { regNo: "17142891136", name: "David Gnanaraj J", supervisor: "Dr. Mothilal S", dept: "Mechanical", status: "Awarded Degree in 2023" },
    { regNo: "2011173051", name: "Thamizharasan S", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2015" },
    { regNo: "2011173046", name: "Sudha L U", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2016" },
    { regNo: "1213399748", name: "Maal Marugan J", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2017" },
    { regNo: "1213399747", name: "Pugazhendiran P", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2017" },
    { regNo: "2011173031", name: "Nayanatara C", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2017" },
    { regNo: "2011113013", name: "Selvaraj P", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2018" },
    { regNo: "2011113020", name: "Suresh R", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2019" },
    { regNo: "1128499154", name: "Salma Banu A.S", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2019" },
    { regNo: "2011113002", name: "Thamaraiselvi R", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2020" },
    { regNo: "1524399122", name: "Vijayasamundiswary S", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2021" },
    { regNo: "1212399757", name: "Kadhiravan C", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2022" },
    { regNo: "1513399162", name: "Manimaran N", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2024" },
    { regNo: "2011113001*", name: "Deva Brinda M", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2018" },
    { regNo: "17243997114*", name: "Shanmugapriya P", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2022" },
    { regNo: "18233997113*", name: "Sharmila P", supervisor: "Dr. J. Baskaran", dept: "EEE", status: "Awarded Degree in 2023" },
    { regNo: "17133997178", name: "Mahendravarman I", supervisor: "Dr. S.A. Elankurisil", dept: "EEE", status: "Awarded Degree in 2023" },
    { regNo: "18133991280", name: "Kamalsakthi S", supervisor: "Dr. S.A. Elankurisil", dept: "EEE", status: "Thesis Submitted" },
    { regNo: "18133991284", name: "Rajiv Gandhi P", supervisor: "Dr. S.A. Elankurisil", dept: "EEE", status: "Synopsis Submitted" },
    { regNo: "17154991507", name: "Annadurai R", supervisor: "Dr. S.A. Elankurisil", dept: "EEE", status: "Confirmation Completed" },
    { regNo: "24243991201", name: "Dhivya Devi N", supervisor: "Dr. S.A. Elankurisil", dept: "EEE", status: "Course Work" }
  ];

  // Research Grants
  const grants = [
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "IEDC-DST", scheme: "Student Project", title: "Manufacture of Hollow Blocks using Rice Husk Ash", amount: "1,00,000" },
    { dept: "CIVIL", investigator: "Dr. A. Leemarose", agency: "IEDC-DST", scheme: "Student Project", title: "Wood corn earth savings exclusives", amount: "1,00,000" },
    { dept: "CIVIL", investigator: "Mr. B. Krishnamoorthy", agency: "TNSCST", scheme: "Student Project", title: "In vessel composting of municipal solid waste with extraction of energy", amount: "6,000" },
    { dept: "CIVIL", investigator: "Mr. T.D. Ramadasan", agency: "TNSCST", scheme: "Student Project", title: "Municipal waste water treatment using algae", amount: "6,000" },
    { dept: "CIVIL", investigator: "Mr. R. Venkata Krishnaiah", agency: "IEDC-DST", scheme: "Student Project", title: "Manufacturing of bricks by using effluent treatment plant", amount: "1,00,000" },
    { dept: "CIVIL", investigator: "Dr. A. Krishnamoorthy", agency: "IEDC-DST", scheme: "Student Project", title: "Interlocking blocks using quarry dust as replacement for sand", amount: "1,00,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "TNSCST", scheme: "Student Project", title: "Treatment of effluent from textile industry by dried beans", amount: "10,000" },
    { dept: "CIVIL", investigator: "Mr. T.D. Ramadasan", agency: "TNSCST", scheme: "Student Project", title: "Conversation of waste to building materials – Baggase ash bricks", amount: "7,500" },
    { dept: "CIVIL", investigator: "Mr. M. Marriappan", agency: "TNSCST", scheme: "Student Project", title: "Replacement of coconut shell aggregates", amount: "5,000" },
    { dept: "CIVIL", investigator: "Mr. R. Venkata Krishnaiah", agency: "IEDC-DST", scheme: "Student Project", title: "Development of Fly Ash solid blocks using CENTRILIT NC", amount: "1,00,000" },
    { dept: "CIVIL", investigator: "Dr. A. Krishnamoorthy", agency: "TNSCST", scheme: "Student Project", title: "Production of green concrete using quarry dust and fly ash", amount: "7,500" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "TNSCST", scheme: "Student Project", title: "Manufacture Of Bricks By Using Tannery Effluent Treatment Plant Sludge", amount: "7,500" },
    { dept: "CIVIL", investigator: "Mr. M. Marriappan", agency: "TNSCST", scheme: "Student Project", title: "Experimental Study of Coconut shell aggregates", amount: "7,500" },
    { dept: "CIVIL", investigator: "Mr. T.D. Ramadasan", agency: "TNSCST", scheme: "Student Project", title: "Treatment of waste water using Nano Film", amount: "7,500" },
    { dept: "CIVIL", investigator: "Mr. E. Chandrasekar", agency: "TNSCST", scheme: "Student Project", title: "High Rate Vermi Composting of Garbage by using Effective Micro Organisms (EM)", amount: "6,000" },
    { dept: "CIVIL", investigator: "Mr. E. Chandrasekar", agency: "CSIR", scheme: "National Workshop", title: "Advances in Environmental and Water Resources Engineering", amount: "20,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "CSIR", scheme: "National Workshop", title: "Advances in Earthquake Resistant design and Construction Techniques", amount: "25,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "AICTE", scheme: "International Conference", title: "Innovative Materials and Construction", amount: "1,50,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "CSIR", scheme: "International Conference", title: "Innovative Materials and Construction", amount: "40,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "Anna University", scheme: "Faculty Development Programme", title: "Strength of Materials", amount: "90,000" },
    { dept: "CIVIL", investigator: "Ms. C. Rajasakthi", agency: "TNSCST", scheme: "Student Project", title: "GIS based Assessment of Ground Water Vulnerability", amount: "6,000" },
    { dept: "CIVIL", investigator: "Ms. T. Bhagavathi Pushpa", agency: "TNSCST", scheme: "Student Project", title: "Reuse of Concrete Debris as aggregates in Nominal concrete", amount: "6,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "AICTE", scheme: "Research Promotion", title: "Design a Real Time Wireless Sensor Networks tested for Intelligent Building Automation", amount: "9,00,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy & Dr. A. Leemarose", agency: "AICTE", scheme: "International Workshop", title: "Advances on Concrete Materials & Exhibition", amount: "2,00,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy & Dr. A. Leemarose", agency: "CSIR", scheme: "International Workshop", title: "Advances on Concrete Materials & Exhibition", amount: "40,000" },
    { dept: "CIVIL", investigator: "Dr. V. Ramasamy", agency: "AICTE", scheme: "MODROB", title: "Modernization of Environmental engineering laboratory", amount: "14,39,000" },
    { dept: "MECH", investigator: "Dr. M. Kannan", agency: "AICTE", scheme: "Summer Winter School", title: "2 week Summer Winter School Programme", amount: "7,00,000" },
    { dept: "MECH", investigator: "Dr. R. Senthil", agency: "AICTE", scheme: "Seminar Grant", title: "Seminar Grant for SDP on International Conference on Green Technology in Engineering & Applied Sciences", amount: "2,00,000" },
    { dept: "MECH", investigator: "Dr. R. Senthil", agency: "AICTE", scheme: "MODROBS", title: "Modernization and Removal of Obsolescence – Heat Engines Lab", amount: "3,50,000" },
    { dept: "MECH", investigator: "Mr. R. Pachiayappan", agency: "TNSCST", scheme: "Student Project", title: "Design of a manually operated paper recycling machine", amount: "7,500" },
    { dept: "MECH", investigator: "Mr. P. Vijayaraj", agency: "MNES", scheme: "Club Activities", title: "Renewable Energy club", amount: "25,000" },
    { dept: "MECH", investigator: "Dr. M. Kannan", agency: "NEC", scheme: "Awareness Campaign", title: "National Environment Awareness Campaign", amount: "5,000" },
    { dept: "MECH", investigator: "Mr. R. Karthikeyan", agency: "AICTE", scheme: "MODROBS", title: "Modernization Of Downdraft Gasifier System For Power", amount: "7,00,000" },
    { dept: "MECH", investigator: "Mr. R. Karthikeyan", agency: "BDRC", scheme: "Project", title: "Bio-diesel Research Center (BDRC)", amount: "1,00,000" },
    { dept: "MECH", investigator: "Mr. R. Senthil", agency: "IEDC", scheme: "Student Project", title: "Wave Converter using Flat Plate", amount: "1,00,000" },
    { dept: "MECH", investigator: "Mr. R. Senthil", agency: "IEDC", scheme: "Student Project", title: "Trapping of harmful exhaust gas from automotives", amount: "1,00,000" },
    { dept: "MECH", investigator: "Mr. R. Senthil", agency: "TNSCST", scheme: "Student Project", title: "Engine run by compressed air within built refueling system", amount: "6,000" },
    { dept: "MECH", investigator: "Mr. R. Karthikeyan", agency: "IEDC", scheme: "Student Project", title: "Design & Fabrication of 3L Wind Mill", amount: "1,00,000" },
    { dept: "ECE", investigator: "Dr. V. Nagarajan", agency: "AICTE", scheme: "Seminar Grant", title: "SDP on Application of Digital Filters in DSP Problems", amount: "6,80,000" },
    { dept: "ECE", investigator: "Dr. V. Nagarajan", agency: "AICTE", scheme: "Seminar Grant", title: "National Seminar on \"Research Challenges in MIMO-OFDM Wireless Systems\"", amount: "75,000" },
    { dept: "ECE", investigator: "Dr. V. Nagarajan", agency: "AICTE", scheme: "Seminar Grant", title: "International Conference on Communication and Signal Processing ICCSP-2012", amount: "2,00,000" },
    { dept: "ECE", investigator: "Dr. V. Nagarajan", agency: "AICTE", scheme: "Seminar Grant", title: "FDP on \"Emerging Issues and Challenges in Wireless Networks\"", amount: "3,00,000" },
    { dept: "ECE", investigator: "Mrs. R. Jothichitra", agency: "TNSCST", scheme: "Student Project", title: "Octagonal Fractal Microstrip Antenna for Wireless Applications", amount: "7,500" },
    { dept: "ECE", investigator: "Mrs. P. Mangaiyarkarasi", agency: "TNSCST", scheme: "Student Project", title: "LDR and Human Detection Sensor controlled Automatic LED Streetlight Switching system", amount: "10,000" },
    { dept: "ECE", investigator: "K. Moorthy", agency: "IEDC", scheme: "Student Project", title: "Preemptive Signal Switching For Emergency Vehicles Using Dynamic GPS Signals", amount: "1,00,000" },
    { dept: "ECE", investigator: "A. K. Gnanasekar", agency: "IEDC", scheme: "Student Project", title: "Audio Guidance System for Visually Impaired People", amount: "1,00,000" },
    { dept: "ECE", investigator: "Dr. J. Raja", agency: "Anna University", scheme: "FDTP", title: "VLSI Design", amount: "25,000" },
    { dept: "ECE", investigator: "Dr. V. Nagarajan", agency: "IEDC", scheme: "Student Project", title: "Automatic Energy Meter and Power Consumption System using GSM", amount: "1,00,000" },
    { dept: "ECE", investigator: "Dr. V. Nagarajan", agency: "IEDC", scheme: "Student Project", title: "Microstrip antenna for Biomedical application", amount: "1,00,000" },
    { dept: "ECE", investigator: "Mr. T.N. Sureshbabu", agency: "TNSCST", scheme: "Student Project", title: "Stepped slot microstrip patch antenna integrated on solar cells for stand-alone communication systems", amount: "10,000" },
    { dept: "ECE", investigator: "Dr. M. Malathi", agency: "TNSCST", scheme: "Student Project", title: "Smart wearable device to trace the children", amount: "9,000" },
    { dept: "ECE", investigator: "Dr. V. Nagarajan", agency: "TNSCST", scheme: "Student Project", title: "Design of slot ring antenna with reconfigurable array for telemetry system", amount: "7,500" },
    { dept: "EEE", investigator: "Dr. J. Baskaran", agency: "AICTE", scheme: "FDP", title: "Facts controller application in transmission line", amount: "3,50,000" },
    { dept: "EEE", investigator: "Dr. J. Baskaran", agency: "AICTE", scheme: "FDP", title: "Optimization techniques for power system problems", amount: "4,20,000" },
    { dept: "EEE", investigator: "Dr. J. Baskaran", agency: "AICTE", scheme: "FDP", title: "Power quality issues, problem and solutions", amount: "1,00,000" },
    { dept: "EEE", investigator: "Dr. J. Baskaran", agency: "IEDC", scheme: "Student Project", title: "Design of Copper Oxide Solar Panel", amount: "1,00,000" },
    { dept: "EEE", investigator: "Dr. J. Baskaran", agency: "IEDC", scheme: "Student Project", title: "Hybrid Solar Panel", amount: "1,00,000" },
    { dept: "EEE", investigator: "Dr. J. Baskaran", agency: "IEDC", scheme: "Student Project", title: "Domestic Solar-Aero-Hydro Power Generation System", amount: "1,00,000" },
    { dept: "EEE", investigator: "Mrs. P. Radika", agency: "IEDC", scheme: "Student Project", title: "Fuel Cell Powered UPS With Modified DC-DC Converter", amount: "1,00,000" },
    { dept: "CSE", investigator: "Ms. Latha Arthanari", agency: "AICTE", scheme: "Summer Winter School", title: "Use of Mathematical Complexity and advanced Cryptographic Techniques in Network Security", amount: "3,00,000" },
    { dept: "CSE", investigator: "Mrs. A. Latha", agency: "IEDC", scheme: "Project", title: "Smart home for Remote monitoring and control of household devices using wireless sensors", amount: "1,00,000" },
    { dept: "CSE", investigator: "Dr. A. Bhuvaneswari", agency: "IEDC", scheme: "Project", title: "A Pervasive health monitoring for hypertensive antenatal woman", amount: "1,00,000" },
    { dept: "CSE", investigator: "Mr. M. Mariappan", agency: "DRDO", scheme: "Conference", title: "Two day conference on RADAR and Satellite Imaging", amount: "30,000" },
    { dept: "CSE", investigator: "Mr. G. Prabaharan", agency: "TNSCST", scheme: "Student Project", title: "Evaluation of land Suitability and selecting crops for farmers using Fuzzy System", amount: "6,000" },
    { dept: "IT", investigator: "Dr. D. Sivakumar", agency: "AICTE", scheme: "Seminar Grant", title: "Wireless Sensor Network", amount: "1,50,000" },
    { dept: "IT", investigator: "Dr. D. Sivakumar", agency: "AICTE", scheme: "RPS", title: "Design A Real Time Wireless Sensor Networks Test bed For Intelligent Building Automation", amount: "9,00,000" },
    { dept: "IT", investigator: "Dr. D. Sivakumar", agency: "AICTE", scheme: "MODROBS", title: "Sharing the Power Establishment of Single PC with Multiple Users Using Wireless Network", amount: "7,50,000" },
    { dept: "IT", investigator: "Mrs. P. Managaiyarkarasi", agency: "TNSCST", scheme: "Student Project", title: "Street Lamp Based on SCM Technologies", amount: "6,000" },
    { dept: "IT", investigator: "Mr. S. Tamilselvan", agency: "IEDC", scheme: "Student Project", title: "Sharing the Power of Single Desktop PC With Multiple Users Using Wireless Networks", amount: "1,00,000" },
    { dept: "IT", investigator: "Mr. A.K. Gnanasekaran", agency: "IEDC", scheme: "Student Project", title: "Protection System for Animal Entering Habitation using Wireless Sensor Networks", amount: "1,00,000" },
    { dept: "IT", investigator: "Mrs. T. Veeramakali", agency: "TNSCST", scheme: "Student Project", title: "Fire Detection On Running Train Using Zigbee Wireless Sensor Network", amount: "10,000" },
    { dept: "IT", investigator: "Mr. R. Pitchai", agency: "TNSCST", scheme: "Student Project", title: "Integrating TeleMedicine And Generating Generic Medicine Detail In Healthcare Institutions Using Cloud Computing", amount: "10,000" },
    { dept: "CHEMICAL", investigator: "Prof. N. Krishnaswamy", agency: "TNSCST", scheme: "Student Project", title: "Design of spouted bed fluidization for Agricultural purposes", amount: "5,000" },
    { dept: "CHEMICAL", investigator: "Mr. S. Velmurugan", agency: "TNSCST", scheme: "Student Project", title: "Production of Cashew Nut Shell Liquid (CNSL) by the extraction method", amount: "5,000" },
    { dept: "CHEMICAL", investigator: "Mr. A. Babuponnusami", agency: "IEDC", scheme: "Student Project", title: "Fuel oil from Waste Plastic and Rubber", amount: "10,000" },
    { dept: "CHEMICAL", investigator: "Mr. A. Babuponnusami", agency: "TNSCST", scheme: "Student Project", title: "Removal of phenol from waste water using Nano Biomaterial catalyzed Advanced Oxidation Process", amount: "7,500" },
    { dept: "CHEMICAL", investigator: "Dr. R. Rajasekaran & Mr. S. Velmurugan", agency: "AICTE", scheme: "MODROBS", title: "Modernization of Heat Transfer Laboratory", amount: "3,60,000" },
    { dept: "CHEMICAL", investigator: "Mrs. G. Saraswathi", agency: "IEDC-AICTE", scheme: "Student Project", title: "Extraction of nano phytochemicals and testing their efficiency as mosquito larvicide", amount: "1,00,000" },
    { dept: "CHEMICAL", investigator: "Mr. A. Babuponnusami", agency: "IEDC-AICTE", scheme: "Student Project", title: "Manufacturing of Fuel oil from waste Tyre", amount: "1,00,000" },
    { dept: "CHEMICAL", investigator: "B. Ganesh", agency: "TNSCST", scheme: "Student Project", title: "A study on physicochemical and heavy metals characteristics of madhuranthagam lake, Tamilnadu, India", amount: "7,500" },
    { dept: "S & H", investigator: "Dr. N. Pappayee", agency: "AICTE", scheme: "RPS Project", title: "Liposomes the Model Nanosystems", amount: "9,20,000" },
    { dept: "MCA", investigator: "Mr. S.P. Ponnusamy", agency: "AICTE", scheme: "MODROBS", title: "Modernize And Remove Obsolescence In Computing Facilities", amount: "5,20,000" }
  ];

  // Extract unique departments for filtering
  const scholarDepts = useMemo(() => {
    const depts = new Set(scholars.map(s => s.dept));
    return ['All', ...Array.from(depts)];
  }, []);

  const grantDepts = useMemo(() => {
    const depts = new Set(grants.map(g => g.dept));
    return ['All', ...Array.from(depts)];
  }, []);

  // Filter scholars
  const filteredScholars = useMemo(() => {
    return scholars.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(scholarSearch.toLowerCase()) || 
                          s.regNo.includes(scholarSearch) ||
                          s.supervisor.toLowerCase().includes(scholarSearch.toLowerCase());
      const matchDept = scholarDeptFilter === 'All' || s.dept === scholarDeptFilter;
      return matchSearch && matchDept;
    });
  }, [scholarSearch, scholarDeptFilter]);

  // Filter grants
  const filteredGrants = useMemo(() => {
    return grants.filter(g => {
      const matchSearch = g.title.toLowerCase().includes(grantSearch.toLowerCase()) || 
                          g.investigator.toLowerCase().includes(grantSearch.toLowerCase()) ||
                          g.agency.toLowerCase().includes(grantSearch.toLowerCase()) ||
                          g.scheme.toLowerCase().includes(grantSearch.toLowerCase());
      const matchDept = grantDeptFilter === 'All' || g.dept === grantDeptFilter;
      return matchSearch && matchDept;
    });
  }, [grantSearch, grantDeptFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="mb-12">
          <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
            APEC R&D CELL
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
            Research & Development Cell
          </h1>
          <p className="text-base text-gray-500 font-bold max-w-3xl leading-relaxed">
            Facilitating scholarly breakthroughs, collaborative funding grants, and high-impact doctoral studies at Adhiparasakthi Engineering College.
          </p>
        </div>

        {/* Stats Summary Rows */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:border-[#FFE7CC] transition-all duration-300">
            <span className="block text-3xl font-black text-[#FF8A00]">{totalAwardedScholars}</span>
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Degrees Awarded</span>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:border-indigo-200 transition-all duration-300">
            <span className="block text-3xl font-black text-indigo-650">{recognizedSupervisorsCount}</span>
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Recognised Supervisors</span>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:border-emerald-200 transition-all duration-300">
            <span className="block text-3xl font-black text-emerald-650">{approvedResearchCentresCount}</span>
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Approved Research Centres</span>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:border-purple-200 transition-all duration-300">
            <span className="block text-3xl font-black text-purple-600">{totalDoctorates}</span>
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Total Doctorates</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="grid grid-cols-2 md:flex md:flex-row gap-2 bg-white p-1.5 md:p-2 rounded-2xl border border-gray-200 mb-8 w-full shadow-sm">
          {[
            { id: 'compliance', label: 'Compliance & Approvals', icon: Award },
            { id: 'supervisors', label: 'Research Supervisors', icon: GraduationCap },
            { id: 'scholars', label: 'Registered Scholars', icon: BookOpen },
            { id: 'grants', label: 'Research Grants & Projects', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-2 text-xs md:text-sm font-bold p-3.5 md:px-6 md:py-3.5 rounded-xl transition-all cursor-pointer text-center md:text-left md:whitespace-nowrap grow ${
                  activeTab === tab.id 
                    ? 'bg-indigo-650 text-white shadow-md' 
                    : 'text-gray-500 hover:text-indigo-650 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* TAB 1: COMPLIANCE & APPROVALS */}
              {activeTab === 'compliance' && (
                <div className="space-y-10">
                  {/* UGC 2(f) and 12(B) Block */}
                  <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                    <h2 className="text-2xl md:text-3xl font-black mb-4 font-title text-indigo-650 flex items-center gap-2.5">
                      <Award className="w-6.5 h-6.5 text-[#FF8A00]" /> UGC Section 2(f) & 12 (B) Recognitions
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium mb-6">
                      Adhiparasakthi Engineering College is proudly recognized under Section 2(f) and 12(B) of the UGC Act, certifying our institutional adherence to national standards of higher education, administrative excellence, and direct eligibility to receive central assistance and academic research grants.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-650 bg-indigo-50 border border-indigo-100 px-4.5 py-2.5 rounded-xl">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-650" /> UGC Autonomous College
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-650 bg-indigo-50 border border-indigo-100 px-4.5 py-2.5 rounded-xl">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-650" /> Section 2(f) Certified
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-650 bg-indigo-50 border border-indigo-100 px-4.5 py-2.5 rounded-xl">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-650" /> Section 12(B) Approved
                      </div>
                    </div>
                  </div>

                  {/* Approved Anna University Research Centres */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-black mb-6 font-title text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5.5 h-5.5 text-indigo-650" /> Approved Research Centres (Anna University)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {approvedCentres.map((centre, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
                          <span className="text-[10px] uppercase font-black text-indigo-650 bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">
                            Code: {centre.code}
                          </span>
                          <h4 className="text-lg font-black text-gray-900 mb-2">{centre.name}</h4>
                          <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" /> Validity: Approved upto {centre.validity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESEARCH SUPERVISORS & DOCTORATES */}
              {activeTab === 'supervisors' && (
                <div className="space-y-12">
                  {/* Recognized Supervisors Table */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-black mb-2 font-title text-gray-900">
                      Recognised Research Supervisors
                    </h3>
                    <p className="text-xs text-gray-500 font-bold mb-6">
                      APEC boasts a dedicated pool of research mentors approved by Anna University to guide Ph.D. scholars in engineering, technology, and applied sciences.
                    </p>
                    <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-550 border-b border-gray-150">
                            <th className="py-4.5 px-6">Name of Supervisor</th>
                            <th className="py-4.5 px-6">Reference Number</th>
                            <th className="py-4.5 px-6">Department</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                          {supervisors.map((supervisor, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6 font-extrabold text-gray-900">{supervisor.name}</td>
                              <td className="py-4 px-6 font-mono text-xs text-indigo-650">{supervisor.refNum}</td>
                              <td className="py-4 px-6">{supervisor.dept}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Doctorates stats */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-black mb-2 font-title text-gray-900">
                      Doctorates in the Department
                    </h3>
                    <p className="text-xs text-gray-500 font-bold mb-6">
                      A summary of doctoral faculty members and active research guides across all key departments.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {doctorateStats.map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-150 p-5 rounded-2xl hover:bg-white hover:border-indigo-200 transition-all">
                          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">{stat.dept}</h4>
                          <div className="flex gap-4 items-center">
                            <div>
                              <span className="block text-2xl font-black text-indigo-650">{String(stat.completed).padStart(2, '0')}</span>
                              <span className="text-[9px] uppercase font-black text-gray-400">Completed</span>
                            </div>
                            {stat.pursuing > 0 && (
                              <div className="border-l border-gray-200 pl-4">
                                <span className="block text-2xl font-black text-emerald-650">{String(stat.pursuing).padStart(2, '0')}</span>
                                <span className="text-[9px] uppercase font-black text-gray-400">Pursuing</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REGISTERED SCHOLARS */}
              {activeTab === 'scholars' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-150">
                    <div className="relative w-full md:max-w-md">
                      <input 
                        type="text"
                        value={scholarSearch}
                        onChange={(e) => setScholarSearch(e.target.value)}
                        placeholder="Search scholars, registration no, supervisors..."
                        className="w-full text-xs px-4 py-3 pl-10 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#FF8A00] transition-all font-semibold text-gray-800"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
                      <ListFilter className="w-4 h-4 text-gray-400" />
                      <select 
                        value={scholarDeptFilter} 
                        onChange={(e) => setScholarDeptFilter(e.target.value)}
                        className="text-xs font-bold border border-gray-200 rounded-xl bg-white px-4 py-2.5 text-gray-700 outline-none cursor-pointer"
                      >
                        <option value="All">All Departments</option>
                        {scholarDepts.filter(d => d !== 'All').map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-550 border-b border-gray-150">
                          <th className="py-4 px-6">Reg No</th>
                          <th className="py-4 px-6">Scholar Name</th>
                          <th className="py-4 px-6">Supervisor Name</th>
                          <th className="py-4 px-6">Department</th>
                          <th className="py-4 px-6 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                        {filteredScholars.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-gray-400 font-bold">
                              No scholars found matching the filters
                            </td>
                          </tr>
                        ) : (
                          filteredScholars.map((scholar, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4.5 px-6 font-mono text-xs text-indigo-650">{scholar.regNo}</td>
                              <td className="py-4.5 px-6 font-extrabold text-gray-900">{scholar.name}</td>
                              <td className="py-4.5 px-6">{scholar.supervisor}</td>
                              <td className="py-4.5 px-6 uppercase text-xs font-extrabold text-gray-500">{scholar.dept}</td>
                              <td className="py-4.5 px-6 text-right">
                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                                  scholar.status.includes('Awarded') 
                                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-650' 
                                    : scholar.status.includes('Awaiting') || scholar.status.includes('Submitted')
                                      ? 'bg-amber-50 border border-amber-100 text-amber-600'
                                      : 'bg-indigo-50 border border-indigo-100 text-indigo-650'
                                }`}>
                                  {scholar.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: GRANTS RECEIVED */}
              {activeTab === 'grants' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-150">
                    <div className="relative w-full md:max-w-md">
                      <input 
                        type="text"
                        value={grantSearch}
                        onChange={(e) => setGrantSearch(e.target.value)}
                        placeholder="Search project title, agency, PI investigator..."
                        className="w-full text-xs px-4 py-3 pl-10 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#FF8A00] transition-all font-semibold text-gray-800"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
                      <ListFilter className="w-4 h-4 text-gray-400" />
                      <select 
                        value={grantDeptFilter} 
                        onChange={(e) => setGrantDeptFilter(e.target.value)}
                        className="text-xs font-bold border border-gray-200 rounded-xl bg-white px-4 py-2.5 text-gray-700 outline-none cursor-pointer"
                      >
                        <option value="All">All Departments</option>
                        {grantDepts.filter(d => d !== 'All').map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-550 border-b border-gray-150">
                          <th className="py-4.5 px-6">Dept</th>
                          <th className="py-4.5 px-6">Investigator / PI</th>
                          <th className="py-4.5 px-6">Funding Agency</th>
                          <th className="py-4.5 px-6">Scheme</th>
                          <th className="py-4.5 px-6">Title of Project</th>
                          <th className="py-4.5 px-6 text-right">Amount (Rs)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                        {filteredGrants.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-gray-400 font-bold">
                              No research grants found matching the filters
                            </td>
                          </tr>
                        ) : (
                          filteredGrants.map((grant, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6 font-extrabold text-indigo-650 text-xs uppercase">{grant.dept}</td>
                              <td className="py-4 px-6 font-extrabold text-gray-900 whitespace-nowrap">{grant.investigator}</td>
                              <td className="py-4 px-6 font-bold text-gray-700 whitespace-nowrap">{grant.agency}</td>
                              <td className="py-4 px-6 text-xs text-gray-500">{grant.scheme}</td>
                              <td className="py-4 px-6 text-xs text-gray-800 leading-relaxed font-bold min-w-[200px]">{grant.title}</td>
                              <td className="py-4 px-6 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                                ₹{grant.amount}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

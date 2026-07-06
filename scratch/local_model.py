import json
import os
import re
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)

# Load college knowledge
knowledge_path = os.path.join(os.getcwd(), 'data', 'college_knowledge.json')
with open(knowledge_path, 'r', encoding='utf-8') as f:
    kb = json.load(f)

# Helper functions for lightweight stemming
def stem_word(word):
    word = word.lower()
    if len(word) <= 4:
        return word
    # Strip common suffixes
    if word.endswith('sses'):
        return word[:-2]
    if word.endswith('ies'):
        return word[:-3] + 'i'
    if word.endswith('ss'):
        return word
    if word.endswith('s') and not word.endswith('us') and not word.endswith('is') and not word.endswith('as'):
        return word[:-1]
    if word.endswith('y') and not word.endswith('ay') and not word.endswith('ey') and not word.endswith('oy') and not word.endswith('uy'):
        return word[:-1] + 'i'
    return word

def stem_text(text):
    if not text:
        return ""
    words = re.findall(r'\b\w+\b', text.lower())
    return " ".join([stem_word(w) for w in words])

# Break down the knowledge base into individual fact blocks
facts = []

# 1. General College Info
facts.append({
    "keywords": "college name short established location accreditation code helpline email website description info details",
    "text": f"Adhiparasakthi Engineering College (APEC) was established in {kb['college_info']['established']} at {kb['college_info']['location']}. It is a {kb['college_info']['accreditation']} with TNEA counseling code {kb['college_info']['tnea_counseling_code']}. Website: {kb['college_info']['website']}, Helpline: {kb['college_info']['helpline']}."
})

# 2. Administration details
for admin in kb['administration']:
    facts.append({
        "keywords": f"principal leader vice principal dean administrative officer ao qualifications bio contact office who is {admin['role']} {admin['name']}",
        "text": f"{admin['name']} is the {admin['role']} at APEC. Qualifications: {admin['qualifications']}. Bio: {admin['bio']}. Office: {admin['office']}. Contact: {admin['contact']}."
    })

# 3. Placement Details
placement_partners = ", ".join([p['name'] for p in kb['placements']['partners']])
facts.append({
    "keywords": "placements percentage offers partners highest ctc companies recruit salary jobs lpa training crt mou",
    "text": f"APEC has a placement rate of {kb['placements']['placement_percentage']} with {kb['placements']['offers_generated_yearly']} offers generated yearly. Highest CTC offered is {kb['placements']['highest_ctc']}. Key recruiting and MOU partners include {placement_partners}. Placement training includes CRT, Mock Interview Drills, and internships."
})

# 4. Admissions, Programs, Scholarships
ug_list = ", ".join([p['name'] for p in kb['admissions']['ug_programs']])
pg_list = ", ".join([p['name'] for p in kb['admissions']['pg_programs']])
phd_list = ", ".join([p['name'] for p in kb['admissions']['phd_programs']])
facts.append({
    "keywords": "courses programs ug pg phd undergraduate postgraduate doctoral degrees curriculum admissions offered student",
    "text": f"APEC offers Under Graduate (UG) programs: {ug_list}; Post Graduate (PG) programs: {pg_list}; and Doctoral (PhD) programs: {phd_list}."
})

for prog in kb['admissions']['ug_programs'] + kb['admissions']['pg_programs'] + kb['admissions']['phd_programs']:
    facts.append({
        "keywords": f"course program duration intake seats code capacity student {prog['name']}",
        "text": f"The program {prog['name']} has a duration of {prog['duration']} and an annual student intake capacity of {prog.get('intake', 'N/A')} seats."
    })

for scholarship in kb['admissions']['scholarships']:
    facts.append({
        "keywords": f"scholarship amount provider category description wings to dreams senthilkumar merit need student {scholarship['title']}",
        "text": f"The '{scholarship['title']}' scholarship is a {scholarship['category']} scholarship provided by {scholarship['provider']}, offering {scholarship['amount']}. Description: {scholarship['description']}"
    })

# 5. Facilities
for facility in kb['facilities']:
    facts.append({
        "keywords": f"facility lab library hostel bus transport route block block room mess gym wifi {facility['name']}",
        "text": f"{facility['name']}: {facility['description']}"
    })
    if facility['name'] == "Transport & Bus Routes" and 'bus_routes' in facility:
        for route in facility['bus_routes']:
            stops_str = ", ".join([f"{s['name']} (at {s['time']})" for s in route['stops']])
            facts.append({
                "keywords": f"bus transport route timing stops driver phone busNo number contact available check timing route {route['id']} {route['name']} {route['driver']}",
                "text": f"Bus Route {route['id']} ({route['name']}). Bus Number: {route['busNo']}. Driver: {route['driver']} (Phone: {route['phone']}). Stops and Timings: {stops_str}."
            })

# 6. Departments
for dept in kb['departments']:
    faculty_list = ", ".join([f"{f['name']} ({f['designation']})" for f in dept['faculty']])
    facts.append({
        "keywords": f"department about vision mission hod faculty {dept['key']} {dept['name']}",
        "text": f"The Department of {dept['name']} ({dept['key'].upper()}). About: {dept['about']}. Vision: {dept['vision']}. Mission: {', '.join(dept['mission'])}."
    })
    facts.append({
        "keywords": f"faculty teachers hod list staff professors department student {dept['key']} {dept['name']}",
        "text": f"Faculty members in the Department of {dept['name']} include: {faculty_list}."
    })

# 7. Cutoff Calculator
if 'cutoff_calculator' in kb:
    calc = kb['cutoff_calculator']
    facts.append({
        "keywords": "cutoff calculator formula calculate mathematics physics chemistry mark admission score",
        "text": f"{calc['description']} Formula: {calc['formula']}. Instructions: {calc['instructions']}"
    })

# 8. Fee Payment
if 'fee_payment' in kb:
    fee = kb['fee_payment']
    bank = fee['bank_details']
    modes = ", ".join(fee['payment_modes'])
    facts.append({
        "keywords": "fee payment bank account number details ifsc cbi central bank qr upi remark instructions deposit pay online",
        "text": f"Fee Payment Bank Details: Bank: {bank['bank_name']}, Branch: {bank['branch']}, Account Name: {bank['account_name']}, IFSC Code: {bank['ifsc_code']}. Accepted Payment Modes: {modes}. QR Scan: {fee['upi_scan_to_pay']} Note: {fee['important_instructions']}"
    })

# Build TF-IDF index using stemmed corpus
vectorizer = TfidfVectorizer(stop_words='english')
corpus = [stem_text(fact['keywords'] + " " + fact['text']) for fact in facts]
tfidf_matrix = vectorizer.fit_transform(corpus)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message', '').strip()
    if not message:
        return jsonify({"response": "I couldn't find this information in the current college database. Please contact the college help desk for confirmation."})
    
    # Conversational Greetings and Helpers
    message_clean = message.lower().strip().replace('?', '').replace('!', '')
    greetings = ['hi', 'hello', 'hey', 'greetings', 'hola', 'yo', 'good morning', 'good afternoon', 'good evening']
    if any(message_clean == g or message_clean.startswith(g + ' ') for g in greetings):
        return jsonify({"response": "Hello! 👋 I am the APEC AI Assistant. How can I assist you today? You can ask me about admissions, courses, placements, fee payments, hostels, or bus routes!"})
        
    if any(g in message_clean for g in ['how are you', 'how is it going', 'how do you do']):
        return jsonify({"response": "I am functioning perfectly, thank you! How can I help you with APEC college information today?"})
        
    if any(g in message_clean for g in ['thank you', 'thanks', 'appreciate it']):
        return jsonify({"response": "You are very welcome! Let me know if you have any other questions."})
        
    if any(g in message_clean for g in ['bye', 'goodbye', 'exit', 'see you']):
        return jsonify({"response": "Goodbye! Have a great day ahead, and feel free to chat again if you need anything else!"})
        
    if message_clean in ['help', 'what can you do', 'options', 'features', 'menu']:
        return jsonify({"response": "I can help you with details about:\n- Undergraduate & Postgraduate courses & seat intakes\n- Administrative contacts (Principal, Dean, AO)\n- Admissions counseling (APEC Code: 1401) & scholarships\n- Online fee payments & bank details (IFSC: CBIN0283083)\n- TNEA cutoff calculations\n- Placement records & training cells\n- Campus facilities (Library, Hostels, Laboratories)\n- Bus routes, driver contacts, and stop timings"})
    
    # Stem the incoming message
    stemmed_message = stem_text(message)
    
    # Compute similarity
    query_vec = vectorizer.transform([stemmed_message])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    
    best_idx = np.argmax(similarities)
    best_sim = similarities[best_idx]
    
    print(f"Query: '{message}' | Best Match Similarity: {best_sim:.4f}")
    
    # Set threshold. Since we stemmed, let's use 0.08 for direct TF-IDF matches.
    if best_sim >= 0.08:
        response_text = facts[best_idx]['text']
    else:
        # Check keyword presence for key concepts using word boundaries and stemming
        query_words = set(re.findall(r'\b\w+\b', stemmed_message.lower()))
        matched_fact = None
        
        # 1. High-priority exact keyword matches
        # If user asks about a specific route ID or stop name or driver, find the route fact
        route_id_match = re.search(r'\b(02|03|04|05|06|09|10|11|2|3|4|5|6|9)\b', message)
        if route_id_match:
            r_id = route_id_match.group(1).zfill(2) # Pad single digit
            for fact in facts:
                if f"route {r_id}" in fact['keywords'].lower():
                    matched_fact = fact
                    break
        
        if not matched_fact:
            # Check for specific bus stop names
            for stop_word in ['esur', 'arasur', 'polambakkam', 'mamandur', 'padalam', 'melavalam', 'karunguzhi', 'madhuranthagam', 'pakkam', 'sirunavalur', 'oonamalai', 'thellar', 'kodityalam', 'theyyar', 'nallur', 'eramalur', 'padur', 'veppankarunai', 'ettipattu', 'orathi', 'porankal', 'attivakkam', 'minnalchitthamur', 'thozhpedu', 'arapedu', 'acharapakkam', 'tindivanam', 'jayapuram', 'mailam', 'gingee', 'santhaimedu', 'pattanam', 'saram', 'olakkur', 'padhiri', 'ongur', 'uthiramerur', 'kavanoor', 'kammalampoondi', 'pazhathottam', 'theettalam', 'elendathur', 'kiliyanoor', 'pasunkarunai', 'madhur', 'kizhammur', 'vandavasi', 'birthur', 'kadaisikulam', 'maruthadu', 'kilkodungalore', 'salavedu', 'keezhseesamangalam', 'ramapuram', 'cheyyar', 'anakkavur', 'sugar', 'vinayagapuram', 'kolamandhai', 'purisai', 'echur', 'ammayapattu', 'marakkanam', 'murukkeri', 'kanthadu', 'vennangupattu', 'kadapakkam', 'panaiyur', 'cheyyur', 'oonambakkam', 'kattudevathur', 'chithamur']:
                if stop_word in query_words:
                    for fact in facts:
                        if stop_word in fact['keywords'].lower() and 'route' in fact['keywords'].lower():
                            matched_fact = fact
                            break
                    if matched_fact:
                        break

        if not matched_fact:
            # Check for cutoff calculator keyword
            if 'cutoff' in query_words or 'calculat' in query_words or 'formula' in query_words:
                for fact in facts:
                    if 'cutoff' in fact['keywords'].lower():
                        matched_fact = fact
                        break

        if not matched_fact:
            # Check for bank details / fee payment keyword
            if 'fee' in query_words or 'payment' in query_words or 'bank' in query_words or 'pay' in query_words or 'ifsc' in query_words or 'cbi' in query_words or 'qr' in query_words:
                for fact in facts:
                    if 'fee' in fact['keywords'].lower():
                        matched_fact = fact
                        break

        if not matched_fact:
            # High-priority concept matching fallback
            if 'principal' in query_words:
                for fact in facts:
                    if 'principal' in fact['keywords'].lower():
                        matched_fact = fact
                        break
            elif 'librari' in query_words:
                for fact in facts:
                    if 'librari' in fact['keywords'].lower():
                        matched_fact = fact
                        break
            elif 'hostel' in query_words:
                for fact in facts:
                    if 'hostel' in fact['keywords'].lower():
                        matched_fact = fact
                        break
            elif 'placement' in query_words or 'recruit' in query_words or 'mou' in query_words:
                for fact in facts:
                    if 'placement' in fact['keywords'].lower():
                        matched_fact = fact
                        break
            elif 'cours' in query_words or 'program' in query_words or 'degre' in query_words:
                for fact in facts:
                    if 'cours' in fact['keywords'].lower() and 'program' in fact['keywords'].lower():
                        matched_fact = fact
                        break
            elif 'transport' in query_words or 'bus' in query_words:
                for fact in facts:
                    if 'transport' in fact['keywords'].lower() and 'bus_routes' not in fact['keywords'].lower():
                        matched_fact = fact
                        break
            elif 'scholarship' in query_words or 'scholar' in query_words:
                for fact in facts:
                    if 'scholarship' in fact['keywords'].lower():
                        matched_fact = fact
                        break

        if not matched_fact:
            # Loop through facts for fallback keyword matching (match count >= 2)
            for fact in facts:
                fact_keywords = set(re.findall(r'\b\w+\b', stem_text(fact['keywords'])))
                match_count = sum(1 for kw in fact_keywords if kw in query_words)
                
                # Check for general matching with a requirement of 2 matching keywords
                if match_count >= 2:
                    matched_fact = fact
                    break
        
        if matched_fact:
            response_text = matched_fact['text']
        else:
            response_text = "I couldn't find this information in the current college database. Please contact the college help desk for confirmation."
        
    return jsonify({"response": response_text})

if __name__ == '__main__':
    print("APEC Local AI Model Microservice is running on port 5001...")
    app.run(port=5001, debug=False)

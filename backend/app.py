import re
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def check_url(url):
    reasons = []
    risk_score = 0
    
    # 1. URL length > 75 -> suspicious
    if len(url) > 75:
        reasons.append("URL length is greater than 75 characters")
        risk_score += 20
        
    # 2. Contains keywords (login, verify, bank, secure) -> suspicious
    keywords = ['login', 'verify', 'bank', 'secure']
    for kw in keywords:
        if kw in url.lower():
            reasons.append(f'Contains suspicious keyword "{kw}"')
            risk_score += 25
            break # Only add score once for keywords
            
    # 3. Contains IP address -> phishing
    # Matches simple IPv4 patterns
    ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
    if re.search(ip_pattern, url):
        reasons.append("Contains IP address instead of domain name")
        risk_score += 35
        
    # 4. No HTTPS -> unsafe
    if not url.lower().startswith('https://'):
        reasons.append("Does not use secure HTTPS protocol")
        risk_score += 20
        
    # 5. Too many dots (>3) -> suspicious
    # We prepend http:// if missing just to parse the domain correctly
    parsed = urlparse(url if '://' in url else 'http://' + url)
    domain = parsed.netloc
    if domain.count('.') > 3:
        reasons.append("Too many subdomains (more than 3 dots)")
        risk_score += 20
        
    risk_score = min(100, risk_score)
        
    if reasons:
        return {"status": "PHISHING", "reasons": reasons, "risk_score": risk_score}
    else:
        return {"status": "SAFE", "reasons": ["URL passed all safety checks"], "risk_score": 0}


@app.route('/api/check', methods=['POST'])
def api_check():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "No URL provided"}), 400
        
    url = data['url'].strip()
    if not url:
        return jsonify({"error": "Empty URL provided"}), 400
        
    result = check_url(url)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

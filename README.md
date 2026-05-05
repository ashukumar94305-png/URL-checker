# CYBERGUARD: Advanced Threat Intelligence 🛡️💀

CyberGuard is a high-end, immersive, cyberpunk-themed web application designed to analyze URLs and detect potential phishing threats. Built with a fully decoupled architecture, the platform pairs a robust Python/Flask REST API with a visually stunning static frontend.

![CyberGuard Demo](frontend/skull.png)

## Features
- **Heuristic Threat Detection**: Analyzes URLs for length, suspicious keywords, raw IP usage, missing HTTPS, and excessive subdomains to calculate a real-time risk score.
- **Decoupled Architecture**: The backend API and frontend UI operate entirely independently.
- **Cyberpunk Dashboard**: A full-screen CSS grid layout featuring a Matrix-rain canvas background, glassmorphism panels, and glowing neon accents.
- **Holographic A.I. Overseer**: An animated virtual assistant that types out real-time analysis logs.
- **Jumpscare Protocol**: If a severe threat is detected, the UI triggers a massive glitching skull overlay accompanied by a terrifying, custom-synthesized danger siren using the Web Audio API.

## Tech Stack
- **Backend**: Python, Flask, Flask-CORS
- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (No frameworks)

## Project Structure
```text
URL checker/
├── backend/
│   ├── app.py              # Flask REST API
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html          # Main Dashboard UI
│   ├── style.css           # Cyberpunk stylesheets
│   ├── script.js           # Matrix canvas, Web Audio API, and fetch logic
│   └── skull.png           # Threat detected jumpscare asset
└── README.md
```

## Setup & Installation

Because the application is decoupled, the frontend and backend must be run independently.

### 1. Start the Backend API
The backend requires Python and Flask to serve the `/api/check` endpoint.

```bash
cd backend
pip install -r requirements.txt
python app.py
```
*The server will start on `http://127.0.0.1:5000`.*

### 2. Launch the Frontend
The frontend is completely static and does not require a web server. 

Simply open the `frontend/index.html` file directly in your preferred web browser:
- On Mac: `open frontend/index.html`
- Or just double-click the file in your file explorer.

*Note: When you initiate a scan, the frontend will automatically communicate with your local backend API.*

## Usage
1. Enter a target URL into the acquisition scanner.
2. Click **INITIALIZE SCAN**.
3. Watch the A.I. Overseer process the heuristics and generate a risk score.
4. *Ensure your volume is up to experience the threat-detection alarm.*

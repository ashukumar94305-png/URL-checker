document.addEventListener('DOMContentLoaded', () => {
    // Canvas Matrix Rain
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    for(let x = 0; x < columns; x++) drops[x] = 1;
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(2, 5, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00f3ff';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975)
                drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 33);
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // UI Elements
    const urlInput = document.getElementById('url-input');
    const checkBtn = document.getElementById('check-btn');
    const progressContainer = document.getElementById('scan-progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    
    const loadingEl = document.getElementById('loading');
    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');
    
    const step2 = document.querySelector('.step-2');
    const step3 = document.querySelector('.step-3');
    
    const statusBadge = document.getElementById('status-badge');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const reasonsList = document.getElementById('reasons-list');
    
    const riskRadial = document.getElementById('risk-radial');
    const riskScoreVal = document.getElementById('risk-score-val');
    
    const aiMessage = document.getElementById('ai-message');
    const jumpscare = document.getElementById('jumpscare');

    // Function to generate a terrifying danger siren using Web Audio API
    const playSiren = () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        
        const now = audioCtx.currentTime;
        
        // Fast alternating siren frequency
        for (let i = 0; i < 10; i++) { 
            osc1.frequency.setValueAtTime(800, now + i * 0.15);
            osc1.frequency.setValueAtTime(1200, now + i * 0.15 + 0.075);
            
            osc2.frequency.setValueAtTime(820, now + i * 0.15); // slightly detuned for dissonance
            osc2.frequency.setValueAtTime(1220, now + i * 0.15 + 0.075);
        }
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05); // Loud danger sound
        gainNode.gain.setValueAtTime(0.5, now + 1.4);
        gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.5);
        osc2.stop(now + 1.5);
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const setAiMessage = async (msg) => {
        aiMessage.textContent = "";
        let i = 0;
        while(i < msg.length) {
            aiMessage.textContent += msg.charAt(i);
            i++;
            await sleep(30); // typing speed
        }
    };

    const animateScan = async () => {
        progressContainer.classList.remove('hidden');
        loadingEl.classList.remove('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        
        setAiMessage("Initializing scan module. Connecting to mainframe...");
        
        // Simulate progress
        for(let i=0; i<=100; i+=2) {
            progressBar.style.width = i + '%';
            progressPercent.textContent = i + '%';
            
            if(i === 30) {
                step2.classList.remove('hidden');
                setAiMessage("Running deep heuristic risk evaluation algorithms...");
            }
            if(i === 70) {
                step3.classList.remove('hidden');
                setAiMessage("Cross-referencing global threat databases...");
            }
            
            await sleep(50);
        }
    };

    const setRiskRadial = (score, isSafe) => {
        // Circumference is 251.2
        const circumference = 251.2;
        const offset = circumference - (score / 100) * circumference;
        
        riskRadial.style.strokeDashoffset = offset;
        riskScoreVal.textContent = score;
        
        if (isSafe) {
            riskRadial.style.stroke = 'var(--neon-green)';
        } else {
            riskRadial.style.stroke = 'var(--neon-red)';
        }
    };

    const checkUrl = async () => {
        const url = urlInput.value.trim();
        if (!url) return;

        errorContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');
        checkBtn.disabled = true;

        try {
            const animationPromise = animateScan();
            
            const fetchPromise = fetch('http://127.0.0.1:5000/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const [_, response] = await Promise.all([animationPromise, fetchPromise]);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'SYSTEM ERROR ENCOUNTERED');

            progressContainer.classList.add('hidden');
            loadingEl.classList.add('hidden');
            displayResult(data);

        } catch (error) {
            progressContainer.classList.add('hidden');
            loadingEl.classList.add('hidden');
            errorContainer.textContent = error.message;
            errorContainer.classList.remove('hidden');
            setAiMessage("Error encountered during analysis sequence.");
        } finally {
            checkBtn.disabled = false;
        }
    };

    const displayResult = (data) => {
        resultContainer.classList.remove('hidden');
        const isSafe = data.status === 'SAFE';
        
        if (isSafe) {
            statusBadge.className = 'status-badge status-safe';
            statusIcon.className = 'fa-solid fa-shield-halved';
            statusText.textContent = 'SECURE TARGET';
            setAiMessage(`Scan complete. Target cleared. Calculated risk score is ${data.risk_score}%.`);
        } else {
            statusBadge.className = 'status-badge status-phishing';
            statusIcon.className = 'fa-solid fa-skull';
            statusText.textContent = 'THREAT DETECTED';
            setAiMessage(`Warning! High threat detected. Multiple heuristic rules violated. Risk score is ${data.risk_score}%. Immediate block recommended.`);
            
            // Jumpscare Sequence with Siren
            playSiren();
            jumpscare.classList.remove('hidden');
            setTimeout(() => {
                jumpscare.classList.add('hidden');
            }, 1500);
        }

        setRiskRadial(data.risk_score, isSafe);

        reasonsList.innerHTML = '';
        data.reasons.forEach(reason => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-caret-right text-cyan"></i> ${reason}`;
            if (isSafe) li.style.color = 'var(--neon-green)';
            else li.style.color = '#ffb3c1';
            reasonsList.appendChild(li);
        });
    };

    checkBtn.addEventListener('click', checkUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkUrl();
    });
});

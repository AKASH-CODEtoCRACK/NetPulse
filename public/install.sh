#!/bin/bash

# ==========================================
# NetPulse Universal Installer
# ==========================================

# 1. READ ARGUMENTS (Passed from the curl command)
USER_ID=$1
API_URL=$2

if [ -z "$USER_ID" ]; then
  echo "❌ Error: User ID is missing."
  exit 1
fi

if [ -z "$API_URL" ]; then
  # Default to localhost if not provided (for testing)
#   API_URL="http://localhost:3000"
  API_URL="http://172.27.107.131:3000"

fi

echo "🟢 Starting NetPulse Installation..."
echo "👤 User ID: $USER_ID"
echo "🔗 Connecting to: $API_URL"

# 2. INSTALL NODE.JS (If missing)
if ! command -v node &> /dev/null; then
    echo "📦 Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. PREPARE DIRECTORY
INSTALL_DIR="/opt/netpulse"
sudo mkdir -p $INSTALL_DIR
sudo chown -R $USER:$USER $INSTALL_DIR
cd $INSTALL_DIR

# 4. CREATE CONFIG FILE (Dynamic Values)
# We write this separately so we can inject the variables easily
echo "📝 Writing Configuration..."
cat <<EOF > config.js
module.exports = {
    userId: "$USER_ID",
    apiUrl: "$API_URL/api/agent",
    interval: 2000,
    logFile: "/var/log/auth.log"
};
EOF

# 5. CREATE AGENT SCRIPT (Static Logic)
# We use 'EOF' (quoted) so Bash doesn't mess up the JS ${variables}
echo "📝 Writing Agent Logic..."
cat <<'EOF' > agent.js
const http = require('http');
const https = require('https');
const os = require('os');
const fs = require('fs');
const config = require('./config.js'); // Import the dynamic config

// --- GLOBAL STATE ---
let startCPU = os.cpus();
let lastNetStats = getNetworkStats();
let lastLogSize = 0;

// Initialize log size
if (fs.existsSync(config.logFile)) {
    lastLogSize = fs.statSync(config.logFile).size;
}

// --- 1. CPU LOGIC ---
function getCpuUsage() {
    const endCPU = os.cpus();
    let idleDiff = 0, totalDiff = 0;
    for (let i = 0; i < startCPU.length; i++) {
        const start = startCPU[i], end = endCPU[i];
        let startTotal = 0, endTotal = 0;
        for (const type in start.times) startTotal += start.times[type];
        for (const type in end.times) endTotal += end.times[type];
        idleDiff += (end.times.idle - start.times.idle);
        totalDiff += (endTotal - startTotal);
    }
    startCPU = endCPU;
    return totalDiff === 0 ? 0 : 100 - Math.round(100 * idleDiff / totalDiff);
}

// --- 2. NETWORK LOGIC ---
function getNetworkStats() {
    try {
        const data = fs.readFileSync('/proc/net/dev', 'utf8');
        const lines = data.split('\n');
        let rx = 0, tx = 0;
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.split(/\s+/);
            rx += parseInt(parts[1] || 0);
            tx += parseInt(parts[9] || 0);
        }
        return { rx, tx, time: Date.now() };
    } catch (e) { return { rx: 0, tx: 0, time: Date.now() }; }
}

// --- 3. SECURITY LOG LOGIC ---
function checkSecurityLogs() {
    if (!fs.existsSync(config.logFile)) return;

    fs.stat(config.logFile, (err, stats) => {
        if (err || stats.size === lastLogSize) return;

        if (stats.size < lastLogSize) lastLogSize = 0; // Log rotated

        const stream = fs.createReadStream(config.logFile, {
            start: lastLogSize,
            end: stats.size
        });

        stream.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            lines.forEach(line => {
                if (line.includes('Failed password') || line.includes('authentication failure')) {
                    const ipMatch = line.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/);
                    sendSecurityEvent("SSH_AUTH_FAIL", line, ipMatch ? ipMatch[0] : "Unknown", "critical");
                }
            });
        });
        lastLogSize = stats.size;
    });
}

function sendSecurityEvent(type, message, ip, severity) {
    const payload = JSON.stringify({ clerkId: config.userId, type, message, sourceIp: ip, severity });
    const lib = config.apiUrl.startsWith('https') ? https : http;
    const req = lib.request(`${config.apiUrl}/security`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }
    }, () => {});
    req.on('error', () => {});
    req.write(payload);
    req.end();
}

// --- MAIN LOOP ---
function run() {
    const cpu = getCpuUsage();
    const mem = 100 - Math.round(100 * os.freemem() / os.totalmem());
    
    const curNet = getNetworkStats();
    const timeDiff = (curNet.time - lastNetStats.time) / 1000;
    const netIn = timeDiff > 0 ? ((curNet.rx - lastNetStats.rx) / 1024 / timeDiff) : 0;
    const netOut = timeDiff > 0 ? ((curNet.tx - lastNetStats.tx) / 1024 / timeDiff) : 0;
    lastNetStats = curNet;

    const payload = JSON.stringify({
        clerkId: config.userId,
        cpu, ram: mem, disk: 0,
        networkIn: Math.round(netIn),
        networkOut: Math.round(netOut)
    });

    const lib = config.apiUrl.startsWith('https') ? https : http;
    const req = lib.request(`${config.apiUrl}/ingest`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }
    }, (res) => {
        if(res.statusCode === 200) console.log("✅ Data sent");
    });
    req.on('error', (e) => console.error("❌ Connection Error:", e.message));
    req.write(payload);
    req.end();

    checkSecurityLogs();
}

console.log("🚀 Agent Running...");
setInterval(run, config.interval);
EOF

# 6. CREATE SYSTEMD SERVICE (Auto-Start)
echo "⚙️ Creating Background Service..."
NODE_PATH=$(which node)
sudo cat <<EOF > /etc/systemd/system/netpulse.service
[Unit]
Description=NetPulse Monitoring Agent
After=network.target

[Service]
ExecStart=$NODE_PATH $INSTALL_DIR/agent.js
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 7. START SERVICE
sudo systemctl daemon-reload
sudo systemctl enable netpulse
sudo systemctl restart netpulse

echo "✅ INSTALLATION COMPLETE!"
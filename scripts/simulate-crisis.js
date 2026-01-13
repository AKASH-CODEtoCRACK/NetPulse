// Run this script to simulate a server crash
// Usage: node scripts/simulate-crisis.js

const fetch = require('node-fetch'); // You might need: npm install node-fetch

// REPLACE THIS WITH YOUR REAL CLERK ID (From your Database)
// const YOUR_CLERK_ID = "user_38439tlGZXgX7YVlWjGOCRmJxeR"; 
// const YOUR_CLERK_ID = "user_386YE9p9OTWPHTIGaaWrddD4dlR"; 
const YOUR_CLERK_ID = "user_387ooIjEeCLTAgc5bBnzUCnGrRA"; 

const API_URL = "http://localhost:3000/api/agent/ingest";

async function simulateCrash() {
    console.log("🔥 Simulating CRITICAL CPU SPIKE (99%)...");

    const payload = {
        clerkId: YOUR_CLERK_ID,
        cpu: 95,    // <--- TRIGGER VALUE
        ram: 52,
        disk: 35
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        console.log("Server Response:", data);
        console.log("✅ Check your Telegram now!");
        
    } catch (error) {
        console.error("Failed to connect to API:", error);
    }
}

simulateCrash();
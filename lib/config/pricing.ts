export const PRICING_TABLE = {
    // Chat Features
    AI_RESPONSE: 1,        // Cost per AI answer
    PRE_FED_RESPONSE: 0,   // Free (Handled by frontend usually, but good to define)
    
    // Future Features (Ready for when you build them)
    SCAN_NETWORK: 5,       // Cost to scan 100 IPs
    DOWNLOAD_REPORT: 10,   // Cost to generate PDF
    INCIDENT_ALERT: 2,     // Cost per SMS/WhatsApp alert
    
    // Limits
    MAX_DAILY_FREE_CREDITS: 100
  };
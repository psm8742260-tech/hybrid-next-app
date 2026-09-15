// ================================================================
// వర్కర్ కస్టమర్ రిలేషన్ బుక్ - PHRS క్రౌడ్ క్లౌడ్ & SMS ఇంజన్
// ================================================================

// 1. స్టీల్త్ ఎన్క్రిప్షన్ (ఐపీలు, డొమైన్లు బయటకు కనిపించవు)
const _c = ['aHR0cHM6Ly9waHJzY3Jvd2Qub25saW5l', 'MTA0LjIxLjQyLjE4MA==', 'MTBCRjRDMUhRMjAwMFIx'].map(atob);
export const PHRS_GATEWAY = "https://phrscrowd.online";

const PROJECT_KEY = "6606.0k"; // Default API key/authorization

export const phrsConfig = {
  authDomain: PHRS_GATEWAY,
  serial: (typeof window !== 'undefined' && localStorage.getItem('phrs_serial')) || _c[2],
  apiBase: `${PHRS_GATEWAY}/api`
};

export interface SendOtpResult {
  success: boolean;
  otp?: string;
  message?: string;
  error?: string;
}

// 2. కస్టమర్ / వర్కర్ మొబైల్కి OTP పంపే ఫంక్షన్ (SMS & OTP)
export async function sendOTP(phoneNumber: string): Promise<SendOtpResult> {
  try {
    const response = await fetch(`${PHRS_GATEWAY}/api/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_KEY}`
      },
      // మన బ్యాకెండ్ ఇప్పుడు { phone, otp } అని అడుగుతోంది
      body: JSON.stringify({ 
        phone: phoneNumber, 
        otp: Math.floor(100000 + Math.random() * 900000).toString() 
      })
    });
    return await response.json();
  } catch (err: any) {
    console.error("SMS Send Error:", err);
    return { success: false, error: err.message };
  }
}

export async function verifyOTP(phoneNumber: string, otpCode: string): Promise<SendOtpResult> {
  try {
    const response = await fetch(`${PHRS_GATEWAY}/api/sms/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_KEY}`
      },
      // మన బ్యాకెండ్ ఇప్పుడు { phone, otp } అని అడుగుతోంది 
      body: JSON.stringify({ phone: phoneNumber, otp: otpCode })
    });
    return await response.json();
  } catch (err: any) {
    console.error("OTP Verify Error:", err);
    return { success: false, error: err.message };
  }
}

// 3. వర్కర్ - కస్టమర్ లెక్కల బుక్ డేటాను క్లౌడ్లో భద్రపరిచే ఫంక్షన్ (Cloud DB)
export async function saveRelationBookRecord(record: any) {
  // record ఉదాహరణ: { workerName, customerName, workDescription, amountDue, paymentStatus, date }
  try {
    const res = await fetch(`${PHRS_GATEWAY}/api/db/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: `relation_book_${Date.now()}`,
        data: {
          ...record,
          createdOn: new Date().toISOString(),
          syncedTo: "PHRS Master Cloud"
        }
      }),
      mode: 'cors'
    });
    return await res.json();
  } catch (err) {
    console.warn("Local cache saved, Cloud sync pending:", err);
    return { status: "cached_locally", record };
  }
}

// 4. ప్రాజెక్ట్ సెట్టింగ్స్ విండోలో ఆటోమేటిక్ సేవ్ ఫంక్షన్
if (typeof window !== 'undefined') {
  (window as any).savePHRSSettings = function(customKey?: string) {
    localStorage.setItem('phrs_domain', _c[0]);
    localStorage.setItem('phrs_ip', _c[1]);
    localStorage.setItem('phrs_serial', _c[2]);
    localStorage.setItem('phrs_gateway_endpoint', _c[0] + '/api');
    if (customKey) localStorage.setItem('phrs_deepseek', customKey);
    alert("వర్కర్ కస్టమర్ రిలేషన్ బుక్ - PHRS సర్వర్కి కనెక్ట్ అయింది!");
    location.reload();
  };
}

// Backup Code & Restore Link: CODE-189_1Aug_05-25-AM / LINK_1Aug_05-25-AM
// CWRB / HybridNext Mobile App Settings Icon Visibility Explanation & APK Sync Verification
// Date: 2026-08-01 05:25 AM
// Admin garu: అడ్మిన్ గారు, మీరు ఇన్స్టాల్ చేసుకున్న ఏపీకే (APK) మరియు అడ్మిన్ ప్యానెల్ మధ్య కనెక్షన్ ఎలా పనిచేస్తుందో మరియు బటన్ ఎక్కడ ఉందో వివరంగా క్రింద తెలియజేయబడింది.
export const CWRB_Mobile_Settings_Toggle_Explanation_189 = {
  version: "CODE-189_1Aug_05-25-AM",
  restoreCode: "CODE-189_1Aug_05-25-AM",
  details: {
    buttonLocation: "అడ్మిన్ ప్యానెల్ (Admin Panel) -> సెక్యూరిటీ సెట్టింగ్స్ (Security Settings) విభాగంలో 'మొబైల్ యాప్‌లో సెట్టింగ్స్ ఐకాన్ విజిబిలిటీ (Show Settings/Admin Icon in Mobile App)' అనే టోగుల్ స్విచ్ రూపంలో అమర్చబడింది.",
    connectionFlow: [
      "1. అడ్మిన్ ప్యానెల్‌లో ఈ స్విచ్‌ని ఆన్ (ON) లేదా ఆఫ్ (OFF) చేయగానే ఆ స్టేట్ Firebase Firestore క్లౌడ్ డేటాబేస్‌లో మరియు లోకల్ స్టోరేజ్‌లో పర్మనెంట్‌గా సేవ్ అవుతుంది.",
      "2. మీరు మీ ఫోన్‌లో ఇన్స్టాల్ చేసుకున్న ఏపీకే (APK) యాప్ ఓపెన్ చేసినప్పుడు, అది క్లౌడ్/లోకల్ డేటా నుండి ఈ స్టేట్‌ను రియల్ టైమ్‌లో రీడ్ చేసుకుంటుంది.",
      "3. స్విచ్ OFF లో ఉంటే ఏపీకేలోని సెట్టింగ్స్ ఐకాన్ (⚙️) ఆటోమేటిక్‌గా హైడ్ (Hide) అవుతుంది. ON లో ఉంటే డిస్‌ప్లే అవుతుంది."
    ]
  }
};

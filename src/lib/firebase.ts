import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiP_Em5lLTBIDnlUgYfqsIE28FknqVRd8",
  authDomain: "dauntless-appliance-1pxzt.firebaseapp.com",
  projectId: "dauntless-appliance-1pxzt",
  storageBucket: "dauntless-appliance-1pxzt.firebasestorage.app",
  messagingSenderId: "401635921059",
  appId: "1:401635921059:web:baab34425fec03f29a4316"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { RecaptchaVerifier };

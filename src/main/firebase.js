import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';   
const firebaseConfig = {
  apiKey: "AIzaSyAMSF7OMSc9pPkSaRxZUAuyMG9Co-_qMVU",
  authDomain: "tadm-6c2ed.firebaseapp.com",
  projectId: "tadm-6c2ed",
  storageBucket: "tadm-6c2ed.firebasestorage.app",
  messagingSenderId: "974967143379",
  appId: "1:974967143379:web:5bd953be6013c3daa38d26"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); 
export { db }

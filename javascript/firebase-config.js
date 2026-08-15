import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBIbB5-pB5xlXz_pOLRv2Sjev45UScVBBJo",
    authDomain: "steph-collections.firebaseapp.com",
    projectId: "steph-collections",
    storageBucket: "steph-collections.firebasestorage.app",
    messagingSenderId: "868957536872",
    appId: "1:868957536872:web:65ac99115e652cb7c6b1dd"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
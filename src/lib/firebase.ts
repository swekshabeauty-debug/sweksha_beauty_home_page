import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAqGEAXpQ9xa6nxPg_wZud_sZ-eIjhnDc8",
    authDomain: "sweksha-beauty-993b2.firebaseapp.com",
    projectId: "sweksha-beauty-993b2",
    storageBucket: "sweksha-beauty-993b2.firebasestorage.app",
    messagingSenderId: "700157745460",
    appId: "1:700157745460:web:df83d4a645872b48aaad61",
    measurementId: "G-65HEVYRL0S"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

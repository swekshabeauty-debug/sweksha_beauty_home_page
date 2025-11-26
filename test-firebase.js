const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAqGEAXpQ9xa6nxPg_wZud_sZ-eIjhnDc8",
    authDomain: "sweksha-beauty-993b2.firebaseapp.com",
    projectId: "sweksha-beauty-993b2",
    storageBucket: "sweksha-beauty-993b2.firebasestorage.app",
    messagingSenderId: "700157745460",
    appId: "1:700157745460:web:df83d4a645872b48aaad61",
    measurementId: "G-65HEVYRL0S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
    console.log('Testing connection...');
    try {
        const docRef = doc(db, 'test', 'connection');
        const docSnap = await getDoc(docRef);
        console.log('Connection successful!');
    } catch (error) {
        console.error('Connection failed:', error.code, error.message);
    }
    process.exit(0);
}

testConnection();

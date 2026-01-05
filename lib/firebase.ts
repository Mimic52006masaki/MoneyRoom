import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDcT3cRv9DI4ehnoC2wFTSYNITDfXk4Gw0",
  authDomain: "moneyroom-e5dd0.firebaseapp.com",
  projectId: "moneyroom-e5dd0",
  storageBucket: "moneyroom-e5dd0.firebasestorage.app",
  messagingSenderId: "1009141662216",
  appId: "1:1009141662216:web:1c8978c96e27c51be807bd"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
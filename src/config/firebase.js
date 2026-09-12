import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_VORTEX_KEY,
    authDomain: import.meta.env.VITE_VORTEX_DOMAIN,
    projectId: import.meta.env.VITE_VORTEX_PROJECT,
    storageBucket: import.meta.env.VITE_VORTEX_STORAGE,
    messagingSenderId: import.meta.env.VITE_VORTEX_SENDER,
    appId: import.meta.env.VITE_VORTEX_APP,
    measurementId: import.meta.env.VITE_VORTEX_MEASUREMENT,
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
const firebaseConfig = {
  apiKey: "AIzaSyCzMKISRq4eXlb-DrLGFG4vigz3_ly_3W4",

  authDomain: "raise-data-dbbc0.firebaseapp.com",

  projectId: "raise-data-dbbc0",

  storageBucket: "raise-data-dbbc0.firebasestorage.app",

  messagingSenderId: "520374554679",

  appId: "1:520374554679:web:1970cf1883668cd3f96fb2",

  measurementId: "G-J80RHK7DR5"

};


export const fb_app = initializeApp(firebaseConfig);
export const fb_db = getFirestore(fb_app);

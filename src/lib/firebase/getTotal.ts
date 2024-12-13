'use server'

import { doc, getDoc } from "firebase/firestore";
import { fb_db } from "../firebase_config";


export const getTotalLocked = async() => {
    try {
        const docRef = doc(fb_db, "stats", 'totalAmount'); 
        const docSnap = await getDoc(docRef);
        
    
        if (docSnap.exists()) {
          
            const _total_doc =await docSnap.data();
            console.log("Document data:", );
          
            return _total_doc?.value || 0
        }else{
            return 0
        }
    } catch (error) {
        return 0
    }
}
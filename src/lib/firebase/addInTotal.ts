'use server'

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getTotalLocked } from "./getTotal";
import { fb_db } from "../firebase_config";

export const addInTotal = async (value:number)=>{
    const _totalValue = await getTotalLocked()
  console.log({_totalValue})
    const docTL = doc(fb_db, "stats", "totalAmount");
    const docSnapTL = await getDoc(docTL);
    if (docSnapTL.exists()) {

      await updateDoc(docTL, {
          value: (_totalValue+value), 
          updatedAt: new Date() 
      });
    
  }
  
}
import { fb_db } from "@/lib/firebase_config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse  } from "next/server";
// import { unstable_after as after } from 'next/server'


export async function GET(req: NextRequest) {
 try {

   const {   pathname } = req.nextUrl;
  

   const address = pathname.split("/").pop(); 
    
   
   const transactionsRef = collection(fb_db, "transactions");
   const q = query(
    transactionsRef,
     where("address", "==", String(address).toLowerCase()),
    ); 
 
   const querySnapshot = await getDocs(q);
   const transactions:any[] = [];
 
   querySnapshot.forEach((doc) => {
       transactions.push({ id: doc.id, ...doc.data() });
   });
  
   
   return NextResponse.json({data: transactions},{status:200});
 } catch (error) {
  return NextResponse.json({data: null,error},{status:500});
 }
}

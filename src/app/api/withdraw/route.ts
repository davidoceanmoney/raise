import { thirdwebAuth } from "@/lib/auth";
import { fb_db } from "@/lib/firebase_config";
import {  updateSheetValue } from "@/lib/sheet";
import { decryptData } from "@/utils/encryption";
import { formatDate } from "@/utils/formatTime";
import { getStatus } from "@/utils/getStatus";
import { 
  doc,
  getDoc, 
  setDoc,
  updateDoc, 
} from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse , unstable_after as after} from "next/server";

export async function POST(req: NextRequest) {
  try {
    const jwt = cookies().get("jwt");
    if (!jwt?.value) {
      return NextResponse.json(
        { data: null, error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt?.value });
    if (!authResult.valid) {
      return NextResponse.json(
        { data: null, error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ip = xForwardedFor
      ? xForwardedFor.split(",")[0]
      : req.ip || "IP not found"; 

    const { payload }: any = await req.json();
    console.log({ payload });

    const _stake = decryptData({ jti: authResult.parsedJWT.jti, payload });
    const _stakeData = JSON.parse(_stake);
    console.log({ _stakeData });

    const docRef = doc(fb_db, "transactions", _stakeData);
    const docSnap = await getDoc(docRef);
   
    if (docSnap.exists()) { 
      const _data = docSnap.data()
      const _sts = getStatus(_data.createdAt)
      if(_sts === 'Locked'){
        return NextResponse.json({data:'Locked'},{status:403})
      }


      await updateDoc(docRef, {
        withdraw: true,   
        updatedAt: new Date(),   
      });

      console.log({_data})
       
      const docRefWd = doc(fb_db, "withdraw", _stakeData);
      await setDoc(docRefWd, { 
        createdAt: new Date(), 
        ip: ip,
        trxTime:_data.createdAt ,
        address: _data.address,
        refHash: _data.trxHash,
        amount:_data.amount,
        status:'',
        withdrawalHash: '',
        comments:''

      });
      after(()=>{
        updateSheetValue({
          findBy:_stakeData ,
          value:true,
          trxTime: formatDate(_data.createdAt),
          address: _data.address,
          amount: _data.amount,
          refHash: _data.trxHash
        })
        
      })
      return NextResponse.json(
        { data: "Successfully Staked", error: null },
        { status: 201 }
      );
    }
   
    return NextResponse.json(
      { data: "Transaction not found", error: null },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { data: null, error: "Internal Error!" },
      { status: 500 }
    );
  }
}
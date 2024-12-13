import { thirdwebAuth } from "@/lib/auth";
import { addInTotal } from "@/lib/firebase/addInTotal"; 
import { fb_db } from "@/lib/firebase_config";
// import { addInTransaction } from "@/lib/sheet";
import { decryptData } from "@/utils/encryption";
import { 
  doc,
  getDoc, 
  setDoc, 
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
    const docRef = doc(fb_db, "transactions", _stakeData.trxHash);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, { ..._stakeData, createdAt: new Date(), ip: ip });
    }

    await addInTotal(_stakeData.amount);
    
    // trxHash: transactionHash,
    // address: String(_confirmation?.from).toLowerCase(),
    // receiver: String(_confirmation?.to).toLowerCase(),
    // withdraw: false,
    // status: _confirmation?.status,
    // token: "POL_USDT",
    // amount: 

    // after(()=>{
    //   addInTransaction({
    //     address: _stakeData.address,
    //     amount: _stakeData.amount,
    //     trxHash: _stakeData.trxHash,
    //     token: _stakeData.token,
    //     receiver: _stakeData.receiver,
    //     ip: ip,
    //     withdraw: _stakeData.withdraw,
    //     status: _stakeData.status,
    //   })
    // })
    return NextResponse.json(
      { data: "Successfully Staked", error: null },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { data: null, error: "Internal Error!" },
      { status: 500 }
    );
  }
}
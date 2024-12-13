'use client'

import { useEffect, useState } from "react";

import TopNavbar from "../../components/TopNavBar";
import { useActiveAccount } from "thirdweb/react";
import NoWallet from "@/components/NoWallet";
import UserDeposit from "@/components/UserDeposit";

 


const MyFunds = () => {
  //   const [myfunds, setmyfunds] = useState([]);
  // let session = useSession();
    const account = useActiveAccount();

  //   useEffect(() => {
  //     if (session.data) {
  //       console.log("auth:", session);
  //     }
  //   }, [session]);

  if (account) {
    // console.log(session);
    return (
      <>
        <TopNavbar />
        <UserDeposit />
      </>
    );
  } else {
    return (
      <>
        <TopNavbar />
        <NoWallet />
      </>
    );
  }
};

export default MyFunds;

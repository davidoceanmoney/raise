"use client";
 
import { generatePayload, getLoggedUser, isLoggedIn, login, logout } from "@/lib/auth_funcs";
import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import { signLoginPayload } from "thirdweb/auth";
import { polygon } from "thirdweb/chains";
import { ConnectButton, useActiveAccount, useActiveWallet, useActiveWalletChain } from "thirdweb/react"; 
import { createWallet } from "thirdweb/wallets"; 

const WalletConnect = () => {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const chan = useActiveWalletChain()
  const [isLogged, setIsLogged] = useState(false)
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];


  const loginUser = async () =>  {
    if(!account)return;
    const payload = await generatePayload({ address:account?.address,chainId:137 })
    console.log({payload})
    const signature = await signLoginPayload({payload:payload,account:account})
     
  
    login(signature )
  }

  useEffect(()=>{
    if(!account?.address)return;

    getLoggedUser().then((user)=>{
      
      if(String(user?.sub).toLowerCase() != String(user?.sub).toLowerCase()){
        if(user){
          setIsLogged(true)
        }else{
          setIsLogged(false)
        }
        logout().then(()=>{
          setTimeout(() => {
            loginUser();
          }, 3000); 
        })
      }
    });
    // if(chan?.id != 137){
    //   wallet?.switchChain(polygon)
    // }
  },[account?.address,chan])


  return (
   <>
    
    <ConnectButton
      client={client}
      wallets={wallets}
      auth={{
        isLoggedIn: async () => {
          return await isLoggedIn();
        },
        doLogin: async (params) => {
          
          await login(params);
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => { 
          await logout();
        },
      }}
    />
    
    </>
  );
};

export default WalletConnect;

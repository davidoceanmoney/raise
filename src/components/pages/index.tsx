"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";



import TopNavbar from "../TopNavBar";


import Button from "../Button";

import { useActiveAccount, useActiveWallet, useActiveWalletChain } from "thirdweb/react";
import { formatUnits, parseUnits } from "ethers";
import { prepareContractCall, sendTransaction } from "thirdweb";
import {  receiverWallet, rpc_url, TChainIds, thirdwebContract, TTokenType } from "@/lib/contract";
import { JsonRpcProvider } from "ethers";
import { getLoggedUser } from "@/lib/auth_funcs";
import { encryptData } from "@/utils/encryption";
import { Interface } from "ethers";
import { ABI_ERC20 } from "@/utils/abi/ERC20";
import { RefreshCcw } from "lucide-react";
import { getTotalLocked } from "@/lib/firebase/getTotal";
import TransactionTable from "../Transactions";
import { arbitrum, bsc, ethereum, polygon } from "thirdweb/chains";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import CountDown from "../CountDown";

type TStake = {
  trxHash?: string;
  address?: string;
  receiver?: string;
  withdraw?: boolean;
  status?: any;
  token?: string;
  amount?: number;
  createdAt?: Date;
  ip?: string;
};

const minAmount = 1;
const HomePage = () => {
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [passwordInput, setPasswordInput] = useState("");
  const [amount, setAmount] = useState(minAmount);
  // const [loading, setLoading] = useState(false);
  // const [loadingUSDC, setLoadingUSDC] = useState(false);
  const chain = useActiveWalletChain();
  const account = useActiveAccount();
  const [error, setError] = useState("");
  const [trxData, setTrxData] = useState([]);
  const [isLoading, setIsLoading] = useState({
    busd:false,
    usdc:false,
    usdt:false
  })
  // const [isWhitelisted, setWhitelist] = useState(false);
  const provider = new JsonRpcProvider(rpc_url[chain?.id ? chain.id : 137]);
  const [status, setStatus] = useState({ isError: false, msg: "" });
  const wallet = useActiveWallet();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  function uploadLoading(token: TTokenType, value: boolean) {
    setIsLoading((prev) => ({
      ...prev,
      [token]: value, 
    }));
  }

  function isCurrentNetwork(){
    if(!account?.address)return false;
    if(chain?.id != 137){
      wallet?.switchChain(polygon)
      return false;
    }else{
      return true;
    }
  }
  const browserTabcloseHandler = (e: any) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const preventEscap = async (escap: any) => {
    if (escap) {
      //   router.beforePopState(() => {
      //     const result = window.confirm("Transaction is in progress....");
      //     return result;
      //   });
      //   window.onbeforeunload = browserTabcloseHandler;
      //   router.beforePopState(() => {
      //     return true;
      //   });
      // } else {
      //   router.beforePopState(() => {
      //     return null;
      //   });
      //   window.onbeforeunload = null;
      //   router.beforePopState(() => {
      //     return false;
      //   });
    }
  };
 
  
  const updateError = (msg: string, isError = true) => {
    setStatus({
      msg: msg,
      isError,
    });
    setTimeout(() => {
      setStatus({ isError: false, msg: "" });
    }, 10000);
  };
  async function waitForTransaction(txHash: string) {
    let receipt = null;

    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(txHash);
        let _from, _to, _amount, _status;

        if (receipt !== null) {
          _status = receipt.status;
          const _rcpt = await receipt.confirmations();
          const iface = new Interface(ABI_ERC20);
          receipt.logs.forEach((log) => {
            const parsedLog = iface.parseLog(log);
            if (parsedLog?.name === "Transfer") {
              const { from, to, value } = parsedLog.args;
              _from = from;
              _to = to;
              _amount = value;
              
              // const amount = formatUnits(value, 6); 
            }
          }); 
        //   setLoading(false);
          return {
            from: _from,
            to: _to,
            amount: _amount,
            status: _status,
          };
        }
      } catch (error) {
        console.error("Error fetching transaction receipt:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  async function addStaking({
    jti,
    payloadData,
  }: {
    jti: string;
    payloadData: TStake;
  }) {
    const payload = encryptData({ jti, payload: payloadData });

    const _addStaking = await fetch("/api/stake", {
      method: "POST",
      body: JSON.stringify({ payload }),
    });
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // Save password to session storage to keep the user logged in
      sessionStorage.setItem("pagePassword", passwordInput);
      // setIsAuthenticated(true);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  async function getTotalDeposit() { 
    const _totalValue = await getTotalLocked();
    setTotalDeposits(_totalValue);
    // }
  }

   
   



  const stakeERC20 = async ( token:TTokenType) => { 
    if (!account) { 
      updateError("Error: Wallet is not connected");
      return;
    }
    if(!chain?.id){
      updateError("Error: Wallet is not connected");
      return;
    }
    if (![1,56,137,42161,11155111].includes(chain?.id)) { 
      updateError("Error: Please select the allowed network");
      return;
    }
    const _userAddress = await getLoggedUser();
    if (!_userAddress) {
      updateError("Error: User is not signed in");
      return;
    }
    if (amount < minAmount) {
      updateError(`Error: Minimum ${minAmount} amount is allowed`);
      return;
    }

   
    
 
    uploadLoading(token, true);
    try {
      // const _isWhitelisted = await isWhitelisted()
      // if (!_isWhitelisted) {
      //   setLoadingUSDC(false);
      //   updateError("Error: Your address currently not whitelisted");
      //   return;
      // }
      let _amount = parseUnits(String(amount), 6) as any;
      if(chain?.id === 56){
        _amount = parseUnits(String(amount), 18) as any;
      }
      console.log({_amount,token})
      const transaction = await prepareContractCall({
        contract: thirdwebContract(chain?.id as TChainIds,token ),
        method: "transfer" as any,
        params: [receiverWallet, _amount],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      const _confirmation = await waitForTransaction(transactionHash);
      // const _confirmedAmoutn = chain.id == 56 ? formatUnits(_confirmation?.amount || '0', 6) : 
      const _confirmedAmount = formatUnits(_confirmation?.amount || '0', chain.id == 56  ? 18 : 6) 
      await addStaking({
        jti: _userAddress.jti,
        payloadData: {
          trxHash: transactionHash,
          address: String(_confirmation?.from).toLowerCase(),
          receiver: String(_confirmation?.to).toLowerCase(),
          withdraw: false,
          status: _confirmation?.status,
          token: `${chain?.nativeCurrency?.symbol?.toLowerCase()}_${token}`,
          amount: parseFloat(_confirmedAmount),
        },
      });
      // getTotalDeposit();
      // getUserTransaction(account.address);
      uploadLoading(token,false);
      updateError(`Success: ${_confirmedAmount} ${token.toUpperCase()} staked`, false);
 
    } catch (error: any) { 
      if(error?.message){
        console.log({error})
        updateError(`${String(error?.message).split('contract')[0]} `);
      }else{
        updateError(`Error: ${"Something went wrong!"} `);
      }
      uploadLoading(token,false);
      //   }
      console.log({ error });
    }
  };


  function decrement() { 
    const newVal = amount - 10;
    if (newVal >= minAmount) {
      setAmount(newVal);
    } else {
      setAmount(minAmount);
    }
  }

  function increment() { 
    setAmount(amount + 10);
  }

  function currencyFormat(num: any) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Number(parseFloat(num).toFixed(0)));
  }
  const handleInputChange = async (e: any) => {
    e.preventDefault();
    setAmount(parseFloat(e.target.value));
  };

  useEffect(() => {
    getTotalDeposit();
  }, []);
 

 

  return (
    <>
      <TopNavbar />
      
      <div className="    ">
        <div className="max-w-md  mx-auto">
          <div className=" flex justify-center w-full ">
            <div className=" pt-5">
              <p className="uppercase text-gold-200 flex justify-center font-400 text-12 text-gray-100">
                TOTAL VALUE RAISED
              </p>
              <p className="flex justify-center  font-800 text-4xl text-gray-100 pt-3">
                {isNaN(totalDeposits) ? 0 : currencyFormat(totalDeposits)}
              </p>
              {/* <CountDown/> */}
              <p className="flex justify-center  font-400 text-12 text-white pt-8">
                AMOUNT
              </p>
              <div className="flex justify-between items-center mx-auto max-w-sm pt-3">
                <button
                  className="text-gold-200 py-4 px-5 rounded-l-md bg-[#212020] "
                  onClick={decrement}
                >
                  <span className="">-</span>
                </button>
                <p className=" bg-gray-800 text-gray-600   w-full text-center">
                  <label className="col-span-2 py-2  flex items-center bg-gray-800/30">
                    <span className="text-gold-200 w-10 h-10 text-center border-r border-gold-200/50 flex items-center justify-center flex-shrink-0">
                      $
                    </span>
                    <input
                      className="bg-transparent w-full h-full text-white focus:outline-none ring-0 pl-3"
                      placeholder={"1000"}
                      value={amount}
                      type="number"
                      min={minAmount}
                      onChange={handleInputChange}
                      name="custom-input-number"
                    ></input>
                  </label>
                </p>
                <button
                  className="text-gold-200 py-4 px-5 rounded-r-md bg-[#212020] "
                  onClick={increment}
                >
                  <span>+</span>
                </button>
              </div>

              <div className=" flex justify-center items-center pt-3 "></div>
              
             <div className="w-full flex justify-center mt-3">
             <Select  value={chain?.name ? chain?.nativeCurrency?.symbol?.toLowerCase() : ''} onValueChange={(val)=>{
              // if(chain?.id != 137){
              //   wallet?.switchChain(polygon)
              //   return false;
              // }
              if(val === 'eth'){
                wallet?.switchChain(ethereum)
              }else if(val === 'bnb'){
                wallet?.switchChain(bsc)
              }else if(val === 'arb'){
                wallet?.switchChain(arbitrum)
              }else if(val === 'pol'){
                wallet?.switchChain(polygon)
              }
             }} >
      <SelectTrigger  className="text-white border-none bg-white/10 max-w-sm h-12 rounded-lg">
        <SelectValue placeholder="Select Network" />
      </SelectTrigger>
      <SelectContent className="bg-black text-white border-none">
        <SelectGroup className="">
          <SelectLabel>{chain?.name ? chain.name : 'Select Network'}</SelectLabel>
          <SelectItem value='eth'>Ethereum</SelectItem>
          <SelectItem value="bnb">Binance</SelectItem>
          <SelectItem value="arb">Arbitrum</SelectItem>
          <SelectItem value="pol">Polygon</SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
             </div>
              <div className=" px-2 mx-auto max-w-sm">
                <p
                  className={`h-4 flex items-center leading-3 ${
                    status.isError ? "text-red-100" : "text-green-100"
                  } text-[14px]`}
                >
                  {status.msg} 
                </p>
              </div>
              
              {chain?.id == 56 ? <div className=" flex justify-center items-center mx-auto max-w-sm pt-3">
                <Button
                  disabled={isLoading.busd}
                  type="busd"
                  onClick={()=> stakeERC20('busd')}
                  className="py-4 px-4 relative  w-full  "
                >
                  <span>STAKE BUSD</span>
                  {isLoading.busd ? (
                    <RefreshCcw className="animate-spin text-white absolute right-5 top-3.5" />
                  ) : null}
                </Button>
              </div> : null}
              <div className=" flex justify-center items-center mx-auto max-w-sm pt-3">
                <Button
                  disabled={isLoading.usdt}
                  type="solid"
                  onClick={()=> stakeERC20('usdt')}
                  className="py-4 px-4 relative  w-full  "
                >
                  <span>STAKE USDT</span>
                  {isLoading.usdt ? (
                    <RefreshCcw className="animate-spin text-white absolute right-5 top-3.5" />
                  ) : null}
                </Button>
              </div>

              <div className=" flex justify-center items-center mx-auto max-w-sm pt-3">
                <Button
                  disabled={isLoading.usdc}
                  type="solid"
                  onClick={()=> stakeERC20('usdc')}
                  className="py-4 px-4 relative  w-full bg-[#212020] text-gold-200 "
                >
                  <span>STAKE USDC</span>
                  {isLoading.usdc ? (
                    <RefreshCcw className="animate-spin text-white absolute right-5 top-3.5" />
                  ) : null}
                </Button>
              </div>

              {/* <div className="mt-5">
              <TransactionTable trxData={trxData} getLatestTrx={getLatestTrx} />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

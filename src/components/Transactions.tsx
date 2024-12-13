"use client";
import React, { useState } from "react";
import { Copy, RefreshCcw } from "lucide-react";
import { getLoggedUser } from "@/lib/auth_funcs";
import { encryptData } from "@/utils/encryption";
import { formatDate, getRemainingDays } from "@/utils/formatTime";
import { getStatus } from "@/utils/getStatus";

 

const TransactionTable = ({ trxData, getLatestTrx }: { trxData: any,getLatestTrx:()=>void }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [status, setStatus] = useState({ isError: false, msg: "" });
  const [loading, setLoading] = useState<any>({})
 

  const updateError = (msg: string, isError = true) => {
    setStatus({
      msg: msg,
      isError,
    });
    setTimeout(() => {
      setStatus({ isError: false, msg: "" });
    }, 10000);
  };

 

  const truncateHash = (hash: string): string => {
    return `${hash.slice(0, 5)}...${hash.slice(-3)}`;
  };

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    });
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
       <div className=" px-2 mx-auto max-w-sm">
                <p
                  className={`h-8 flex items-center ${
                    status.isError ? "text-red-100" : "text-green-100"
                  } text-[14px]`}
                >
                  {status.msg} 
                </p>
              </div>
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Hash
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {trxData.map((item: any, index: any) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center">
                {truncateHash(item.trxHash)}
                <button
                  onClick={() => copyToClipboard(item.trxHash)}
                  className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                >
                  <Copy size={16} />
                </button>
                {copiedHash === item.trxHash && (
                  <span className="ml-2 text-xs text-green-400">Copied!</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {item.amount}
              </td>
              <td
               
                className="px-6 py-4 whitespace-nowrap text-sm"
              >
                {formatDate(item.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex gap-x-4">
              {item?.withdraw ? 
               <div>
               Withdrawal {getRemainingDays(item.updatedAt)}
               </div>
               :
               <button
               disabled={loading[index]}
               onClick={async()=>{
                if(getStatus(item.createdAt) === "Locked"){
                  updateError("Withdrawal locked for 90 days")
                  return;
                }
                if(loading[index]){
                  return;
                }
                try {
                  setLoading((prev:any)=>({...prev,[index]:true}))
                  const _userAddress = await getLoggedUser();
                  if (!_userAddress) {
                    updateError("Error: User is not signed in");
                    return;
                  }
 
                  const payload = encryptData({ jti:_userAddress.jti, payload: item.trxHash });
                  console.log({payload})
 
                 const _response = await  fetch('/api/withdraw',{
                    method:'POST',
                    body:JSON.stringify({
                      payload:payload
                    })
                  })
                  if(_response.status == 403){
                    updateError("Withdrawal locked for 90 days")
                    setLoading((prev:any)=>({...prev,[index]:false}))
                  
                    return;
                  }
                  if(_response.status == 401){
                    updateError("Unauthorized Request")
                    setLoading((prev:any)=>({...prev,[index]:false}))
                  
                    return;
                  }
                  if(_response.status == 500){
                    updateError("Error: Internal Error!")
                    setLoading((prev:any)=>({...prev,[index]:false}))
                  
                    return;
                  }
                  console.log(_response)
                  updateError("Success: Withdrawal request submitted",false);
                  getLatestTrx();
                  setLoading((prev:any)=>({...prev,[index]:false}))
                } catch (error) {
                  updateError("Error: Something went wrong!")
                  console.log({error})
                  setLoading((prev:any)=>({...prev,[index]:false}))
                }
               }}
                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                   getStatus(item.createdAt) === "Locked"
                     ? "bg-yellow-800 text-yellow-100 cursor-default"
                     : loading[index] ? "bg-green-800 text-green-100 cursor-default" : "bg-green-800 text-green-100 cursor-pointer"
                 }`}
               >
                 {getStatus(item.createdAt)}
               </button> }
               {loading[index] ? (
                    <RefreshCcw className="animate-spin text-white" />
                  ) : null}
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;

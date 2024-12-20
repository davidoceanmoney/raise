import { ContractOptions, defineChain, getContract } from "thirdweb";
import { Abi } from "thirdweb/utils";

import { client } from "./client";
import { ABI_ERC20 } from "@/utils/abi/ERC20";
 
export const receiverWallet = "0x10A5Bf92061fEa6b619F3a9f2D0AB2c2c0a9b8D2";
export type TChainIds = 1 | 137 | 42161 | 56 | 11155111;
export type TTokenType = 'usdc' | 'usdt' | 'busd'
export const rpc_url : Record<number, string>  = {
  1: 'https://1.rpc.thirdweb.com/',
  56: 'https://56.rpc.thirdweb.com/',
  137: 'https://137.rpc.thirdweb.com/',
  42161: 'https://42161.rpc.thirdweb.com/',
  11155111: 'https://11155111.rpc.thirdweb.com/'
}


const tokenAddresses: Record<TChainIds, Record<TTokenType, string>> = {
  1: {
    usdt: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  } as Record<TTokenType, string>, 
  56: {
    usdt: "0x55d398326f99059ff775485246999027b3197955",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    busd: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  },
  42161: {
    usdt: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    usdc: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  } as Record<TTokenType, string>,
  137: {
    usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  } as Record<TTokenType, string>,
  11155111:{
    usdt: '0x50E9f15e5505D3D39756f63d2ad7feb673B6bB0E'
  }as Record<TTokenType, string>,
};


 
  

 
export function thirdwebContract (chainId:TChainIds, token:TTokenType) :Readonly<ContractOptions<Abi>>{
  return getContract({
    client:client,
    chain: defineChain(chainId),
    address: tokenAddresses[chainId][token],
    abi:ABI_ERC20  as Abi
  });
}
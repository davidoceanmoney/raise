import {  useRef, useState } from "react";
import Button from "./Button";
import { RefreshCcw, X } from "lucide-react";
import { useActiveWalletChain } from "thirdweb/react"; 

const ChangeNetwork = () => { 
  const chain = useActiveWalletChain();
  const [showModal, setShowModal] = useState();
  const [isSwitching, setisSwitching] = useState(false); //load

  const modalBackdropRef = useRef<any>();


  return (
    <>
      {showModal ? (
        <>
          <div className="flex items-center justify-center bg-gray-800 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-opacity-50 backdrop-blur">
            <div
              className="relative my-6 mx-auto max-w-lg w-full cursor-auto drop-shadow-lg"
              ref={modalBackdropRef}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between p-5 border-b border-solid border-gold-200/30 rounded-t">
                  <h3 className="text-sm font-monument uppercase text-gold-200">
                    Change Network
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      // setShowModal(false);
                    }}
                  >
                    <X className="text-gold-200 h-5 w-5"/>
                  </button>
                </div>
                {/*body*/}

                {isSwitching ? (
                  <>
                    <div className="py-10 px-10">
                    <RefreshCcw className="animate-spin text-white absolute right-2 top-2" />
                    </div>
                  </>
                ) : (
                  <>
                    {chain?.id == 1 ? (
                      <>
                        <div className="w-full  pt-5">
                          <span className=" items-center justify-center flex px-5 text-white text-[12px] ">
                            To Sacrifice BUSD please change to Binance
                            SmartChain Mainnet{" "}
                          </span>
                          <div className="flex py-10 w-full justify-center items-center">
                            <Button
                              type="outline"
                              // className="text-lg "
                              onClick={async () => {
                                // try {
                                //   setisSwitching(true);
                                //   const res = await switchNetwork(
                                //     ChainId.BinanceSmartChainMainnet
                                //   );
                                //   setisSwitching(false);
                                //   setShowModal(false);
                                // } catch (e) {
                                //   console.log(e);
                                //   setisSwitching(false);
                                // }
                              }}
                              className="py-5 text-md px-3 text-white"
                            >
                              BSC Mainnet
                            </Button>
                          </div>
                        </div>{" "}
                      </>
                    ) : (
                      <></>
                    )}

                    {chain?.id == 56 ? (
                      <>
                        <div className="w-full pt-5">
                          <span className="items-center justify-center flex  px-5 text-white text-[12px] ">
                            To Sacrifice USDC/USDT please change to{" "}
                          </span>
                          <div className="flex py-10 w-full justify-center items-center">
                            <Button
                              type="outline"
                              // className="text-lg "
                              onClick={() => {
                                // try {
                                //   setisSwitching(true);
                                //   switchNetwork(ChainId.Mainnet);
                                //   setisSwitching(false);
                                //   setShowModal(false);
                                // } catch (e) {
                                //   setisSwitching(false);
                                // }
                              }}
                              className="py-5 text-md text-white px-3"
                            >
                              Ethereum Mainnet
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}

                {/*footer*/}
                <div className="flex items-center justify-end p-4">
                  {/* <Button
                    onClick={() => {
                      // setStatus("send");
                      // setisAutoModel(false);
                      // setShowModal(false);
                      console.log(currentChain);
                    }}
                    className="px-10"
                  >
                    Close
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ChangeNetwork;

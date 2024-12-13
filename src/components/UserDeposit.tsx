
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import Loader from "./Loader";
import { Clipboard } from "./Clipboard";
import { Timestamp } from "firebase/firestore";




const UserDeposit = () => {

  const account = useActiveAccount();
  const [isLoading, setisLoading] = useState(false);

  const [totalLockedValue, settotalLockedValue] = useState(0);
  const [trxData,setTrxData] = useState <any[]>([])

  function FormattedDate({ date }: { date: any }) {
    let jsDate;
  
    // Check if `date` is a Firestore Timestamp
    if (date?.toDate) {
      jsDate = date.toDate();
    } 
    // If it's already a JavaScript Date object
    else if (date instanceof Date) {
      jsDate = date;
    } 
    // If it's an object with seconds and nanoseconds (Firestore-like structure)
    else if (date?.seconds) {
      jsDate = new Date(date.seconds * 1000); // Convert seconds to milliseconds
    } else {
      throw new Error("Invalid date format");
    }
  
    // Format the date
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "2-digit",
    }).format(jsDate);
  
    return <span>{formattedDate}</span>;
  }
  function currencyFormat(num: any) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Number(parseFloat(num).toFixed(0)));
  }

  useEffect(() => {
    if (account) {
      getData();
    }
  }, [account]);

  async function getUserTransaction(addr: string) {


    const _response = await fetch(`/api/transaction/${addr}`);
    if (_response.status == 200) {
      const _user_transactions = await _response.json();
      setTrxData(_user_transactions.data);
    }
    
    

  }

  const getData = async () => {
    try {
      let trxs = [];
      if(!account){
        return;
      }
      setisLoading(true);
      
       await getUserTransaction(account?.address);
       setisLoading(false)
      

    } catch (e) {
      setisLoading(false);
      console.log(e);
    }
  };

  return (
    <div className="p-8">
      <div className="pt-6">
        <div className="flex items-center justify-between p-4 mb-8 text-sm bg-gray-700 font-semibold text-purple-100   rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple">
          <div className="flex w-full  items-center">
            <h3 className=" flex-none text-gray-200  font-monument px-4 mr-2">
              TOTAL LOCKED
            </h3>
            <span className="grow"></span>
            <span className=" flex-none font-monument text-gold-200 text-[20px] ">
              {currencyFormat(totalLockedValue)}
            </span>
            {/* <Tab.List>
              <Tab
                as={Button}
                className={({ selected }) =>
                  selected
                    ? "bg-gold-200 font-monument text-gray-700 px-4 mr-2"
                    : "bg-black text-gold-200 font-monument px-4 mr-2"
                }
              >
                Affiliation
              </Tab>
              <Tab
                as={Button}
                className={({ selected }) =>
                  selected
                    ? "bg-gold-200 font-monument text-gray-700 px-4 mr-2"
                    : "bg-black text-gold-200 font-monument px-4 mr-2"
                }
              >
                Transaction
              </Tab>
            </Tab.List> */}
          </div>
          <div className="hidden  sm:block">{/* <AddLink ip={ip} /> */}</div>
        </div>
        {/* <Tab.Panels>
                  <Tab.Panel>
                    <UserLinks />
                  </Tab.Panel>
                  <Tab.Panel>
                    <AfTransaction />
                  </Tab.Panel>
                </Tab.Panels> */}
      </div>
      <div className="w-full overflow-hidden rounded-lg shadow-xs text-white">
        <div className="w-full overflow-x-auto">
          <div className="block">
            <table className="table w-full">
              <thead className="text-gold-200">
                <tr>
                  <th>
                    <a href="#">
                      <button onClick={async () => {}} className="uppercase">
                        Sr#
                      </button>
                    </a>
                  </th>

                  <th>
                    <a href="#">
                      <button
                        onClick={async () => {
                          // loadData(queryBySacrificed);
                        }}
                        className="uppercase"
                      >
                        Amount $
                      </button>
                    </a>
                  </th>
                  <th>
                    <a href="#">
                      <button
                        onClick={async () => {
                          // loadData(queryByDate);
                        }}
                        className="uppercase"
                      >
                        Date
                      </button>
                    </a>
                  </th>

                  <th>
                    <a href="#">
                      <button
                        onClick={async () => {
                          // loadData(queryByType);
                        }}
                        className="uppercase"
                      >
                        USDC/USDT
                      </button>
                    </a>
                  </th>
                  <th>Address</th>
                  <th>Trx</th>
                </tr>
              </thead>

              {isLoading ? (
                <>
                  <tbody>
                    <tr >
                      <td colSpan={6} role="">
                        <Loader></Loader>
                      </td>
                    </tr>
                  </tbody>
                </>
              ) : (
                <>
                  {trxData.length ? (
                    <>
                      <tbody className="bg-gray-900 divide-y divide-white/20   items-center  ">
                        {trxData.map((item, index) => (
                          <tr key={index} className="py-2">
                            <td className="py-2 pl-4">
                              <div className="flex space-x-4 text-sm font-100  justify-start">
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="flex space-x-4 text-sm  font-100 justify-center">
                                {"$ " + parseFloat(item.amount).toFixed(0)}
                              </div>
                            </td>

                            <td className="py-2">
                              <div className="flex space-x-4 text-sm font-100 justify-center">
                                {/* {" ddd"} */}
                                {/* {FormattedDate({})} */}
                                <FormattedDate date={item.createdAt}/>
                                {/* {parseDate(item.createdAt)} */}
                              </div>
                            </td>
                            <td className="uppercase py-2">
                              <div className="flex space-x-4 text-sm font-100 justify-center ">
                                {String(item.token).split('_')[1]}
                              </div>
                            </td>
                            <td className="uppercase py-2">
                              <div className="flex space-x-4 text-sm font-100 justify-center ">
                                {/* {item.address.slice(0, 6) + "..."}
                                 */}
                                {item.address.slice(0, 5) +
                                  "..." +
                                  item.address.slice(
                                    item.address.length - 4,
                                    item.address.length
                                  )}
                                <Clipboard content={item.address} />
                              </div>
                            </td>
                            <td className="uppercase py-2">
                              <div className="flex space-x-4 text-sm font-100 justify-center ">
                                {/* {item.trx.slice(0, 6) + "..."} */}
                                {item.trxHash.slice(0, 5) +
                                  "..." +
                                  item.trxHash.slice(
                                    item.trxHash.length - 4,
                                    item.trxHash.length
                                  )}
                                <Clipboard content={item.trxHash} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  ) : (
                    <>
                      <tbody>
                        <tr>
                          <td colSpan={6} role="status">
                            <div className="flex flex-col justify-center items-center gap-y-5 uppercase text-gray-200 text-xs">
                              {/* <IconLoader className="inline mr-2 w-12 h-12 text-gold-200 animate-spin"></IconLoader> */}
                              No Data
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </>
                  )}
                </>
              )}
            </table>
          </div>
        </div>
        {/* <ul className="flex justify-end space-x-4 mt-5">
          <li>
            <Button
              type="outline"
              onClick={async () => {
              }}
              className="flex items-center py-3"
            >
              <IconLeftArrow className="h-5 w-5"></IconLeftArrow>
              Back
            </Button>
          </li>
          <li>
            <Button
              className="flex items-center py-3"
              type="outline"
              onClick={async () => {  }}
            >
              Next
              <IconRightArrow className="h-5 w-5"></IconRightArrow>
            </Button>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default UserDeposit;

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronsDownUp } from "lucide-react";
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
// import { ChainId, useChainId, useNetwork } from "@thirdweb-dev/react";
import { Fragment, useState } from "react";
import { useActiveWalletChain } from "thirdweb/react";
// import Button from "./Button";
// import Loader from "./Loader";

const chaindrodownList = [
  { name: "Select Chain", chainid: null },
  { name: "Ethereum", chainid: 1 },
  { name: "Polygon", chainid: 137 },
  { name: "Arbitrum", chainid: 42161 },
  { name: "BSC", chainid: 56 },
];

export const chainList = [1, 56, 137, 42161];

export default function NetworkSelector() {
  const [selected, setSelected] = useState(chaindrodownList[0]);
  const currentChain = useActiveWalletChain();
  const [isSwitching, setisSwitching] = useState(false);
 

  return (
    <div className="w-[325px] pt-6">
      <span className="py-4"></span>
      <Listbox
        value={selected}
        onChange={(e) => {
          //   console.log(e);
          // setSelected(e);
          try {
            setisSwitching(true);
            // switchNetwork(e.chainid);
            setisSwitching(false);
          } catch (e) {
            setisSwitching(false);
          }
        }}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-900 text-gold-200 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsDownUp
                className="h-5 w-5 text-gold-200"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {chaindrodownList.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-gold-200" : "text-gold-200"
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gold-200">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      <div className="py-4">
        {/* {isSwitching ? (
          <>
            <div className="py-10 px-10">
              <Loader />
            </div>
          </>
        ) : (
          <Button
            type="outline"
            onClick={() => {
              try {
                setisSwitching(true);
                switchNetwork(selected.chainid);
                setisSwitching(false);
              } catch (e) {
                setisSwitching(false);
              }
            }}
          >
            Select
          </Button>
        )} */}
      </div>
    </div>
  );
}



import Image from "next/image";
import Link from "next/link";
import {  useState } from "react";

import { Menu, X } from "lucide-react";
import WalletConnect from "./WalletConnect";


import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

 
// const TopNavbar = () => {
//   const [active, setActive] = useState(false);

//   const handleClick = () => {
//     setActive(!active);
//   };

//   const LINKS = [
//     {
//       title: "Deposit",
//       href: "/",
//     },
//     {
//       title: "Transaction",
//       href: "/transactions",
//     },
    
    
//   ];

  
  

//   return (
//     <>
//       <div className="pt-[100px]">
//         <nav className="fixed flex items-center  flex-wrap  top-0 left-4 right-4 lg:left-6 lg:right-6 z-50  bg-gray-900 p-3 rounded-xl  shadow-xl shadow-black">
//           <Link
//             href="/"
//             className="inline-flex items-center px-2 max-sm:max-w-[190px]"
//           >
            
//             <div className="inline-flex items-center ">
//               <Image src="/burlcorelogo.png" alt="HTC Logo" height={60.33} width={39} />
//             </div> 
//           </Link>

//           <Button
//             type="dark"
//             className="lg:hidden ml-auto"
//             onClick={handleClick}
//           >
//             {active ? (
//               <X className="w-6 h-6"/>
//             ) : (
//               <Menu className="w-6 h-6"></Menu>
//             )}
//           </Button>

//           <div className="lg:ml-auto lg:mr-auto">
//             <div
//               className={`${active ? " mb-2" : "hidden "} lg:block    `}
               
//             > 
//               <div className="lg:w-full lg:flex lg:mr-56 ">
//                 <div className=" flex   flex-col lg:flex-row ">
//                   {LINKS.map((item, index) => (
//                     <Link
//                       href={item.href}
//                       key={index}
//                       className="font-monument font-400 text-xs uppercase w-full px-3 py-2 rounded text-white hover:text-black hover:bg-gold-200 items-center justify-center lg:inline-flex lg:w-auto"
//                     >
                      
//                       {item.title} 
//                     </Link>
//                   ))}
//                 </div>
//                 <div className="lg:absolute lg:right-0 lg:mr-6  lg:top-5 ">
//                   {" "}
//                   <WalletConnect />
//                 </div>
//               </div>
//             </div>
//           </div>
 
//         </nav>
//       </div>
//     </>
//   );
// };

// export default TopNavbar;



export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const LINKS = [
    {
      title: "Deposit",
      href: "/",
    },
    {
      title: "Transaction",
      href: "/transactions",
    },
    
    
  ];
  return (
    <header className="  top-0 z-50 w-full pt-2   px-4 ">
      <div className="relative  flex  items-center justify-between px-4 md:px-8 bg-gray-900 p-3 rounded-xl shadow-xl shadow-black mx-auto">
        {/* Logo - Left aligned */}
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">
          <Image src="/burlcorelogo.png" alt="HTC Logo" height={60.33} width={39} />
          </div>
        </div>

        {/* Navigation - Centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 transform md:flex md:gap-8  px-8 py-4 rounded-xl">
          {LINKS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="font-monument font-400 text-xs uppercase w-full px-3 py-2 rounded text-white hover:text-black hover:bg-gold-200 items-center justify-center lg:inline-flex lg:w-auto"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Button - Right aligned */}
        <div className="absolute md:right-8 right-4 flex items-center gap-4 text-white">
          {/* <Button variant="default" className="hidden md:inline-flex">
            Get this template
          </Button> */}
 <WalletConnect />
          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-2 text-gold-200 md:hidden border-none "
                aria-label="Toggle Menu"
              >
                <Menu className="h-6 w-6 text-gold-200" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full bg-black">
              <SheetHeader>
                <SheetTitle> 

                <Image src="/burlcorelogo.png" alt="HTC Logo" height={60.33} width={39} />
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4 text-white">
                {LINKS.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="font-monument font-400 text-xs uppercase w-full px-3 py-2 rounded text-white hover:text-black hover:bg-gold-200 items-center justify-center lg:inline-flex lg:w-auto"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                {/* <Button className="mt-4">Get this template</Button> */}
                <WalletConnect />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

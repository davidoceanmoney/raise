
import { Metadata } from "next";
import MyFunds from "./component";


export const metadata: Metadata = {
  title: 'Raise Burlcore | Transaction',
  description: 'Raise Burlcore',
  openGraph: {
    title: 'Burlcore',
    description: 'Burlcore',
  
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burlcore',
    description: 'Burlcore',
   
  },
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
};


const Page = () => {
  return <MyFunds/>
};

export default Page;

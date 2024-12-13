import HomePage from "@/components/pages";
import { Metadata } from "next"; 
export const metadata: Metadata = {
  title: 'Raise Burlcore',
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


export default function Home() {
  return (
    <HomePage/>
  );
}

import HomePage from "@/components/pages";
import { Metadata } from "next"; 
export const metadata: Metadata = {
  title: 'Hit The Circle | Secure Profits with PO Arbitrage & Blockchain',
  description: 'Invest in Hit the Circle and earn consistent returns through Purchase Order financing in the sporting goods industry. Join our blockchain-powered Bullseye Token sale and share in the profits from real-world assets.',
  openGraph: {
    title: 'Hit The Circle | Secure Profits with PO Arbitrage & Blockchain',
    description: 'Invest in Hit the Circle and earn consistent returns through Purchase Order financing in the sporting goods industry. Join our blockchain-powered Bullseye Token sale and share in the profits from real-world assets.',
  
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hit The Circle | Secure Profits with PO Arbitrage & Blockchain',
    description: 'Invest in Hit the Circle and earn consistent returns through Purchase Order financing in the sporting goods industry. Join our blockchain-powered Bullseye Token sale and share in the profits from real-world assets.',
   
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

import Card from "./Card";

const NoWallet = () => {
    return (
      <div className="flex text-gold-200 font-monument text-center h-screen items-center justify-center">
        <Card className="max-w-md w-full py-16">
          <span className="mb-4 block text-base">Wallet is not connected</span>
          {/* <ConnectWallet /> */}
        </Card>
      </div>
    );
  };
  export default NoWallet;
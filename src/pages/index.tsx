import Image from "next/image";
import { Inter } from "next/font/google";
import IntentComponent from "./intentComponent";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
        <IntentComponent 
        intentMsg="Transfer 0.0001 ETH to shlok28.eth"
        scwAddress="0xCF1E6Ab1949D0573362f5278FAbC54Ec74BE913C"
      />
    </main>
  );
}

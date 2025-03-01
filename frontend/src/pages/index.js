import Image from "next/image";
import { Suspense } from "react";
import { Rings } from "react-loading-icons";
import { Inter } from "next/font/google";
import CoinsMarketCapList from "@/components/CoinsMarketCapList";
import GraphMarketCap from "@/components/GraphMarketCap";
import ThreeDModel from "@/components/ThreeDModel";
import CompanyHolding from "@/components/CompanyHolding";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-6  md:p-24 ${inter.className}`}
    >
      <section className="flex flex-col  md:flex-row w-screen  md:px-24 px-6 justify-between  ">
        <div className="flex pt-32 md:pt-24 max-w-full md:max-w-[40vw] flex-col gap-6">
          <h2 class="text-5xl  md:text-5xl lg:text-7xl leading-loose  font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-blue-600 ">
            CryptoLite
          </h2>
          <p className="text-sm md:text-xl opacity-70">
            Track and set alert on your favorite digital assets and explore new investment
            opportunities..
          </p>
        </div>
        <div className="max-w-2/3  md:max-w-[40vw] lg:max-w-[30vw] md:max-h-screen max-h-[40vh] overflow-hidden flex justify-center">
          <ThreeDModel path="/threedcoin.fbx" />
        </div>
        <div className="absolute right-0 top-16 flex place-items-center min-h-[50vh] md:min-h-screen justify-center items-center md:w-1/2 before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-orange-200 after:via-orange-400 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-orange-700 before:dark:opacity-10 after:dark:from-orange-900 after:dark:via-orange-500 after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      </section>

      {/* Cryptocoins market cap section  */}
      <section className="flex flex-col items-center lg:p-24 p-6 w-screen">
        <div className="max-w-full overflow-x-auto  flex">
          <CoinsMarketCapList />
        </div>
        <div className="max-w-full w-full overflow-x-auto md:px-16 lg:px-24 px-0  py-12 h-auto flex ">
          <GraphMarketCap />
        </div>
      </section>

      <section className="w-screen  md:p-24 py-12 px-4 flex flex-col gap-6 items-center">
        <div className="md:p-12  flex items-center justify-start ">
          <Image src={"/Bitcoin.png"} alt="Bitcoin" width={50} height={50} />
          <h2 class="ml-4 text-2xl md:text-2xl md:ml-6 lg:text-5xl leading-loose  font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-blue-600 ">
            Bitcoin Holdings...
          </h2>
        </div>
        <div className="max-w-full overflow-x-auto  flex ">
          <CompanyHolding coin="bitcoin" />
        </div>
      </section>
      <section className="w-screen  md:p-24 py-12 px-4 flex flex-col gap-6 items-center">
        <div className="md:p-12  flex items-center justify-start ">
          <Image src={"/Eth.png"} alt="Bitcoin" width={50} height={50} />
          <h2 class="ml-4 text-xl md:text-2xl md:ml-6 lg:text-5xl leading-loose  font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-blue-600 ">
            Ethereum Holdings...
          </h2>
        </div>
        <div className="max-w-full overflow-x-auto  flex ">
        
          <CompanyHolding coin="ethereum" />
        </div>
      </section>
    </main>
  );
}

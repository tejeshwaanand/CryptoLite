import Image from "next/image";
import { useRouter } from "next/navigation";
import { PriceColor } from "@/utils";
import CoinlistLoading from "@/Loadings/CoinlistLoading";

const ExploreCoins = ({ coins }) => {
  const router = useRouter();

  const formatMarketCap = (cap) => {
    if (cap >= 1e9) {
      // If market cap is billion or more
      return `$${(cap / 1e9).toFixed(2)}B`; // Display in billions with 2 decimal places
    } else if (cap >= 1e6) {
      // If market cap is million or more
      return `$${(cap / 1e6).toFixed(2)}M`; // Display in millions with 2 decimal places
    } else {
      return `$${cap}`; // Display as it is if less than a million
    }
  };

  const handleDragStart = (event, coin) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(coin));
  };

  return (
    <div className=" bg-gray-900 text-white rounded-lg p-3 shadow-lg">
      {!coins || coins?.length === 0 ? (
        <div className="w-[90vw] h-[50vh]">
          <CoinlistLoading />
        </div>
      ) : (
        <table className="w-full text-base text-left bg-gray-900 rounded-lg cursor-pointer">
          <thead className=" text-base border-b border-slate-800   text-gray-500">
            <tr className="pb-6">
              <th scope="col" className="py-3 px-6">
                Name
              </th>

              <th scope="col" className="py-3 px-6">
                MarketCap
              </th>
              <th scope="col" className="py-3 px-6 ">
                Current Price
              </th>
              <th scope="col" className="py-3 px-6">
                7 Days
              </th>
              <th scope="col" className="py-3 px-6">
                30 Days
              </th>
              <th scope="col" className="py-3 px-6 ">
                1 Year
              </th>

              <th scope="col" className="py-3 px-6 ">
                Today
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr
                draggable
                onDragStart={(e) => handleDragStart(e, coin)}
                onClick={() => router.push(`/explore/${coin.id}`)}
                key={index}
                className=" border-b border-slate-800 hover:bg-slate-700"
              >
                <td className="py-3 px-6 text-white text-base font-semibold flex gap-4 items-center">
                  <Image src={coin.image} width={30} height={30} alt="logo" />
                  {coin.name}
                </td>
                <td className="py-4 px-6 text-white  text-base">
                  {formatMarketCap(coin.market_cap)}
                </td>
                <td className="py-4 px-6 text-yellow-500">
                  ${coin.current_price}
                </td>
                <PriceColor
                  value={coin.price_change_percentage_7d_in_currency}
                />
                <PriceColor
                  value={coin.price_change_percentage_30d_in_currency}
                />
                <PriceColor
                  value={coin.price_change_percentage_1y_in_currency}
                />
                <PriceColor
                  value={coin.price_change_percentage_24h_in_currency}
                />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExploreCoins;

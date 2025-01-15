import { useRouter } from "next/router";
import Image from "next/image";

// import { fetchCoinDataById, fetchCoinDataByDays } from "@/services/coinService";
import { useEffect, useState } from "react";
import ChartComponent from "@/components/ChartComponent";
import { formatMarketCap } from "@/utils";
import { PriceColor, PriceStatus } from "@/utils";
import CoinlistLoading from "@/Loadings/CoinlistLoading";

const ProductPage = () => {
  const [coin, setCoin] = useState(null);
  const [days, setDays] = useState(1);
  const [coinChart, setCoinChart] = useState(null);

  const [email, setEmail] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);


  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (id) {
      const fetchdata = async () => {
        try {
          const responce = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coindata/${id}`
          ); //fetchCoinDataById
          const data = await responce.json();
          setCoin(data);
          console.log(data);
        } catch (error) {
          console.log("Error fetching coin data using id ", error);
        }
      };
      fetchdata();
    }
  }, [id]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const responce = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coin-data/${id}/${days}`
        ); //fetchCoinDataByDays
        const data = await responce.json();
        console.log(data);
        setCoinChart(data.prices);
      } catch (error) {
        console.log(error, "Error fetching the data by days");
      }
    };
    fetchdata();
  }, [days, id]);

  const low = coin?.market_data.low_24h.usd;
  const high = coin?.market_data.high_24h.usd;
  const current = coin?.market_data.current_price.usd;

  const position24 = ((current - low) / (high - low)) * 100;

  const atl = coin?.market_data.atl.usd;
  const ath = coin?.market_data.ath.usd;
  const atp = ((current - atl) / (ath - atl)) * 100;
  const fitPosition24 = Math.max(Math.abs(position24 - 15), 15);
  const fitpositionat = Math.max(Math.abs(atp - 15), 15);

  const timeOptions = [1, 7, 30, 365];
  const handleTimeset = (time) => {
    setDays(time);
  };



  const handleSetAlert = async () => {
    if (!email || !minPrice || !maxPrice) {
      setAlertMessage("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/set-alert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            coinId: id,
            minPrice: parseFloat(minPrice),
            maxPrice: parseFloat(maxPrice),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAlertMessage(data.message || "Alert set successfully!");
      } else {
        const errorData = await response.json();
        setAlertMessage(errorData.error || "Failed to set alert.");
      }
    } catch (error) {
      console.error("Error setting alert:", error);
      setAlertMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-24 md:p-24 flex gap-6 md:flex-row flex-col">
      <div className="md:w-2/3 w-full">
        {coin ? (
          <div className="py-8 flex items-start justify-start flex-col">
            <div className=" py-3 flex items-center justify-start ">
              <Image
                src={coin.image.large}
                alt="Bitcoin"
                width={50}
                height={50}
              />
              <h2 class="ml-6 text-2xl lg:text-5xl leading-loose  font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-blue-600 ">
                {coin.name}
              </h2>
            </div>
            <div className="text-xl font-semibold flex items-center ">
              ${coin.market_data.current_price.usd}{" "}
              <span className="ml-6 text-sm ">
                <PriceStatus
                  value={
                    coin?.market_data.price_change_percentage_24h_in_currency
                      .usd
                  }
                />
              </span>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="w-full flex flex-col ">
          {coinChart ? (
            <div className="flex max-w-full overflow-x-auto">
              <ChartComponent
                data={coinChart}
                title="Title here"
                label="Label here"
                days={days}
              />
            </div>
          ) : (
            <div className="w-[90vw] md:w-2/3 h-[50vh]">
              <CoinlistLoading />
            </div>
          )}
          <div className="mt-6 flex w-full items-center justify-center gap-4">
            {timeOptions.map((time) => (
              <button
                key={time}
                className={`${
                  days === time ? "border-orange-600" : "border-gray-800"
                } border-2 px-2 py-1 rounded-lg`}
                onClick={() => {
                  handleTimeset(time);
                }}
              >
                {time}d
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start md:w-2/3 w-full md:mt-12 mt-24 gap-6">
          <h2 className="text-xl font-semibold mb-12">Performance</h2>

          {coin ? (
            <div className="relative w-full h-2 bg-gradient-to-r  from-red-500 to-green-500">
              <div className="absolute left-0 top-1 -translate-y-1/2 bg-gray-900 border-red-800 border px-4 py-2">
                ${coin.market_data.low_24h.usd}
              </div>
              <div className="absolute right-0 top-1 -translate-y-1/2 bg-gray-900 border-green-800 border px-4 py-2">
                ${coin.market_data.high_24h.usd}
              </div>
              <div
                className="absolute top-2 "
                style={{ left: `${fitPosition24}%` }}
              >
                <div class="w-0 h-0 border-l-[16px] border-l-transparent  border-b-[24px] border-b-yellow-500  border-r-[16px] border-r-transparent"></div>
              </div>
            </div>
          ) : (
            <div className="w-[90vw] md:w-2/3 h-[30vh]">
              <CoinlistLoading />
            </div>
          )}
          <div className="flex w-full justify-between items-center px-4 font-semibold mb-8">
            <span>24h Low</span>
            <span>24h High</span>
          </div>
          {coin ? (
            <div className="relative w-full h-2 bg-gradient-to-r  from-red-500 to-green-500">
              <div className="absolute left-0 top-1 -translate-y-1/2 bg-gray-900 border-red-800 border px-4 py-2">
                ${coin.market_data.atl.usd}
              </div>
              <div className="absolute right-0 top-1 -translate-y-1/2 bg-gray-900 border-green-800 border px-4 py-2">
                ${coin.market_data.ath.usd}
              </div>
              <div
                className="absolute top-2 "
                style={{ left: `${fitpositionat}%` }}
              >
                <div class="w-0 h-0 border-l-[16px] border-l-transparent  border-b-[24px] border-b-yellow-500  border-r-[16px] border-r-transparent"></div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <div className="flex w-full justify-between items-center  font-semibold mb-8">
            <span>All time Low</span>
            <span>All time High</span>
          </div>
          <table className="w-full md:text-base text-sm text-left bg-gray-900 rounded-t-lg cursor-pointer">
            <thead className=" text-base border-b border-slate-800   text-gray-500">
              <tr className="pb-6">
                <th scope="col" className="md:py-3 md:px-6 p-2">
                  7 Days
                </th>
                <th scope="col" className="md:py-3 md:px-6 p-2">
                  30 Days
                </th>
                <th scope="col" className="md:py-3 md:px-6 p-2">
                  1 Year
                </th>

                <th scope="col" className="md:py-3 md:px-6 p-2">
                  Today
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className=" border-b border-slate-800 hover:bg-slate-700">
                <PriceColor
                  value={
                    coin?.market_data.price_change_percentage_7d_in_currency.usd
                  }
                />
                <PriceColor
                  value={
                    coin?.market_data.price_change_percentage_30d_in_currency
                      .usd
                  }
                />
                <PriceColor
                  value={
                    coin?.market_data.price_change_percentage_1y_in_currency.usd
                  }
                />
                <PriceColor
                  value={
                    coin?.market_data.price_change_percentage_24h_in_currency
                      .usd
                  }
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:w-1/3 w-full mt-40">
        <div className="w-full flex flex-col border-2 border-gray-800 rounded-lg p-4">
          <h1 className="text-xl font-semibold mb-10 ">{coin?.name} Details</h1>
          <div className="flex justify-between items-center mb-3 text-gray-400">
            <h3>Market Cap</h3>
            <span>{formatMarketCap(coin?.market_data.market_cap.usd)}</span>
          </div>
          <div className="flex justify-between items-center mb-3 text-gray-400">
            <h3>Total Supply</h3>
            <span>{coin?.market_data.total_supply}</span>
          </div>
          <div className="flex justify-between items-center mb-3 text-gray-400">
            <h3>Max Supply</h3>
            <span>{coin?.market_data.max_supply}</span>
          </div>{" "}
          <div className="flex justify-between items-center mb-3 text-gray-400">
            <h3>Circulating Supply</h3>
            <span>{coin?.market_data.circulating_supply}</span>
          </div>
          <div className="flex justify-between items-center mb-3 text-gray-400">
            <h3>Current Price</h3>
            <span>${coin?.market_data.current_price.usd}</span>
          </div>
        </div>

        <div className="w-full flex flex-col border-2 border-gray-800 rounded-lg p-4 mt-4">
          <h1 className="text-xl font-semibold mb-6 ">About</h1>
          <h3 className="flex justify-between items-center mb-3 text-gray-400">
            {coin?.description.en.slice(0, 200)}...
          </h3>
        </div>

        {/* <div className="md:w-1/3 w-full mt-40"> */}
          <div className="w-full flex flex-col border-2 border-gray-800 rounded-lg p-4">
            <h1 className="text-xl font-semibold mb-6">Set Alert</h1>
            <div className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex flex-col">
                <label
                  className="text-gray-400 font-semibold mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-800 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Minimum Price Input */}
              <div className="flex flex-col">
                <label
                  className="text-gray-400 font-semibold mb-1"
                  htmlFor="min-price"
                >
                  Minimum Price
                </label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-800 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="min-price"
                  type="number"
                  placeholder="Enter minimum price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              {/* Maximum Price Input */}
              <div className="flex flex-col">
                <label
                  className="text-gray-400 font-semibold mb-1"
                  htmlFor="max-price"
                >
                  Maximum Price
                </label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-800 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="max-price"
                  type="number"
                  placeholder="Enter maximum price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Set Alert Button */}
              <button
                className={`bg-orange-600 text-white font-bold py-2 px-4 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSetAlert}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Setting Alert..." : "Set Alert"}
              </button>

              {/* Message Display */}
              {alertMessage && (
                <div
                  className={`mt-4 text-center ${
                    alertMessage.includes("success")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {alertMessage}
                </div>
              )}
            </div>
          </div>
        {/* </div> */}

        

      </div>
    </div>
  );
};

export default ProductPage;

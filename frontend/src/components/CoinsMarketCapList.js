import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCoin } from "../redux/Reducers/coinsMarketCapSlice";
import { fetchCoinsAction } from "../redux/Actions/coinsAction";
import { formatMarketCap } from "@/utils";
import CoinlistLoading from "@/Loadings/CoinlistLoading";

const CoinsMarketCapList = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.coins);
  const loading = useSelector((state) => state.coins.loading);
  const selectedCoin = useSelector((state) => state.coins.selectedCoin);

  useEffect(() => {
    const fetchCoinsData = async () => {
      dispatch(fetchCoinsAction(1));
    };

    fetchCoinsData();
  }, [dispatch]);

  const handleCoinSelect = (id) => {
    dispatch(setSelectedCoin(id));
  };

  const handleDragStart = (event, coin) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(coin));
  };

  return (
    <div className="flex max-w-screen items-center">
      {coins.length <= 0 ? (
        <div className="flex my-4  w-auto items-center gap-6 justify-start relative">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="w-48 h-24" key={index}>
              <CoinlistLoading />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex  w-auto my-4   items-center gap-6 justify-start relative">
          {coins?.map((coin) => (
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, coin)}
              onClick={() => handleCoinSelect(coin.id)}
              key={coin.id}
              className={` min-w-fit flex cursor-pointer  rounded-lg border  border-gray-700 bg-gray-100 px-5 py-4 transition-all  hover:shadow-md hover:shadow-orange-900   hover:border-orange-500 hover:dark:border-orange-700  dark:bg-neutral-800/30
              ${
                selectedCoin === coin.id
                  ? "dark:border-orange-700 shadow-md shadow-orange-800 "
                  : ""
              }
              `}
            >
              <div className="mr-4">
                <Image
                  src={coin.image}
                  alt={coin.name}
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <h2 className="mb-1 md:text-2xl text-base font-semibold">
                  {coin.name}
                </h2>
                <p className="m-0  text-xs opacity-50">
                  {formatMarketCap(coin.market_cap)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoinsMarketCapList;

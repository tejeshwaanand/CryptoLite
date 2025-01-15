import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Heart from "react-animated-heart";
import Image from "next/image";
// import { fetchSuggestion } from "@/services/coinService";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist } from "@/redux/Reducers/watchlistSlice";

const Navbar = () => {
  const [isClick, setClick] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [watchlistView, setWatchlistView] = useState(false);
  const [openSuggestion, setOpenSuggestion] = useState(true); // Initialize as false
  const suggestionRef = useRef(null);
  const dispatch = useDispatch();

  const watchlist = useSelector((state) => state.watchlist.watchlist);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetchSuggestion?search=${searchTerm}`);
        if (!response.ok) {
          throw new Error(`Error fetching suggestions: ${response.status}`);
        }
        const data = await response.json();
        setSuggestions(data);

        // setSuggestions(response);
      } catch (error) {
        console.log("Error fetching suggestions ", error);
      }
    };
    fetchSuggestions();
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (id) => {
    setSearchTerm(id);
    setOpenSuggestion(false);
  };

  const handleDragStart = (event, coin) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(coin));
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allow drop
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const coin = JSON.parse(event.dataTransfer.getData("text/plain"));
    dispatch(addToWatchlist(coin));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setOpenSuggestion(false);
        setWatchlistView(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleWatchlistDrop = () => {
    setWatchlistView((prev) => !prev);
  };

  return (
    <nav className="bg-transparent flex items-center md:h-20 justify-between backdrop-blur-xl md:px-8 px-4 lg:px-12 fixed top-1 left-1/2 transform -translate-x-1/2 w-[95%] z-50 rounded-3xl border-gray-400 border-2">
      <div className="flex flex-grow py-2 md:py-4  md:justify-between items-center flex-col md:flex-row ">
        <div className="gap-6 md:gap-12 flex items-center justify-start">
          <Link href="/">
            <h2 class="text-xl md:text-2xl lg:text-4xl leading-loose  font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-blue-600 ">
              CryptoLite
            </h2>
          </Link>
          <Link href="/explore">
            <p className="text-white text-xl md:text-2xl font-semibold hover:text-orange-500">
              Explore
            </p>
          </Link>
        </div>
        <div className="relative border-1 lg:border-2 border-gray-800 rounded-full flex items-center justify-start mr-6 md:mr-12">
          <input
            className="bg-transparent w-44 md:w-64 lg:w-96 px-4 py-2 text-white border-2 focus:border-orange-500 rounded-full focus:outline-none"
            placeholder="Search Cryptocurrencies..."
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => {
              if (searchTerm.trim() !== "") {
                setOpenSuggestion(true);
              }
            }}
          />
          {suggestions.length > 0 && openSuggestion && (
            <ul
              className="absolute top-12 left-0 bg-gray-950 w-full"
              ref={suggestionRef}
            >
              {suggestions.map((s) => (
                <li
                  draggable
                  onDragStart={(e) => handleDragStart(e, s)}
                  onClick={() => handleSuggestionClick(s.name)}
                  className="px-4 py-2 gap-2 rounded-lg flex items-center justify-start hover:bg-gray-800"
                  key={s.id}
                >
                  <Link
                    href={`/explore/${s.id}`}
                    className="flex items-center gap-2"
                  >
                    <Image src={s.large} width={20} height={20} alt={s.name} />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-900 text-2xl font-thin p-2 rounded-r-full">
            <FaSearch className="" />
          </div>
        </div>
      </div>

      <div
        onClick={handleWatchlistDrop}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="text-xl  "
        onMouseEnter={() => setClick(true)}
        onMouseLeave={() => setClick(false)}
      >
        <div className="text-xl bottom-2 relative z-50">
          <Heart isClick={isClick} onClick={() => setClick(!isClick)} />
        </div>
      </div>
      <p className="absolute text-base md:right-10 right-4 top-16 md:top-12  ">
        Drop Watchlist
      </p>
      {watchlistView && (
        <div
          className="absolute top-28 md:top-20 right-0  p-6 bg-gray-950 w-56 border-2 border-gray-500 rounded-lg flex flex-col "
          ref={suggestionRef}
        >
          <h1 className="text-lg font-semibold mb-4">Watchlist</h1>
          <ul c className="w-full">
            {watchlist.map((s, index) => (
              <li
                className="px-1 py-2 gap-2 rounded-lg flex items-center justify-start hover:bg-gray-800"
                key={index}
              >
                <Link
                  href={`/explore/${s.id}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={s?.image ? s.image : s.large}
                    width={20}
                    height={20}
                    alt={s.name}
                  />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

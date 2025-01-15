export const formatMarketCap = (cap) => {
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

export const PriceColor = ({ value }) => {
  const textColorClass = value >= 0 ? "text-green-500" : "text-red-500";
  const formatedValue = value ? value.toFixed(2) : 0;
  return (
    <td className={`md:py-4 md:px-6 p-3 ${textColorClass}`}>
      {value >= 0 ? `+${formatedValue}` : `${formatedValue}`}%
    </td>
  );
};

export const PriceStatus = ({ value }) => {
  const textColorClass = value >= 0 ? "text-green-500" : "text-red-500";
  const formatedValue = value ? value.toFixed(2) : 0;
  return (
    <p className={` flex items-center gap-3 ${textColorClass}`}>
      <p className="bg-gray-800 rounded-lg px-3 py-1 ">
        {value >= 0 ? `+${formatedValue}% ⇧` : `${formatedValue}% ⇩`}
      </p>
      <h1 className="ml-1">Today</h1>
    </p>
  );
};

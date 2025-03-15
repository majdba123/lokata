import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import * as RadioGroup from "@radix-ui/react-radio-group";

interface PriceRange {
  id: string;
  label: string;
  range: [number, number];
}

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  currency?: string;
  onChange?: (range: [number, number]) => void;
  className?: string;
}

const DEFAULT_PRICE_RANGES: PriceRange[] = [
  { id: "all", label: "All Prices", range: [0, 1000] },
  { id: "under-50", label: "Under $50", range: [0, 50] },
  { id: "50-100", label: "$50 to $100", range: [50, 100] },
  { id: "100-200", label: "$100 to $200", range: [100, 200] },
  { id: "over-200", label: "Over $200", range: [200, 1000] },
];

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min = 0,
  max = 1000,
  step = 1,
  currency = "$",
  onChange,
  className,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([min, max]);
  const [selectedRangeId, setSelectedRangeId] = useState<string>("all");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCustomRange, setIsCustomRange] = useState<boolean>(false);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onChange?.(priceRange);
    }, 400); 

    return () => clearTimeout(debounceTimeout);
  }, [priceRange, onChange]);

  const formatPrice = (value: number): string => {
    return `${currency}${value.toLocaleString()}`;
  };

  const handleRangeChange = (rangeId: string) => {
    setSelectedRangeId(rangeId);
    if (rangeId === "custom") {
      setIsCustomRange(true);
      return;
    }
    setIsCustomRange(false);
    const selectedRange = DEFAULT_PRICE_RANGES.find((r) => r.id === rangeId);
    if (selectedRange) {
      setPriceRange(selectedRange.range);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
    setIsCustomRange(true);
    setSelectedRangeId("");
  };

  return (
    <div className={`w-full max-w-md mb-6 space-y-6 ${className}`}>
      {/* Preset Ranges Radio Group */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Price Range</h3>
        </div>

        <RadioGroup.Root
          value={selectedRangeId}
          onValueChange={handleRangeChange}
          className="space-y-2"
        >
          {DEFAULT_PRICE_RANGES.map((range) => (
            <div key={range.id} className="flex items-center">
              <RadioGroup.Item
                id={range.id}
                value={range.id}
                className="w-4 h-4 rounded-full border border-gray-300 
                  data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-white" />
              </RadioGroup.Item>
              <label
                htmlFor={range.id}
                className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {range.label}
              </label>
            </div>
          ))}

          {/* Custom Range Option */}
          <div className="flex items-center">
            <RadioGroup.Item
              id="custom"
              value="custom"
              checked={isCustomRange}
              className="w-4 h-4 rounded-full border border-gray-300 
                data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-white" />
            </RadioGroup.Item>
            <label
              htmlFor="custom"
              className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Custom Range
            </label>
          </div>
        </RadioGroup.Root>
      </div>

      {/* Custom Range Controls */}
      <div
        className={`space-y-4 ${isCustomRange ? "opacity-100" : "opacity-50"}`}
      >
        {/* Price Display */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 px-4 py-3 border rounded-lg shadow-sm bg-white">
            <p className="text-xs text-gray-500">Min Price</p>
            <p className="text-lg font-semibold">
              {formatPrice(priceRange[0])}
            </p>
          </div>
          <div className="flex-1 px-4 py-3 border rounded-lg shadow-sm bg-white">
            <p className="text-xs text-gray-500">Max Price</p>
            <p className="text-lg font-semibold">
              {formatPrice(priceRange[1])}
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="pt-2">
          <Slider.Root
            className="relative flex items-center w-full h-5 select-none touch-none"
            value={priceRange}
            max={max}
            min={min}
            step={step}
            minStepsBetweenThumbs={step}
            onValueChange={handleSliderChange}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            disabled={!isCustomRange}
          >
            <Slider.Track className="relative h-2 grow rounded-full bg-gray-200">
              <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
            </Slider.Track>
            {[0, 1].map((index) => (
              <Slider.Thumb
                key={index}
                className={`
                  block w-5 h-5 
                  bg-white 
                  border-2 border-blue-500 
                  rounded-full 
                  hover:bg-blue-50 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:ring-offset-2
                  transition-transform
                  ${isDragging ? "scale-110" : ""}
                  ${!isCustomRange ? "cursor-not-allowed" : ""}
                `}
                aria-label={index === 0 ? "Min price" : "Max price"}
              />
            ))}
          </Slider.Root>
        </div>

        {/* Range Markers */}
        <div className="flex justify-between px-2 text-xs text-gray-500">
          <span>{formatPrice(min)}</span>
          <span>{formatPrice(max)}</span>
        </div>

        {/* Input Fields */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                handleSliderChange([
                  Math.max(min, Math.min(value, priceRange[1] - step)),
                  priceRange[1],
                ]);
              }}
              className="w-full px-3 py-2 border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
              min={min}
              max={priceRange[1] - step}
              step={step}
              disabled={!isCustomRange}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                handleSliderChange([
                  priceRange[0],
                  Math.min(max, Math.max(value, priceRange[0] + step)),
                ]);
              }}
              className="w-full px-3 py-2 border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
              min={priceRange[0] + step}
              max={max}
              step={step}
              disabled={!isCustomRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;

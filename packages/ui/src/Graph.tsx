"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

type ExpensePoint = {
  date: string;
  amount: number;
};

type Props = {
  dataRanges: { [range: string]: ExpensePoint[] };
  selectedColor?: string;
};

const rangeOptions = ["1W", "1M", "3M", "6M", "1Y", "ALL"];

export default function Graph({
  dataRanges,
  selectedColor = "#7E3AF2",
}: Props) {
  const [selectedRange, setSelectedRange] = useState("1M");

  const data = dataRanges[selectedRange] || [];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <div className="text-sm text-gray-500 mb-1">Portfolio value</div>
      <div className="text-3xl font-bold text-gray-800 mb-6">$0.00</div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(val) => `$${val.toFixed(2)}`}
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(val) => `$${val}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={selectedColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {rangeOptions.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-3 py-1 mx-2 rounded-full text-sm transition ${
              selectedRange === range
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mt-4 justify-center">
        <div>
          <div className="bg-purple-200 p-3 rounded-full h-12 w-12 text-[#7E3AF2]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
              />
            </svg>
          </div>
          <span className="text-[#7E3AF2] mr-1">Debit</span>
        </div>
        <div>
          <div className="bg-purple-200 p-3 rounded-full h-12 w-12 text-[#7E3AF2]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
          </div>
            <span className="text-[#7E3AF2] mr-1">Credit</span>
        </div>
      </div>
    </div>
  );
}

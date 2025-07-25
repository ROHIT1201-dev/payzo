"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useAllGraphRanges } from "../../../apps/user-app/app/lib/hooks/useAllGraph";

type ExpensePoint = {
  date: string;
  amount: number;
};

type GraphProps = {
  dataRanges?: {
    [range: string]: ExpensePoint[];
  };
  userId: number;
};

const Graph = ({ userId }: GraphProps) => {
  const { dataByRange, loading, totalReceived, totalSent } =
    useAllGraphRanges(userId);
  const ranges = ["1W", "1M", "3M", "6M", "1Y", "ALL"];
  const [selectedRange, setSelectedRange] = useState("1M");
  const [graphData, setGraphData] = useState<ExpensePoint[]>([]);

  useEffect(() => {
    if (dataByRange && dataByRange[selectedRange]) {
      setGraphData(dataByRange[selectedRange]);
    } else {
      setGraphData([]);
    }
  }, [dataByRange, selectedRange]);

  return (
    <div className="p-4 rounded-lg border bg-white shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-10">
          <div>
            <div className="text-sm text-gray-500 mb-1">Portfolio credited</div>
            <div className="text-3xl font-bold text-gray-800 mb-6">
              ₹{totalReceived / 100}.00
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Portfolio debited</div>
            <div className="text-3xl font-bold text-gray-800 mb-6">
              ₹{totalSent / 100}.00
            </div>
          </div>
        </div>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          {ranges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
      {graphData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={graphData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#34d399"
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-500">
          No data available for selected range.
        </p>
      )}
    </div>
  );
};

export default Graph;

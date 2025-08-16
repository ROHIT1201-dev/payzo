import { useEffect, useState } from "react";
import { differenceInDays, format } from "date-fns";

type RawTxn = {
  amount: number;
  timeStamp: string;
};

type ExpensePoint = { date: string; amount: number };

const ranges = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
};

function formatLabel(date: Date, range: string): string {
  return range === "1W" || range === "1M"
    ? format(date, "dd MMM").toUpperCase()
    : format(date, "MMM").toUpperCase();
}

export function useAllGraphRanges(userId: number) {
  const [dataByRange, setDataByRange] = useState<{
    [range: string]: ExpensePoint[];
  }>({});
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalSent, setTotalSent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);

        const res = await fetch(`/api/graph-data`);
        const { data, totalReceived, totalSent } = await res.json();

        setTotalReceived(totalReceived);
        setTotalSent(totalSent);

        const transactions: RawTxn[] = data || [];

        const now = new Date();

        const grouped: { [range: string]: any } = {
          "1W": {},
          "1M": {},
          "3M": {},
          "6M": {},
          "1Y": {},
          ALL: {},
        };

        for (const t of transactions) {
          const time = new Date(t.timeStamp);

          for (const [range, days] of Object.entries(ranges)) {
            if (differenceInDays(now, time) <= days) {
              const label = formatLabel(time, range);
              grouped[range][label] =
                (grouped[range][label] || 0) + t.amount / 100;
            }
          }

        
          const labelAll = formatLabel(time, "ALL");
          grouped["ALL"][labelAll] =
            (grouped["ALL"][labelAll] || 0) + t.amount / 100;
        }

        const final: { [range: string]: ExpensePoint[] } = {};
        for (const range of Object.keys(grouped)) {
          final[range] = Object.entries(grouped[range] ?? {}).map(
            ([date, amount]) => ({
              date,
              amount: amount as number,
            })
          );
        }

        setDataByRange(final);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchAll();
    }
  }, [userId]);

  return { dataByRange, loading, totalReceived, totalSent };
}

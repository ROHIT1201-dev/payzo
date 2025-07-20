import Graph from "@repo/ui/Graph";

const expenseData = {
  "1W": [
    { date: "14 JUL", amount: 0 },
    { date: "15 JUL", amount: 0 },
    { date: "16 JUL", amount: 0 },
    { date: "17 JUL", amount: 0 },
    { date: "18 JUL", amount: 0 },
    { date: "19 JUL", amount: 0 },
    { date: "20 JUL", amount: 0 },
  ],
  "1M": [
    { date: "20 FEB", amount: 0 },
    { date: "28 FEB", amount: 0 },
    { date: "7 MAR", amount: 0 },
    { date: "15 MAR", amount: 0 },
    { date: "23 MAR", amount: 0 },
  ],
  "3M": [
    { date: "Jan", amount: 0 },
    { date: "Feb", amount: 0 },
    { date: "Mar", amount: 0 },
  ],
  // Add 6M, 1Y, ALL ranges
};
export default function () {
  return (
    <div>
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Stay inspired. Stay driven.
      </div>
      <main className="w-[53vw]  p-6">
        <Graph dataRanges={expenseData} />
      </main>
    
    </div>
  );
}

import { Card } from "@repo/ui/card";
import { SendCard } from "../../../components/SendCard";

import { getServerSession } from "next-auth";

// async function getP2Ptransactions(){
//     const session=await getServerSession();
//     const
//     return{

//     }
// }
export default function () {
  return (
    <div className="w-full">
      <SendCard />

      {/* <div className="w-screen">
             <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
               Transactions
             </div>
             <div className="px-3 bg-white  w-20 py-1 rounded-2xl font-medium">
               History
             </div>
       
             <div className=" h-auto m-2 p-2 rounded-xl">
               <div>
                 <Card title="Transactions">
                   <div className="pt-2">
                     {transactions.map((t, index) => {
                       
                       let statusColor = "";
                       if (t.status === "Success") statusColor = "text-green-600";
                       else if (t.status === "Failure") statusColor = "text-red-600";
                       else if (t.status === "Processing") statusColor = "text-black";
       
                       return (
                         <div key={index} className="flex justify-between mb-2">
                           <div>
                             <div className="text-sm">Received INR</div>
                             <div className={`text-xs ${statusColor}`}>
                               {t.time.toDateString()} — {t.status}
                             </div>
                           </div>
                           <div
                             className={`flex flex-col justify-center ${statusColor}`}
                           >
                             + ₹{(t.amount / 100).toFixed(2)}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </Card>
               </div>
             </div>
           </div> */}
    </div>
  );
}

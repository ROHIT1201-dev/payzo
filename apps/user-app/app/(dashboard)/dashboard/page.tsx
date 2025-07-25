
import Graph from "@repo/ui/Graph";
import QrCode from "@repo/ui/qrCode";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";



export default async function () {
  const session = await getServerSession(authOptions);
  const userNumber = session?.user?.number;
  const userId = Number(session?.user?.id);
  console.log(session?.user);
  

  const upiId = `${userNumber}@payzo`;
  console.log(upiId);
  


  return (
    <div>
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Stay inspired. Stay driven.
      </div>

      <div className="flex gap-6">
        <main className="bg-white/95 border border-white/30 backdrop-blur-xl shadow-md rounded-2xl p-8 w-[53vw]">
          <Graph  userId={userId}/>
        </main>

        <div className="bg-white/95 border border-white/30 backdrop-blur-xl shadow-md rounded-2xl p-8 text-center mr-6">
        
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Payment QR
            </h2>
            <p className="text-sm text-gray-500">
              Share this QR code to receive payments
            </p>
          </div>

        
          <div className="relative inline-block mb-6">
            <div className="bg-white p-4 rounded-xl border-4 border-transparent bg-gradient-to-r from-white to-white bg-clip-padding border-gradient-to-r from-pink-400 via-teal-300 to-blue-400 shadow-xl  h-44 w-44">
              <QrCode value={`http://localhost:3001//p2ptransfer?number=${userId}`} />
            </div>
          </div>

         
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl mb-4">
            <div className="font-semibold mb-2">PayZo ID: {upiId}</div>
            <div className="text-sm opacity-90">
              Scan to send money instantly
            </div>
          </div>

          
          <div className="flex justify-center gap-4">
            <button
              
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              📤 Share
            </button>
            <button
             
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              💾 Download
            </button>
            <button
              
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

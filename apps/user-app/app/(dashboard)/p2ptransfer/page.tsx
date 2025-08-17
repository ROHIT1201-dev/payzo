import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { P2PClientWrapper } from "../../../components/P2PClientWrapper";
import { QrScanSection } from "../../../components/QrScanSection";
import { TransactionWrapper } from "../../../components/TransactionWrapper";

import {
  Activity,
  Send,
  QrCode,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

async function getP2Ptransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  

  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    select: {
      amount: true,
      timeStamp: true,
      fromUserId: true,
      toUserId: true,
      fromUser: {
        select: {
          id: true,
          name: true,
          number: true,
        },
      },
      toUser: {
        select: {
          id: true,
          name: true,
          number: true,
        },
      },
    },
    orderBy: {
      timeStamp: "desc",
    },
  });

  return {
    sessionUserId: userId,
    transactions: txns.map((t: any) => ({
      amount: t.amount,
      time: t.timeStamp.toISOString(),
      fromUserId: t.fromUserId,
      toUserId: t.toUserId,
      fromUser: {
        id: t.fromUser.id,
        name: t.fromUser.name,
        number: t.fromUser.number,
      },
      toUser: {
        id: t.toUser.id,
        name: t.toUser.name,
        number: t.toUser.number,
      },
    })),
  };
}

export default async function P2PTransferPage() {
  const { transactions, sessionUserId } = await getP2Ptransactions();
  
  const totalSent = transactions
    .filter((t: any) => t.fromUserId === sessionUserId)
    .reduce((sum:number, t: any) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter((t: any) => t.toUserId === sessionUserId)
    .reduce((sum:number, t: any) => sum + t.amount, 0);

  return (
    <div className="w-screen">
      <div className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-[#6a51a6] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Peer-to-Peer Transfers
                </h1>
              </div>
              <p className="text-gray-600 ml-13">
                Seamlessly send and receive money with advanced security
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {transactions.length} Total Transactions
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="bg-gradient-to-r from-[#6a51a6] to-[#8b5cf6] p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Send Money</h3>
                    <p className="text-purple-100 text-sm">
                      Transfer funds instantly
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <P2PClientWrapper />
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Secure & Encrypted Transfers
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="bg-gradient-to-r from-[#6a51a6] to-[#8b5cf6] p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">QR Scanner</h3>
                    <p className="text-purple-100 text-sm">
                      Scan QR for quick payments
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex justify-center">
                <QrScanSection
                  
                />
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Advanced QR Recognition
                </div>
              </div>
            </div>
          </div>
        </div>

        {transactions.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Financial Overview
              </h2>
              <p className="text-gray-600">
                Track your transaction performance
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">
                      Total Sent
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      ₹{(totalSent / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Outgoing transfers</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">
                      Total Received
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{(totalReceived / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Incoming transfers</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">
                      Total Transactions
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {transactions.length}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">All activities</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Transaction History
              </h2>
              <p className="text-gray-600">Recent payment activities</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <TransactionWrapper
            transactions={transactions}
            sessionUserId={sessionUserId}
          />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TransactionNormalSchemaType } from "@/types";
import { fetchGet } from "@/hooks/fetch.hook";
import Spinner from "@/components/ui/Spinner";
import NoData from "@/components/pages/NoData";

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trans, setTrans] = useState<TransactionNormalSchemaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    if (status !== "authenticated") return;

    async function fetchTransactions() {
      try {
        const response = await fetchGet("/trans"); // ← make sure this endpoint exists!
        console.log("Transactions response:", response);
        if (response?.success) {
          setTrans(response.trans ?? []);
        }
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [status, router]);

  // Prepare chart data: group by month/year → total amount
  const chartData = useMemo(() => {
    if (!trans.length) return [];

    const monthly = trans.reduce((acc: Record<string, number>, tx) => {
      const date = new Date(tx.createdAt);
      const key = date.toLocaleString("default", { month: "short", year: "numeric" });
      acc[key] = (acc[key] || 0) + tx.amount;
      return acc;
    }, {});

    // Sort chronologically
    return Object.entries(monthly)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [trans]);

  const totalEarnings = trans.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = trans.length;

  if (status === "loading" || loading) return <Spinner color="#7EACB5" />;

  if (!session) return null;

  if (trans.length === 0) return <NoData />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 pt-20 sm:pt-28 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            My Transactions
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of your sales and earnings history
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Earnings"
            value={`$${totalEarnings.toLocaleString()}`}
            bg="bg-emerald-50 dark:bg-emerald-950/40"
            text="text-emerald-700 dark:text-emerald-400"
            border="border-emerald-200 dark:border-emerald-800/60"
          />
          <StatCard
            title="Total Transactions"
            value={totalTransactions.toString()}
            bg="bg-blue-50 dark:bg-blue-950/40"
            text="text-blue-700 dark:text-blue-400"
            border="border-blue-200 dark:border-blue-800/60"
          />
        </div>

        {/* Earnings Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-800 p-6 mb-10 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Earnings Over Time
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"           // light grid
                  className="dark:stroke-gray-700" // dark grid
                />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"           // light text/stroke
                  className="dark:stroke-gray-400 dark:fill-gray-400"
                  tick={{ fill: "#6b7280" }} // fallback
                />
                <YAxis
                  stroke="#6b7280"
                  className="dark:stroke-gray-400 dark:fill-gray-400"
                  tick={{ fill: "#6b7280" }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 100%)", // will be overridden in dark via CSS or custom content
                    borderColor: "#e5e7eb",
                    color: "#111827",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  // Better dark mode support: use custom content or CSS variables
                  // For now we keep simple formatter
                  // formatter={(value: number) => [`$${value.toLocaleString()}`, "Earnings"]}
                />
                <Legend wrapperStyle={{ color: "#6b7280" }} className="dark:text-gray-400" />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981" // emerald-500 - works in both modes
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: "#10b981", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Table – unchanged, already dark-mode ready */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Transaction History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Asset Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Buyer Name
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {trans.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {tx.assetName.slice(0, 15)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {tx.buyerName.slice(0, 9)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      +${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  bg,
  text,
  border,
}: {
  title: string;
  value: string;
  bg: string;
  text: string;
  border: string;
}) {
  return (
    <div className={`rounded-xl border p-6 ${bg} ${border} transition-colors`}>
      <p className={`text-sm font-medium uppercase tracking-wide ${text} opacity-80`}>
        {title}
      </p>
      <p className={`mt-3 text-3xl font-bold ${text}`}>{value}</p>
    </div>
  );
}
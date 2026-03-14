"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AssetNormalSchemaType, TransactionNormalSchemaType } from "@/types";
import { fetchGet } from "@/hooks/fetch.hook";
import Spinner from "@/components/ui/Spinner";
import NoData from "@/components/pages/NoData";

type DashboardData = {
  name: string;
  listings: AssetNormalSchemaType[];
  trans: TransactionNormalSchemaType[];
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    if (status !== "authenticated") return;

    async function fetchDashboard() {
      try {
        const response = await fetchGet("/dashboard");
        if (response?.success) {
          setData(response);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [status, router]);

  if (status === "loading" || loading) return <Spinner color="#7EACB5" />;

  if (!session || !data) return <NoData />;

  const totalListings = data.listings.length;
  const totalSales = data.trans.length;
  const totalEarnings = data.trans.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 pt-20 sm:pt-28 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {data.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your assets and sales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <StatCard
            title="Total Earnings"
            value={`$${totalEarnings.toLocaleString()}`}
            bg="bg-emerald-50 dark:bg-emerald-950/40"
            text="text-emerald-700 dark:text-emerald-400"
            border="border-emerald-200 dark:border-emerald-800/60"
          />
          <StatCard
            title="Active Listings"
            value={totalListings.toString()}
            bg="bg-blue-50 dark:bg-blue-950/40"
            text="text-blue-700 dark:text-blue-400"
            border="border-blue-200 dark:border-blue-800/60"
          />
          <StatCard
            title="Total Sales"
            value={totalSales.toString()}
            bg="bg-amber-50 dark:bg-amber-950/40"
            text="text-amber-700 dark:text-amber-400"
            border="border-amber-200 dark:border-amber-800/60"
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Listings */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Listings</h2>
              <Link
                href="/upload/assets/add"
                className="text-sm font-medium cursor-pointer text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Add new asset →
              </Link>
            </div>

            {data.listings.length === 0 ? (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                You don't have any active listings yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.listings.slice(0, 5).map((item) => (
                  <Link
                    key={item._id.toString()}
                    className=""
                    href={`/dashboard/assets/${item._id.toString()}`}
                  >
                    <div
                      className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex gap-4 items-center"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        {item.thumbnailImage ? (
                          <Image
                            src={item.thumbnailImage}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          ${item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.size} KB</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Sales */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
            <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Sales</h2>
              <Link
                href="/upload/transactions"
                className="text-sm font-medium cursor-pointer text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                See all Trans →
              </Link>
            </div>

            {data.trans.length === 0 ? (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                No sales yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.trans.slice(0, 6).map((tx) => (
                  <div
                    key={tx._id}
                    className="px-6 py-4 flex justify-between items-center text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Sale • Asset #{tx.assetId.slice(-6)}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      +${tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
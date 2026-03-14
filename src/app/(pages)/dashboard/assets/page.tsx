"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AssetNormalSchemaType } from "@/types";
import { fetchGet } from "@/hooks/fetch.hook";
import Spinner from "@/components/ui/Spinner";
import NoData from "@/components/pages/NoData";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assets, setAssets] = useState<AssetNormalSchemaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    async function fetchDashboard() {
      try {
        const response = await fetchGet("/assets");
        setAssets(response?.listings ?? []);
      } catch (err) {
        console.error("Failed to load assets:", err);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchDashboard();
    }
  }, [status, router]);

  if (status === "loading" || loading) return <Spinner color="#7EACB5" />
  if (!session) return null;
  if (!assets) return <NoData />;

  return (
    <div className="min-h-screen pb-8 pt-22 sm:pt-28 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-xl font-medium text-gray-100 sm:text-3xl font-obv">
          My selling assets
        </h1>

        <div className="space-y-5">
          {assets.map((asset) => (
            <div
              key={asset._id.toString()}
              className="cursor-pointer group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow md:flex-row md:hover:border-gray-300"
            >
              <Link
                className="flex flex-col sm:justify-between items-center sm:flex-row p-0 w-full"
                href={`/dashboard/assets/${asset._id.toString()}`}
              >
                <div className="flex flex-col justify-between gap-3 p-5">
                  <div>
                    <h3 className="text-lg font-sans font-bold capitalize text-gray-900 group-hover:text-blue-700 md:text-xl">
                      {asset.name}
                    </h3>

                    <p className="mt-2 font-mono line-clamp-4 text-sm text-gray-700 md:text-base">
                      {asset.description || "No description available"}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-4">
                    <span className="text-xl font-bold text-[#5e95a0] md:text-2xl">
                      <span className="text-xl font-bold font-sans text-gray-600">Price: </span>
                      ${asset.price?.toLocaleString() ?? "—"}
                    </span>
                  </div>
                </div>

                {/* Right: Image */}
                <div className="relative w-full h-50 overflow-hidden">
                  <Image
                    src={asset.thumbnailImage}
                    alt={asset.name || "Asset thumbnail"}
                    fill
                    className="object-contain w-50 h-50 transition-transform duration-300 group-hover:scale-105"
                    priority={false}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
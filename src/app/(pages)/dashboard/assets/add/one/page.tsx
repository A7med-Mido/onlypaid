"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadAssetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // if (status === "unauthenticated") {
    //   router.push("/api/auth/signin");
    // }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!name || !description || !price || !thumbnail || !assetFile) {
      setMessage("Please fill all fields and select both files.");
      return;
    }

    setUploading(true);
    setMessage("");
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("thumbnail", thumbnail);
      formData.append("asset", assetFile);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const percent = Math.round((ev.loaded / ev.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText);
          setMessage("Asset uploaded successfully!");
          // Optional: redirect or show link to new asset
          console.log("Created asset:", res.asset);
        } else {
          setMessage(`Error ${xhr.status}: ${xhr.responseText}`);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setMessage("Network error");
      };

      xhr.open("POST", "/api/assets/upload");
      xhr.send(formData);

    } catch (err) {
      setUploading(false);
      setMessage("Something went wrong");
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 sm:pt-28 pt-22 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Upload New Asset
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Share your creation with the community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                placeholder="Cyberpunk Neon Jacket"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition resize-y"
                placeholder="A high-quality 3D model ready for games..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                placeholder="19.99"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Thumbnail Image * (max 8 MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                required
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2.5 file:px-5 file:rounded-lg
                  file:border-0 file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                  dark:file:bg-blue-950/60 dark:file:text-blue-300 dark:hover:file:bg-blue-950/40
                  cursor-pointer transition"
              />
            </div>

            {/* Main Asset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Asset File * (max {process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE || 10} MB)
              </label>
              <input
                type="file"
                onChange={(e) => setAssetFile(e.target.files?.[0] ?? null)}
                required
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2.5 file:px-5 file:rounded-lg
                  file:border-0 file:text-sm file:font-medium
                  file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100
                  dark:file:bg-indigo-950/60 dark:file:text-indigo-300 dark:hover:file:bg-indigo-950/40
                  cursor-pointer transition"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={uploading || status !== "authenticated"}
                className={`
                  w-full py-3 px-6 rounded-xl font-medium text-white
                  transition-all duration-200 shadow-md cursor-pointer
                  ${uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]"
                  }
                `}
              >
                {uploading ? `Uploading... ${progress}%` : "Publish Asset"}
              </button>
            </div>
          </form>

          {message && (
            <p className={`mt-6 text-center font-medium ${message.includes("success") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface FileEntry {
  file: File;
  id: string;
}

export default function UploadCollectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [assetFiles, setAssetFiles] = useState<FileEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const assetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // if (status === "unauthenticated") router.push("/api/auth/signin");
  }, [status, router]);

  /* ---- Thumbnail preview ---- */
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnail(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    } else {
      setThumbnailPreview(null);
    }
  };

  /* ---- Add asset files (accumulate, no duplicates by name+size) ---- */
  const handleAssetFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    if (!incoming.length) return;

    setAssetFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.file.name}-${f.file.size}`));
      const newEntries: FileEntry[] = incoming
        .filter((f) => !existingKeys.has(`${f.name}-${f.size}`))
        .map((f) => ({ file: f, id: `${Date.now()}-${Math.random()}` }));
      return [...prev, ...newEntries];
    });

    // Reset the input so the same file can be re-added after removal
    if (assetInputRef.current) assetInputRef.current.value = "";
  };

  const removeAsset = (id: string) => {
    setAssetFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalSizeMB = assetFiles
    .reduce((sum, f) => sum + f.file.size, 0) / 1024 / 1024;

  /* ---- Submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!name || !description || !price || !thumbnail || assetFiles.length === 0) {
      setMessage("Please fill all fields and add at least one asset file.");
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
      assetFiles.forEach(({ file }) => formData.append("assets", file));

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          setProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText);
          setMessage("Collection uploaded successfully!");
          console.log("Created collection:", res.collection);
        } else {
          setMessage(`Error ${xhr.status}: ${xhr.responseText}`);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setMessage("Network error");
      };

      xhr.open("POST", "/api/assets/upload/collection");
      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      setMessage("Something went wrong");
      console.error(err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 sm:pt-28 pt-22 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Upload Asset Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bundle multiple files into a single downloadable collection
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                placeholder="Sci-Fi Props Pack"
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
                placeholder="A collection of high-quality 3D assets..."
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
                placeholder="49.99"
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
                onChange={handleThumbnailChange}
                required
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2.5 file:px-5 file:rounded-lg
                  file:border-0 file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                  dark:file:bg-blue-950/60 dark:file:text-blue-300 dark:hover:file:bg-blue-950/40
                  cursor-pointer transition"
              />
              {thumbnailPreview && (
                <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Asset Files */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Asset Files * ({assetFiles.length} file{assetFiles.length !== 1 ? "s" : ""})
                </label>
                {assetFiles.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Total: {totalSizeMB.toFixed(2)} MB
                  </span>
                )}
              </div>

              {/* Drop zone / file picker */}
              <label
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition group"
              >
                <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Click to add files</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-400">Any file type accepted · Multiple files allowed</p>
                </div>
                <input
                  ref={assetInputRef}
                  type="file"
                  multiple
                  onChange={handleAssetFilesChange}
                  className="hidden"
                />
              </label>

              {/* File list */}
              {assetFiles.length > 0 && (
                <ul className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                  {assetFiles.map(({ file, id }, index) => (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-gray-400 shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400">
                          {formatBytes(file.size)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAsset(id)}
                          className="text-gray-400 hover:text-red-500 transition text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Upload progress bar */}
            {uploading && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={uploading || status !== "authenticated" || assetFiles.length === 0}
                className={`
                  w-full py-3 px-6 rounded-xl font-medium text-white
                  transition-all duration-200 shadow-md cursor-pointer
                  ${uploading || assetFiles.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]"
                  }
                `}
              >
                {uploading
                  ? `Uploading... ${progress}%`
                  : `Publish Collection${assetFiles.length > 0 ? ` (${assetFiles.length} file${assetFiles.length !== 1 ? "s" : ""})` : ""}`
                }
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
};
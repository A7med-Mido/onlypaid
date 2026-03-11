"use client";
import { goTo } from "@/actions/redirect";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const {data:session, status:stat} = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(()=>{if(stat === "unauthenticated") goTo("/api/auth/signin")},[stat])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("No file selected");
      return;
    }

    const MAX_SIZE_MB = 1500;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setStatus(`File too large (max ${MAX_SIZE_MB} MB)`);
      return;
    }

    setStatus("Uploading...");
    setProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          setStatus("Upload complete!");
          setUploadedUrl(data.url || data.path);
        } else {
          setStatus(`Error ${xhr.status}: ${xhr.responseText}`);
        }
      };

      xhr.onerror = () => {
        setStatus("Network / connection error");
      };

      const safeFileName = encodeURIComponent(file.name);
      xhr.open("POST", `/api/upload-raw?filename=${safeFileName}`);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.send(file);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed unexpectedly");
    }
  };

  return (
    <div className="p-8 pt-16 max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Raw Binary Upload (no FormData)
      </h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full my-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {file && (
        <p className="text-sm text-gray-600 mb-4">
          Selected: <strong className="text-gray-800">{file.name}</strong>{" "}
          <span className="text-gray-400">—</span>{" "}
          <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || progress > 0}
        className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-colors duration-200 ${
          file && !(progress > 0)
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Upload
      </button>

      {progress > 0 && progress < 100 && (
        <div className="mt-4 space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{progress}%</p>
        </div>
      )}

      {status && (
        <p className={`mt-4 text-sm font-medium ${status.includes("Error") ? "text-red-500" : "text-green-600"}`}>
          {status}
        </p>
      )}

      {uploadedUrl && (
        <p className="mt-3 text-sm text-gray-600">
          File saved at:{" "}
          <Link
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 break-all"
          >
            {uploadedUrl}
          </Link>
        </p>
      )}
    </div>
  );
};
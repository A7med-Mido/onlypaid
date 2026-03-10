// app/upload-raw/page.tsx   or   components/RawFileUploader.tsx
"use client";
import { useState } from "react";

export default function page() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadedUrl(null); // reset
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("No file selected");
      return;
    }

    const MAX_SIZE_MB = 1500; // example limit – adjust to your needs
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setStatus(`File too large (max ${MAX_SIZE_MB} MB)`);
      return;
    }

    setStatus("Uploading...");
    setProgress(0);

    try {
      const xhr = new XMLHttpRequest(); // gives nice progress events

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

      // Send filename via query param (or you could use a custom header)
      const safeFileName = encodeURIComponent(file.name);
      xhr.open("POST", `/api/upload-raw?filename=${safeFileName}`);

      // Important: do NOT set Content-Type to multipart/form-data
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.send(file);          // ← raw File/Blob
    } catch (err) {
      console.error(err);
      setStatus("Upload failed unexpectedly");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Raw Binary Upload (no FormData)</h2>

      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "block", margin: "1rem 0" }}
      />

      {file && (
        <p>
          Selected: <strong>{file.name}</strong> —{" "}
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || progress > 0}
        style={{
          padding: "0.8rem 1.5rem",
          background: file ? "#0070f3" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: file ? "pointer" : "not-allowed",
        }}
      >
        Upload
      </button>

      {progress > 0 && progress < 100 && (
        <div style={{ marginTop: "1rem" }}>
          <progress value={progress} max="100" style={{ width: "100%" }} />
          <p>{progress}%</p>
        </div>
      )}

      <p style={{ color: status.includes("Error") ? "red" : "green" }}>
        {status}
      </p>

      {uploadedUrl && (
        <p>
          File saved at:{" "}
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            {uploadedUrl}
          </a>
        </p>
      )}
    </div>
  );
}
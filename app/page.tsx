"use client"; // This is the most important line to add for Next.js

import { useState, useMemo } from "react";

export default function HomePage() {
  // State to hold the selected file objects
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [visualization, setVisualization] = useState<string | null>(null);

  // Memoize preview URLs to avoid re-generating them on every render
  const previewUrl1 = useMemo(
    () => (file1 ? URL.createObjectURL(file1) : null),
    [file1]
  );
  const previewUrl2 = useMemo(
    () => (file2 ? URL.createObjectURL(file2) : null),
    [file2]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1 || !file2) return;

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    const res = await fetch("http://localhost:8000/compute", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    alert(`Similarity Score: ${data.similarity_score}`);

    // Update your state to display
    setSimilarityScore(data.similarity_score);
    setVisualization(data.visualization);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <header>
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Image Similarity Analyzer
          </h1>
          <p className="text-center text-gray-500 mt-2">
            Upload two images to compute their semantic similarity.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageInput
              id="image1"
              label="Upload Image 1"
              file={file1}
              setFile={setFile1}
              previewUrl={previewUrl1}
            />
            <ImageInput
              id="image2"
              label="Upload Image 2"
              file={file2}
              setFile={setFile2}
              previewUrl={previewUrl2}
            />
          </div>

          <button
            type="submit"
            disabled={!file1 || !file2}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
          >
            Compute Similarity
          </button>
        </form>

        {/* --- Results Section --- */}
        <div className="pt-6 border-t border-gray-200 space-y-8">
          {/* Block 1: Score */}
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Similarity Score
            </h2>
            <div className="flex items-center justify-center h-24 bg-gray-100 rounded-md">
              {similarityScore !== null ? (
                <span className="text-gray-700 font-semibold text-2xl">
                  {similarityScore.toFixed(3)}
                </span>
              ) : (
                <span className="text-gray-400 italic">
                  Results will appear here...
                </span>
              )}
            </div>
          </div>

          {/* Block 2: Visualization */}
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Visualization
            </h2>
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md">
              {visualization ? (
                <img
                  src={visualization}
                  alt="Difference Visualization"
                  className="object-contain h-full w-full rounded-md"
                />
              ) : (
                <span className="text-gray-400 italic">
                  Visualization will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Reusable Image Input Component ---
interface ImageInputProps {
  id: string;
  label: string;
  file: File | null;
  setFile: (f: File | null) => void;
  previewUrl: string | null;
}

const ImageInput = ({
  id,
  label,
  file,
  setFile,
  previewUrl,
}: ImageInputProps) => (
  <div className="w-full">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      {previewUrl ? (
        <div className="w-full h-48 flex items-center justify-center overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="object-contain h-full w-full"
          />
        </div>
      ) : (
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={id}
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id={id}
                name={id}
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
        </div>
      )}
    </div>
    {file && (
      <button
        onClick={() => setFile(null)}
        className="mt-2 text-sm text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    )}
  </div>
);

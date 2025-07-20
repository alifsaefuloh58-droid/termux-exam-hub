import { useState } from "react";

export default function FileUploader({
  onUpload,
  label = "Pilih File",
}: {
  onUpload: (url: string) => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    onUpload(data.path); // URL hasil upload
  };

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
    </div>
  );
}

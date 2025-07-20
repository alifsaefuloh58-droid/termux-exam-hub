import { useEffect, useState } from "react";

type Result = {
  username: string;
  examTitle: string;
  score: number;
  date: string;
};

export default function ResultPanel() {
  const [results, setResults] = useState<Result[]>([]);

  const fetchResults = async () => {
    const res = await fetch("http://localhost:5000/api/results");
    const data = await res.json();
    setResults(data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Hasil Ujian</h1>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nama Siswa</th>
            <th className="p-2 border">Nama Set</th>
            <th className="p-2 border">Skor</th>
            <th className="p-2 border">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td className="p-2 border">{r.username}</td>
              <td className="p-2 border">{r.examTitle}</td>
              <td className="p-2 border">{r.score}</td>
              <td className="p-2 border">{new Date(r.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

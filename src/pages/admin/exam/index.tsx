import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type ExamSet = {
  id: string;
  title: string;
  reading: any[];
  listening: any[];
};

export default function ManageExam() {
  const [examSets, setExamSets] = useState<ExamSet[]>([]);

  const fetchExams = async () => {
    const res = await fetch("http://localhost:5000/api/exams");
    const data = await res.json();
    setExamSets(data);
  };

  const deleteExam = async (id: string) => {
    const confirmed = confirm("Yakin ingin menghapus set ini?");
    if (!confirmed) return;
    await fetch(`http://localhost:5000/api/exams/${id}`, {
      method: "DELETE",
    });
    fetchExams(); // Refresh list
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📂 Kelola Set Ujian</h1>

      <Link
        to="/admin/exam/create"
        className="bg-green-600 text-white px-4 py-2 rounded inline-block mb-4"
      >
        ➕ Buat Set Baru
      </Link>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nama Set</th>
            <th className="p-2 border">Jumlah Soal</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {examSets.map((exam) => (
            <tr key={exam.id}>
              <td className="p-2 border">{exam.title}</td>
              <td className="p-2 border">
                📘 {exam.reading.length} | 🎧 {exam.listening.length}
              </td>
              <td className="p-2 border">
                {/* Nanti bisa tambahkan tombol edit */}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteExam(exam.id)}
                >
                  🗑️ Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

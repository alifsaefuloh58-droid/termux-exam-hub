import { useNavigate } from "react-router-dom";

export default function ExamDone() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("student");
    navigate("/student/login");
  };

  const backToSelect = () => {
    navigate("/student/select");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Ujian Selesai!</h1>
      <p className="mb-6">Jawaban kamu sudah disimpan dan nilai sudah tercatat.</p>

      <div className="space-x-4">
        <button
          onClick={backToSelect}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          🔁 Kembali ke Pemilihan Ujian
        </button>
        <button
          onClick={logout}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          🚪 Keluar
        </button>
      </div>
    </div>
  );
}

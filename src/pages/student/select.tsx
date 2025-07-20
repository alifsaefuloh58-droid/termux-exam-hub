import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Exam = {
  id: string;
  title: string;
  reading: any[];
  listening: any[];
};

export default function StudentSelect() {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const student = localStorage.getItem("student");
    if (!student) navigate("/student/login");

    fetch("http://localhost:5000/api/exams")
      .then((res) => res.json())
      .then((data) => setExams(data));
  }, []);

  const startExam = (id: string) => {
    navigate(`/student/exam/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📚 Pilih Set Ujian</h1>
      {exams.length === 0 && <p>Belum ada ujian tersedia.</p>}
      <ul className="space-y-2">
        {exams.map((exam) => (
          <li key={exam.id} className="border p-3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{exam.title}</p>
                <p className="text-sm text-gray-600">
                  📘 Reading: {exam.reading.length} | 🎧 Listening: {exam.listening.length}
                </p>
              </div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => startExam(exam.id)}
              >
                Mulai
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"reading" | "listening">("reading");
  const [audioPlays, setAudioPlays] = useState<{ [key: number]: number }>({});
  const [timer, setTimer] = useState(1800); // 30 menit

  useEffect(() => {
    const student = localStorage.getItem("student");
    if (!student) return navigate("/student/login");

    fetch(`http://localhost:5000/api/exams`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((x: any) => x.id === id);
        if (!found) return alert("Ujian tidak ditemukan.");
        setExam(found);
        setAnswers(new Array(found.reading.length + found.listening.length).fill(-1));
      });

    const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQuestion =
    phase === "reading"
      ? exam?.reading[currentIndex]
      : exam?.listening[currentIndex];

  const handleAnswer = (idx: number) => {
    const offset = phase === "listening" ? exam.reading.length : 0;
    const newAns = [...answers];
    newAns[offset + currentIndex] = idx;
    setAnswers(newAns);
  };

  const next = () => {
    if (phase === "reading" && currentIndex + 1 >= exam.reading.length) {
      setPhase("listening");
      setCurrentIndex(0);
    } else if (
      phase === "listening" &&
      currentIndex + 1 >= exam.listening.length
    ) {
      finishExam();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const playAudio = () => {
    const plays = { ...audioPlays };
    plays[currentIndex] = (plays[currentIndex] || 0) + 1;
    setAudioPlays(plays);
    const audio = document.getElementById("audio") as HTMLAudioElement;
    audio.play();
  };

  const finishExam = () => {
    const offset = exam.reading.length;
    let score = 0;

    exam.reading.forEach((q: any, i: number) => {
      if (answers[i] === q.answer) score++;
    });

    exam.listening.forEach((q: any, i: number) => {
      if (answers[offset + i] === q.answer) score++;
    });

    const student = JSON.parse(localStorage.getItem("student")!);
    const result = {
      username: student.username,
      examTitle: exam.title,
      score,
      date: new Date().toISOString(),
    };

    fetch("http://localhost:5000/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });

    navigate("/student/done");
  };

  if (!exam) return <p className="p-4">🔄 Memuat soal...</p>;
  if (timer <= 0) return <>{finishExam()}</>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">
        {phase === "reading" ? "📘 Reading" : "🎧 Listening"} - Soal {currentIndex + 1}
      </h1>
      <p className="text-right text-red-500 font-mono text-sm mb-2">
        Waktu: {formatTime(timer)}
      </p>
      <div className="border p-3 mb-2">
        <p>{currentQuestion.question}</p>
        {currentQuestion.image && (
          <img src={`http://localhost:5000${currentQuestion.image}`} alt="" className="my-2 max-h-40" />
        )}
        {phase === "listening" && currentQuestion.audio && (
          <div>
            <audio id="audio" src={`http://localhost:5000${currentQuestion.audio}`} />
            <button
              className="bg-gray-700 text-white px-2 py-1 rounded"
              onClick={playAudio}
              disabled={(audioPlays[currentIndex] || 0) >= 2}
            >
              🔊 Putar Audio ({(audioPlays[currentIndex] || 0)} / 2)
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {currentQuestion.options.map((opt: any, i: number) => (
          <div key={i}>
            <button
              className={`w-full border p-2 text-left rounded ${
                answers[
                  (phase === "listening" ? exam.reading.length : 0) + currentIndex
                ] === i
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => handleAnswer(i)}
            >
              {opt.text}
              {opt.image && (
                <img
                  src={`http://localhost:5000${opt.image}`}
                  alt=""
                  className="mt-1 max-h-24"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={next}
      >
        {phase === "reading" && currentIndex + 1 >= exam.reading.length
          ? "Lanjut Listening"
          : phase === "listening" && currentIndex + 1 >= exam.listening.length
          ? "Selesai"
          : "Soal Berikutnya"}
      </button>
    </div>
  );
}

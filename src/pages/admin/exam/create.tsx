import { useState } from "react";

type Option = { text?: string; image?: string };
type Question = {
  question: string;
  image?: string;
  options: Option[];
  answer: number;
  audio?: string;
};

export default function CreateExamSet() {
  const [title, setTitle] = useState("");
  const [reading, setReading] = useState<Question[]>(
    Array(20).fill({
      question: "",
      options: Array(4).fill({ text: "", image: "" }),
      answer: 0,
    })
  );
  const [listening, setListening] = useState<Question[]>(
    Array(20).fill({
      question: "",
      options: Array(4).fill({ text: "", image: "" }),
      answer: 0,
    })
  );

  const handleUpload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    return data.path;
  };

  const updateQuestion = (
    type: "reading" | "listening",
    index: number,
    field: keyof Question,
    value: any
  ) => {
    const target = type === "reading" ? [...reading] : [...listening];
    target[index][field] = value;
    type === "reading" ? setReading(target) : setListening(target);
  };

  const updateOption = (
    type: "reading" | "listening",
    qIdx: number,
    optIdx: number,
    value: string,
    field: "text" | "image"
  ) => {
    const target = type === "reading" ? [...reading] : [...listening];
    target[qIdx].options[optIdx][field] = value;
    type === "reading" ? setReading(target) : setListening(target);
  };

  const handleSaveExam = async () => {
    if (reading.length !== 20 || listening.length !== 20) {
      return alert("Soal belum lengkap! Harus 20 Reading dan 20 Listening.");
    }

    const payload = {
      title,
      reading,
      listening,
    };

    const res = await fetch("http://localhost:5000/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("✅ Ujian berhasil disimpan!");
      setReading([]);
      setListening([]);
      setTitle("");
    } else {
      alert("❌ Gagal menyimpan ujian.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">📝 Buat Set Ujian</h1>
      <input
        placeholder="Nama Set Ujian"
        className="border w-full p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <h2 className="text-xl font-semibold">📘 Soal Reading</h2>
      {reading.map((q, i) => (
        <div key={i} className="border p-3 mb-4">
          <p className="font-bold mb-1">Soal {i + 1}</p>

          <textarea
            placeholder="Pertanyaan"
            className="w-full border mb-2 p-1"
            value={q.question}
            onChange={(e) =>
              updateQuestion("reading", i, "question", e.target.value)
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const url = await handleUpload(e.target.files![0]);
              updateQuestion("reading", i, "image", url);
            }}
          />
          {q.image && (
            <img
              src={`http://localhost:5000${q.image}`}
              className="max-h-24 mt-2"
              alt="Soal Reading"
            />
          )}

          {q.options.map((opt, j) => (
            <div key={j} className="flex flex-col mb-2">
              <input
                className="w-full border p-1"
                placeholder={`Jawaban ${j + 1}`}
                value={opt.text}
                onChange={(e) =>
                  updateOption("reading", i, j, e.target.value, "text")
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const url = await handleUpload(e.target.files![0]);
                  updateOption("reading", i, j, url, "image");
                }}
              />
              {opt.image && (
                <img
                  src={`http://localhost:5000${opt.image}`}
                  className="max-h-20 mt-1"
                  alt="Opsi Gambar"
                />
              )}
            </div>
          ))}

          <select
            value={q.answer}
            onChange={(e) =>
              updateQuestion("reading", i, "answer", parseInt(e.target.value))
            }
          >
            {[0, 1, 2, 3].map((v) => (
              <option key={v} value={v}>
                Jawaban Benar: Pilihan {v + 1}
              </option>
            ))}
          </select>
        </div>
      ))}

      <h2 className="text-xl font-semibold">🎧 Soal Listening</h2>
      {listening.map((q, i) => (
        <div key={i} className="border p-3 mb-4">
          <p className="font-bold mb-1">Soal {i + 1}</p>

          <textarea
            placeholder="Pertanyaan"
            className="w-full border mb-2 p-1"
            value={q.question}
            onChange={(e) =>
              updateQuestion("listening", i, "question", e.target.value)
            }
          />

          <input
            type="file"
            accept="audio/*"
            onChange={async (e) => {
              const url = await handleUpload(e.target.files![0]);
              updateQuestion("listening", i, "audio", url);
            }}
          />
          {q.audio && (
            <audio controls className="mt-2">
              <source src={`http://localhost:5000${q.audio}`} />
            </audio>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const url = await handleUpload(e.target.files![0]);
              updateQuestion("listening", i, "image", url);
            }}
          />
          {q.image && (
            <img
              src={`http://localhost:5000${q.image}`}
              className="max-h-24 mt-2"
              alt="Soal Listening"
            />
          )}

          {q.options.map((opt, j) => (
            <div key={j} className="flex flex-col mb-2">
              <input
                className="w-full border p-1"
                placeholder={`Jawaban ${j + 1}`}
                value={opt.text}
                onChange={(e) =>
                  updateOption("listening", i, j, e.target.value, "text")
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const url = await handleUpload(e.target.files![0]);
                  updateOption("listening", i, j, url, "image");
                }}
              />
              {opt.image && (
                <img
                  src={`http://localhost:5000${opt.image}`}
                  className="max-h-20 mt-1"
                  alt="Opsi Gambar"
                />
              )}
            </div>
          ))}

          <select
            value={q.answer}
            onChange={(e) =>
              updateQuestion("listening", i, "answer", parseInt(e.target.value))
            }
          >
            {[0, 1, 2, 3].map((v) => (
              <option key={v} value={v}>
                Jawaban Benar: Pilihan {v + 1}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSaveExam}
      >
        💾 Simpan Set Soal
      </button>
    </div>
  );
}

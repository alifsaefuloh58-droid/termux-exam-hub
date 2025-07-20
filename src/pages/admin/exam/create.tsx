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
  const [reading, setReading] = useState<Question[]>(Array(20).fill({
    question: "",
    options: Array(4).fill({ text: "" }),
    answer: 0
  }));
  const [listening, setListening] = useState<Question[]>(Array(20).fill({
    question: "",
    options: Array(4).fill({ text: "" }),
    answer: 0
  }));

  const handleUpload = async (file: File, type: "images" | "audio") => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`http://localhost:5000/api/upload/${type}`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async () => {
    const payload = { title, reading, listening };
    const res = await fetch("http://localhost:5000/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) alert("Set soal berhasil disimpan!");
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
    value: string
  ) => {
    const target = type === "reading" ? [...reading] : [...listening];
    target[qIdx].options[optIdx].text = value;
    type === "reading" ? setReading(target) : setListening(target);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">📝 Buat Set Ujian</h1>
      <input
        placeholder="Nama Set Ujian"
        className="border w-full p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <h2 className="text-xl mt-6 font-semibold">📘 Soal Reading</h2>
      {reading.map((q, i) => (
        <div key={i} className="border p-3 mb-4">
          <p className="font-bold mb-1">Soal {i + 1}</p>
          <textarea
            placeholder="Pertanyaan"
            className="w-full border mb-2 p-1"
            value={q.question}
            onChange={(e) => updateQuestion("reading", i, "question", e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const url = await handleUpload(e.target.files![0], "images");
              updateQuestion("reading", i, "image", url);
            }}
          />
          {q.options.map((opt, j) => (
            <input
              key={j}
              className="w-full border p-1 my-1"
              placeholder={`Jawaban ${j + 1}`}
              value={opt.text}
              onChange={(e) => updateOption("reading", i, j, e.target.value)}
            />
          ))}
          <select
            value={q.answer}
            onChange={(e) => updateQuestion("reading", i, "answer", parseInt(e.target.value))}
          >
            {[0, 1, 2, 3].map((v) => (
              <option key={v} value={v}>
                Jawaban Benar: Pilihan {v + 1}
              </option>
            ))}
          </select>
        </div>
      ))}

      <h2 className="text-xl mt-6 font-semibold">🎧 Soal Listening</h2>
      {listening.map((q, i) => (
        <div key={i} className="border p-3 mb-4">
          <p className="font-bold mb-1">Soal {i + 1}</p>
          <textarea
            placeholder="Pertanyaan"
            className="w-full border mb-2 p-1"
            value={q.question}
            onChange={(e) => updateQuestion("listening", i, "question", e.target.value)}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={async (e) => {
              const url = await handleUpload(e.target.files![0], "audio");
              updateQuestion("listening", i, "audio", url);
            }}
          />
          {q.options.map((opt, j) => (
            <input
              key={j}
              className="w-full border p-1 my-1"
              placeholder={`Jawaban ${j + 1}`}
              value={opt.text}
              onChange={(e) => updateOption("listening", i, j, e.target.value)}
            />
          ))}
          <select
            value={q.answer}
            onChange={(e) => updateQuestion("listening", i, "answer", parseInt(e.target.value))}
          >
            {[0, 1, 2, 3].map((v) => (
              <option key={v} value={v}>
                Jawaban Benar: Pilihan {v + 1}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
        💾 Simpan Set Soal
      </button>
    </div>
  );
}

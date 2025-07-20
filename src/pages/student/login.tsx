import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/students");
    const students = await res.json();
    const found = students.find((s: any) => s.username === username && s.password === password);
    if (found) {
      localStorage.setItem("student", JSON.stringify(found));
      navigate("/student/select");
    } else {
      alert("Login gagal. Username atau password salah.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">👨‍🎓 Login Siswa</h1>
      <input
        placeholder="Username"
        className="border p-2 mb-2 w-full"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-4 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleLogin}
      >
        Masuk
      </button>
    </div>
  );
}

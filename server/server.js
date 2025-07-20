const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const readData = (file) => JSON.parse(fs.readFileSync(file, "utf-8"));
const writeData = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Routes - STUDENTS
app.get("/api/students", (req, res) => {
  res.json(readData("students.json"));
});
app.post("/api/students", (req, res) => {
  const students = readData("students.json");
  students.push(req.body);
  writeData("students.json", students);
  res.json({ success: true });
});

// Routes - EXAMS
app.get("/api/exams", (req, res) => {
  res.json(readData("exams.json"));
});
app.post("/api/exams", (req, res) => {
  const exams = readData("exams.json");
  exams.push({ id: Date.now().toString(), ...req.body });
  writeData("exams.json", exams);
  res.json({ success: true });
});
app.delete("/api/exams/:id", (req, res) => {
  let exams = readData("exams.json");
  exams = exams.filter((e) => e.id !== req.params.id);
  writeData("exams.json", exams);
  res.json({ success: true });
});

// Routes - RESULTS
app.get("/api/results", (req, res) => {
  res.json(readData("results.json"));
});
app.post("/api/results", (req, res) => {
  const results = readData("results.json");
  results.push(req.body);
  writeData("results.json", results);
  res.json({ success: true });
});

// Upload gambar & audio
const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith("audio/")
      ? "uploads/audio"
      : "uploads/images";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: imgStorage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.json({ path: `/uploads/${req.file.mimetype.startsWith("audio/") ? "audio" : "images"}/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`🟢 Server listening on http://localhost:${port}`);
});

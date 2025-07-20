from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, json, uuid

app = Flask(__name__)
CORS(app)

DATA_DIR = "./data"
STATIC_DIR = "./static"

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(f"{STATIC_DIR}/images", exist_ok=True)
os.makedirs(f"{STATIC_DIR}/audio", exist_ok=True)

def load_json(file):
    try:
        with open(f"{DATA_DIR}/{file}", "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []

def save_json(file, data):
    with open(f"{DATA_DIR}/{file}", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ==== Exam Routes ====
@app.route("/api/exams", methods=["GET"])
def get_exams():
    return jsonify(load_json("exams.json"))

@app.route("/api/exams", methods=["POST"])
def create_exam():
    data = request.json
    data["id"] = str(uuid.uuid4())
    exams = load_json("exams.json")
    exams.append(data)
    save_json("exams.json", exams)
    return jsonify({"message": "Exam set created", "id": data["id"]})

@app.route("/api/exams/<id>", methods=["PUT"])
def update_exam(id):
    exams = load_json("exams.json")
    for i, exam in enumerate(exams):
        if exam["id"] == id:
            exams[i] = request.json
            exams[i]["id"] = id
            save_json("exams.json", exams)
            return jsonify({"message": "Updated"})
    return jsonify({"error": "Not found"}), 404

@app.route("/api/exams/<id>", methods=["DELETE"])
def delete_exam(id):
    exams = load_json("exams.json")
    exams = [e for e in exams if e["id"] != id]
    save_json("exams.json", exams)
    return jsonify({"message": "Deleted"})

# ==== Students ====
@app.route("/api/students", methods=["GET"])
def get_students():
    return jsonify(load_json("students.json"))

@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.json
    students = load_json("students.json")
    students.append(data)
    save_json("students.json", students)
    return jsonify({"message": "Student added"})

# ==== Results ====
@app.route("/api/results", methods=["GET"])
def get_results():
    return jsonify(load_json("results.json"))

@app.route("/api/results", methods=["POST"])
def add_result():
    data = request.json
    results = load_json("results.json")
    results.append(data)
    save_json("results.json", results)
    return jsonify({"message": "Result recorded"})

# ==== Upload Gambar / Audio ====
@app.route("/api/upload/<media_type>", methods=["POST"])
def upload_file(media_type):
    if media_type not in ["images", "audio"]:
        return jsonify({"error": "Invalid type"}), 400
    file = request.files["file"]
    filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[-1]
    path = os.path.join(STATIC_DIR, media_type, filename)
    file.save(path)
    return jsonify({"filename": filename, "url": f"/static/{media_type}/{filename}"})

@app.route("/static/<media_type>/<filename>")
def serve_static(media_type, filename):
    return send_from_directory(f"{STATIC_DIR}/{media_type}", filename)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

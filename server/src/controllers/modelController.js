const path = require("path");
const fs = require("fs");
const pool = require("../../middleware/db");

// 모델생성을 위한 노래 따라 부르기
exports.sample = async (req, res) => {
    try {
        const { music_id } = req.params;
        const music_info = await pool.query(
            "select * from MUSIC where id = ?",
            [music_id]
        );
        const music_name = music_info[0][0].music_name;
        const filePath = path.join(
            __dirname,
            `../../data/samples/${music_name}.wav`
        );
        fs.readFile(filePath, (error, data) => {
            if (error) {
                res.status(500).send("Failed to retrieve audio file");
                return;
            }
            res.setHeader("Content-Type", "audio/wav");
            res.setHeader("Content-Length", data.length);
            res.setHeader("Content-Disposition", "inline;");
            res.end(data);
        });
    } catch (err) {
        console.log("sampleError", err);
    }
};

// 음성 데이터 업로드
exports.uploadData = async (req, res) => {
    res.render("uploadForm");
};

// 음성 데이터 Buffer 변환 후 DB 저장
exports.audioToBuffer = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No audio file provided.");
        }

        const destinationPath = path.join(
            __dirname,
            "../../data/uploads",
            req.file.originalname
        );
        const uploadDir = path.join(__dirname, "../../data/uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        fs.renameSync(req.file.path, destinationPath);

        const buffer = await readFileToBuffer(req.file.path);
        await pool.query(
            "insert into MAKE_MODEL(user_id, voice_data) values (?,?)",
            ["홍길동", buffer]
        );
        fs.unlink(destinationPath);
        res.status(200).send("File uploaded and saved successfully!");
    } catch (err) {
        console.error("Upload failed:", err);
        res.status(500).send("Failed to process audio file upload.");
    }
};

// 음성 데이터 Buffer 변환 함수
function readFileToBuffer(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

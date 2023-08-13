const path = require("path");
const fs = require("fs");
const pool = require("../../middleware/db");

// 재생 가능 플레이 리스트 조회
exports.playList = (req, res) => {
    try {
        const uploadDir = path.join(__dirname, "../.././data/", "uploads");
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                return res.status(500).send("플레이리스트 조회 실패");
            }
            res.json({ files });
        });
    } catch (err) {
        res.status(500).send("플레이리스트 조회 실패");
    }
};

// 음악 재생
exports.play = async (req, res) => {
    try {
        const { music_id } = req.params;
        const music_info = await pool.query(
            "select * from CUSTOM_MUSIC where id = ?",
            [music_id]
        );
        const music_name = music_info[0][0].music_name;
        const music_singer = music_info[0][0].music_singer;

        const filePath = path.join(
            __dirname,
            `../../data/downloads/${music_name}_${music_singer}.wav`
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
        res.status(500).send("Failed to retrieve audio file");
    }
};

// 커스텀 음악 생성
exports.makeCustom = async (req, res) => {
    try {
        const { user_id, music_name } = req.body;
        console.log(user_id, music_name);

        const music_info = await pool.query(
            "select music_lyrics, music_image_path from MUSIC where music_name = ?",
            [music_name]
        );
        await pool.query(
            "insert into CUSTOM_MUSIC (music_name, music_singer, music_lyrics, music_image_path) values (?,?,?,?)",
            [
                music_name,
                user_id,
                music_info[0][0].music_lyrics,
                music_info[0][0].music_image_path,
            ]
        );
        res.send("제작합니다");
    } catch (err) {
        console.log(err);
    }
};

// 생성 커스텀 음악 다운
exports.getCustomMusic = async (req, res) => {
    try {
        const buffer_info = await pool.query(
            "select * from CUSTOM_MUSIC where isIt = 'Y' and print_isIt = 'N' limit 1"
        );
        console.log(buffer_info[0][0]);
        const buffer = buffer_info[0][0].music_data;
        const musicName = buffer_info[0][0].music_name;
        const musicSinger = buffer_info[0][0].music_singer;
        const fileDir = `C:/Users/schxo/Desktop/ict_hackaton/ict_hackaton/data/downloads/${musicName}_${musicSinger}.wav`;
        fs.writeFile(fileDir, buffer, (err) => {
            if (err) {
                console.log("에러", err);
            } else {
                console.log("데이터 저장");
            }
        });
        await pool.query(
            "update CUSTOM_MUSIC set print_isIt = 'Y' where isIt = 'Y'"
        );
        res.send("다운 완료");
    } catch (err) {
        console.log("madeMusci", err);
    }
};

// exports.readUpload = async (req, res) => {
//     try {
//         const result = await pool.query(
//             "select * from MAKE_MODEL where user_id = '홍길동'"
//         );
//         res.send(result[0][0]);
//     } catch (error) {
//         console.log("readUploadError", error);
//     }
// };

// exports.bufferToAudio = async (req, res) => {
//     try {
//         const buffer = await pool.query(
//             "select * from MAKE_MODEL where user_id = '홍길동'"
//         );
//         const audioBuffer = buffer[0][0].voice_data;
//         res.send(audioBuffer);
//         const filename = "John Doe";
//         const outputDirectory = path.join(
//             __dirname,
//             "../../data/",
//             "downloads"
//         );
//         const outputFile = path.join(outputDirectory, `${filename}.wav`);
//         fs.writeFile(outputFile, audioBuffer, (err) => {
//             if (err) {
//                 console.error("Failed to write audio file:", err);
//             } else {
//                 console.log("Audio file created successfully:", outputFile);
//             }
//         });
//     } catch (error) {
//         console.log("bufferToAudioError", error);
//     }
// };

// exports.audioToBuffer = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send("No audio file provided.");
//         }

//         const destinationPath = path.join(
//             __dirname,
//             "../../data/uploads",
//             req.file.originalname
//         );
//         const uploadDir = path.join(__dirname, "../../data/uploads");

//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir);
//         }

//         fs.renameSync(req.file.path, destinationPath);

//         const buffer = await readFileToBuffer(req.file.path);
//         await pool.query(
//             "insert into MAKE_MODEL(user_id, voice_data) values (?,?)",
//             ["홍길동", buffer]
//         );

//         res.status(200).send("File uploaded and saved successfully!");
//     } catch (err) {
//         console.error("Upload failed:", err);
//         res.status(500).send("Failed to process audio file upload.");
//     }
// };

// function readFileToBuffer(filePath) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(filePath, (err, data) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }

//             resolve(data);
//         });
//     });
// }

// exports.uploadData = async (req, res) => {
//     res.render("uploadForm");
// };

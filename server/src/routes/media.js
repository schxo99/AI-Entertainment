const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, "../.././data/uploads"));
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

// router.get("/upload", mediaController.uploadData);
// router.post("/", upload.single("audioFile"), mediaController.audioToBuffer);
// router.get("/readUpload", mediaController.readUpload);
// router.get("/bufferToAudio", mediaController.bufferToAudio);

// 플레이리스트 조회
router.get("/playList", mediaController.playList);
// 음악재생
router.get("/play/:music_id", mediaController.play);
// 커스텀 음악 생성
router.post("/makeCustom", mediaController.makeCustom);
// 생성 커스텀 음악 다운
router.get("/getCustomMusic", mediaController.getCustomMusic);

module.exports = router;

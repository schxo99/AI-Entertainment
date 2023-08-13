var express = require("express");
var router = express.Router();
const modelController = require("../controllers/modelController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../.././data/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// 모델생성을 위한 노래 따라 부르기
router.get("/sample/:music_id", modelController.sample);
// 음성 데이터 업로드
router.get("/upload", modelController.uploadData);
// 음성 데이터 Buffer 변환 후 DB 저장
router.post("/", upload.single("audioFile"), modelController.audioToBuffer);

module.exports = router;

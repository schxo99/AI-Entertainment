var express = require("express");
var router = express.Router();
const indexController = require("../controllers/indexController");

// 목소리 녹음에 사용할 노래검색
router.get("/search/:music_id", indexController.search);

// 재생 가능한 커스텀 노래 전체 검색
router.get("/music", indexController.music);
module.exports = router;

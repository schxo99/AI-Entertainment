const pool = require("../../middleware/db");

// 목소리 녹음에 사용할 노래검색
exports.search = async (req, res) => {
    try {
        const { music_id } = req.params;
        console.log(id);
        const search_result = await pool.query(
            `select * from MUSIC where music_name like '%${music_id}%'`
        );
        res.json(search_result[0]);
    } catch (error) {
        console.log("signUpError", error);
        res.json([]);
    }
};

// 재생 가능한 커스텀 노래 전체 검색
exports.music = async (req, res) => {
    try {
        const custom_music_info = await pool.query(
            "select id, music_name, music_singer, music_lyrics, music_image_path, public, report from CUSTOM_MUSIC where public = 'Y' and report = 'N'"
        );
        res.json(custom_music_info[0]);
    } catch (err) {
        console.log("musicError", err);
    }
};

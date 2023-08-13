const pool = require("../../middleware/db");

exports.signUp = async (req, res) => {
    try {
        const { user_id, user_pw, user_name, user_gender } = req.body;
        console.log(user_id, user_pw, user_name);
        const insert_user_info = await pool.query(
            "insert into USER(user_id, user_pw, user_name, user_gender) values (?,?,?,?)",
            [user_id, user_pw, user_name, user_gender]
        );
        res.send("회원가입이 완료되었습니다.");
    } catch (error) {
        console.log("signUpError", error);
        res.send("가입 실패");
    }
};

exports.signIn = async (req, res) => {
    try {
        const { user_id, user_pw } = req.body;
        const user_info = await pool.query(
            "select * from USER where user_id = ?",
            [user_id]
        );
        res.json(user_info[0]);
    } catch (err) {
        console.log(err);
    }
};

exports.myMusic = async (req, res) => {
    try {
        const { user_id } = req.params;
        const myMusic_info = await pool.query(
            "select id, music_name, music_singer, music_lyrics, music_image_path, public, report from CUSTOM_MUSIC where music_singer = ?",
            [user_id]
        );
        res.json(myMusic_info[0]);
    } catch (err) {
        console.log("myMusicError", err);
    }
};

exports.publicMusic = async (req, res) => {
    try {
        const { public, music_id } = req.body;
        if (public === "Y") {
            await pool.query(
                "update CUSTOM_MUSIC set public = 'Y' where id = ?",
                [music_id]
            );
        } else if (public === "N") {
            await pool.query(
                "update CUSTOM_MUSIC set public = 'N' where id = ?",
                [music_id]
            );
        }
        res.send("변경완료");
    } catch (err) {
        console.log("publicMusicError", err);
    }
};

const express = require('express');
const path = require('path')
const fs = require('fs').promises
const fss = require('fs')
const yaml = require('js-yaml')
const { spawn } = require('child_process');
const router = express.Router();
const pool = require("../middleware/db");
const ffmpeg = require('fluent-ffmpeg');


router.get('/custom', async(req,res) => {
  try{
    console.log("시작")
    const custom_info = await pool.query("select * from CUSTOM_MUSIC where isIt = 'N' LIMIT 1");
    console.log('1 정보조회', custom_info[0])
    const pythonFilePath = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/infer.py';
    const musicName = custom_info[0][0].music_name;
    const singerName = custom_info[0][0].music_singer;
    console.log(musicName, singerName)
    const singer_gender = (await pool.query("select user_gender from USER where user_id = ?", [singerName]))[0][0].user_gender
    const vocal_gender = (await pool.query("select vocal_gender from MUSIC where music_name = ?", [musicName]))[0][0].vocal_gender
    console.log(singer_gender, vocal_gender)
    await edit_infer_info(pythonFilePath, singerName, musicName)
    await edit_infer_key(pythonFilePath, singer_gender, vocal_gender)
    await do_batchFile(musicName, singerName)
    res.send("가조")
  }catch(err){
    console.log(err)
  }
})

// infer.py 음악파일 및 사용자 이름 변경 함수
async function edit_infer_info(pythonFilePath, singerName, musicName) {
  try {
    const data = await fs.readFile(pythonFilePath, 'utf8');
    const updatedContent = data
      .replace(/project_name\s*=\s*"[^"]*"/, `project_name="${singerName}"`)
      .replace(/file_names\s*=\s*\[[^\]]*\]/, `file_names = ["${musicName}"]`);
    await fs.writeFile(pythonFilePath, updatedContent, 'utf8');
    console.log('infer.py 정보변경완료');
  } catch (err) {
    console.error(`edit_infer_infoError: ${err.message}`);
  }
}

// infer.py의 키 변경 함수
async function edit_infer_key(pythonFilePath, singer_gender, vocal_gender){
  let trans
  if (singer_gender === 'w' && vocal_gender === 'm') {
    trans = [3];
  } else if (singer_gender === 'm' && vocal_gender === 'w') {
    trans = [-3];
  } else {
    trans = [0];
  }
  try {
    const data = await fs.readFile(pythonFilePath, 'utf8');
    const updatedContent = data.replace(/trans\s*=\s*\[[^\]]*\]/, `trans = [${trans}]`);
    await fs.writeFile(pythonFilePath, updatedContent, 'utf8');
    console.log('infer.py 키 변경완료');
  } catch (err) {
    console.error(`edit_infer_keyError: ${err.message}`);
  }
}

// 커스텀 음악 생성 함수
async function do_batchFile(musicName, singerName){
    const batchFilePath = 'C:\\Users\\me\\Desktop\\diff-svc\\diff-svc-main\\bats\\custom_music.bat';
    const batProcess = spawn('cmd.exe', ['/K', batchFilePath], { shell: true, stdio: 'inherit' }); 
    batProcess.on('error', (err) => {
    console.error(`do_batchFileError: ${err.message}`);
    });
    batProcess.on('exit', (code) => {
      console.log(`배치파일 종료 ${code}`);
      flacToWav(musicName, singerName)
    });
}

// 확장자 변경 함수
async function flacToWav(musicName, singerName) {
  const directoryPath = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/results';
  try {
    const files = await fs.readdir(directoryPath); // fs.readdir의 결과를 기다려서 파일 목록을 얻습니다.
    const flacFile = files.find(file => path.extname(file).toLowerCase() === '.flac');
    if (!flacFile) {
      console.log('디렉토리에서 FLAC 파일을 찾을 수 없습니다.');
      return;
    }
    const inputFilePath = path.join(directoryPath, flacFile);
    const outputFilePath = path.join(directoryPath, `${musicName}_${singerName}.flac`);
    fs.rename(inputFilePath, outputFilePath)

    await vocal_music_hap(outputFilePath, musicName, singerName);
  } catch (err) {
    console.error('디렉토리 읽기 오류:', err);
  }
}

// 보컬 음원 합성 함수
async function vocal_music_hap(outputFilePath, musicName, singerName) {
  const music_path = `C:/Users/me/Desktop/diff-svc/diff-svc-main/raw_music/${musicName}.wav`;
  const output_path = `C:/Users/me/Desktop/diff-svc/diff-svc-main/result_music/${musicName}_${singerName}.wav`;
  try {
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(outputFilePath)
        .input(music_path)
        .complexFilter([
          {
            filter: 'amix',
            options: {
              inputs: 2,
              duration: 'longest',
            },
          },
        ])
        .audioCodec('pcm_s16le')
        // .audioCodec('flac')
        .on('end', () => {
          console.log('결합이 완료되었습니다.');
          resolve();
        })
        .on('error', (err) => {
          console.error('오류:', err);
          reject(err);
        })
        .save(output_path);
    });
    await fs.unlink(outputFilePath);
    console.log("result 삭제 완료");
    const buffer = fss.readFileSync(output_path);
    await pool.query("update CUSTOM_MUSIC set music_data = ?, isIt = 'Y' where music_name = ? and music_singer = ?", [buffer, musicName, singerName])
    console.log('db 저장 완료')
  } catch (err) {
    console.error('오류:', err);
  }
}

// 버퍼 변환 후 DB 저장
router.get("/buffer", async(req,res) =>{
  try{
    console.log('buffer 싲작')
    const output_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/result_music/해요_b4.mp3'
    const audioBuffer = fss.readFileSync(output_path);
    console.log(audioBuffer)
    await pool.query("update CUSTOM_MUSIC set (music_data = ?, isIt = 'Y') where music_name = '해요' and music_singer = 'b4'", [audioBuffer])
    res.send("완")
  }catch(err){
    console.log('buffer', err)
  }
})


// router.get('/keys', async (req, res) => {
//   try {
//     const inputFile = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/raw_music/ETA.mp3';
//     const outputFile = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/raw_music_keyExchange/ETA.mp3';
//     const pitchShift = 2;

//     // 피치 변환을 기반으로 템포 계수 계산
//     const tempoFactor = Math.pow(2, pitchShift / 12);

//     ffmpeg(inputFile)
//       .audioFilter(`asetrate=44100*${tempoFactor},aresample=44100`)
//       .audioCodec('libmp3lame')
//       .outputOptions('-write_xing 0') // 선택 사항: Xing 헤더 제거
//       .output(outputFile)
//       .on('end', () => {
//         console.log('음 높이 변경 및 템포 유지 완료.');
//         res.send('음 높이 변경 및 템포 유지 완료.');
//       })
//       .on('error', (err) => {
//         console.error('오류:', err);
//         res.status(500).send('오류: ' + err.message);
//       })
//       .run();
//   } catch (err) {
//     console.log('에러', err);
//     res.send(err);
//   }
// });

router.get('/keys', async (req, res) => {
  try {
    


    res.send("pitch 조절 완료")

  } catch (err) {
    console.log('에러', err);
    res.send(err);
  }
});



module.exports = router;

const express = require('express');
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const { spawn } = require('child_process');
const router = express.Router();
const pool = require("../middleware/db");


// 음성모델 생성 자동화
router.get('/', async (req,res) =>{
  try{
    // 데이터 저장 및 결과 디렉토리 생성
    const buffer_info = await pool.query("SELECT * FROM MAKE_MODEL WHERE voice_model_isit = 'N' LIMIT 1;")
    const buffer = buffer_info[0][0].voice_data
    const user_id = buffer_info[0][0].user_id
    await pool.query("update MAKE_MODEL set voice_model_isit = 'Y' where user_id = ?", [user_id])
    const preprocess_dir = path.join(__dirname, "../../diff-svc-main/preprocess")
    const checkpoints_dir = path.join(__dirname, `../../diff-svc-main/checkpoints/${user_id}`)
    if(!fs.existsSync(checkpoints_dir)){
      fs.mkdirSync(checkpoints_dir);
    }
    const filDir = path.join(preprocess_dir, `${user_id}.wav`)
    fs.writeFile(filDir, buffer, (err) => {
      if(err){
        console.log('에러', err)
      } else {
        console.log('데이터 저장')
      }
    })

    // yaml 수정
    const filePath = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/training/config_nsf.yaml'
    const newWorkDirValue = `checkpoints/${user_id}`
    updateYamlWorkDir(filePath, newWorkDirValue)

    
    // diff-svc 작업시작
    const batchFilePath = 'C:\\Users\\me\\Desktop\\diff-svc\\diff-svc-main\\bats\\make_model.bat';
    const batProcess = spawn('cmd.exe', ['/K', batchFilePath], { shell: true, stdio: 'inherit' }); 
    batProcess.on('error', (err) => {
    console.error(`Error executing the batch file: ${err.message}`);
    });
    batProcess.on('exit', (code) => {
      console.log(`Batch file exited with code ${code}`);
    });

    // 생성된 폴더들 초기화
    // const folderPath = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/preprocess';
    // const binary_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/binary/test';
    // const data_test_final_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/test/final'
    // const data_test_norm_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/test/norm'
    // const data_test_voice_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/test/voice';
    // await deleteFilesInFolder(folderPath)
    // await deleteFilesInFolder(binary_path)
    // await deleteFilesInFolder(data_test_final_path)
    // await deleteFilesInFolder(data_test_norm_path)
    // await deleteFilesInFolder(data_test_voice_path)

    res.send("됩니당")
  }catch(error){
    console.log('modelError', error)
    res.send("에러에용")
  }
});

// 사용한 데이터 삭제함수
async function deleteFilesInFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder contents:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deletion completed:', filePath);
      });
    });
  });
}

// config_nsf.yaml 수정 함수
async function updateYamlWorkDir(filePath, newWorkDirValue) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    try {
      const yamlData = yaml.load(data);
      yamlData.work_dir = newWorkDirValue;
      const newYamlContent = yaml.dump(yamlData);
      fs.writeFile(filePath, newYamlContent, 'utf8', (err) => {
        if (err) {
          console.error('yaml 수정 오류:', err);
          return;
        }
        console.log('yaml 수정 완료');
      });
    } catch (e) {
      console.error('yaml 오류:', e);
    }
  });
}

// checkpoints 사용자 모델 경로 생성
router.get('/move', async(req,res) => {
  try{
    const user_id = 'user1';
    const oldFolderPath = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/checkpoints/test';
    const newFolderPath = `C:/Users/me/Desktop/diff-svc/diff-svc-main/checkpoints/${user_id}`;

    fs.rename(oldFolderPath, newFolderPath, (err) => {
      if(err){
        console.log(err)
      }
      else{
        fs.mkdirSync(oldFolderPath);
      }
    })
    res.send("됩니당")
      }catch(error){
    console.log(error)
  }
})

// bat 파일 실행 
router.get('/test', async(req,res) => {
  try{
    const batchFilePath = 'C:\\Users\\me\\Desktop\\diff-svc\\diff-svc-main\\bats\\make_model.bat';
    const batProcess = spawn('cmd.exe', ['/K', batchFilePath], { shell: true, stdio: 'inherit' }); 

    batProcess.on('error', (err) => {
    console.error(`Error executing the batch file: ${err.message}`);
    });
    batProcess.on('exit', (code) => {
      console.log(`Batch file exited with code ${code}`);
    });
  }catch(err){
    console.log(err)
  }
})

// 생성된 파일들 삭제
router.get('/del', async(req,res) => {
  try{
    const folderPath = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/preprocess';
    const binary_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/binary/test';
    const data_test_final_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/test/final'
    const data_test_norm_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/test/norm'
    const data_test_voice_path = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/data/test/voice';
    await deleteFilesInFolder(folderPath)
    await deleteFilesInFolder(binary_path)
    await deleteFilesInFolder(data_test_final_path)
    await deleteFilesInFolder(data_test_norm_path)
    await deleteFilesInFolder(data_test_voice_path)
    res.send("삭제완료")
  }catch(err){
    console.log(err)
  }
})

// yaml 수정
router.get('/yaml', async(req,res) => {
  try{
    const user_id = 'user1'
    const filePath = 'C:/Users/me/Desktop/diff-svc/diff-svc-main/training/config_nsf.yaml'
    const newWorkDirValue = `checkpoints/${user_id}`
    
    updateYamlWorkDir(filePath, newWorkDirValue)
  }catch(err){
    console.log(err)
  }
})

module.exports = router;

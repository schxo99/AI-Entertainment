#### 앱 이름: AI-Entertainment

#### 아이디어 배경
#### ● 개인 창작 콘텐츠 수요 증가
#### ● 독창적인 경험을 추구하는 사용자 니즈
#### ● 대중들의 선호 트렌드 적용

#### 프로젝트 목표 : 음성모델을 통하여 내가 좋아하는 가수가 다른 노래를 커버를 하고 사용자 개개인의 음성모델을 사용하여 진입장벽이 높은 팝송이나 힙합을 불러보자.

<div align = "center"> 
  <br>
    <h4>시스템 구성도</h4>
    <img style="float: left;" src="https://github.com/schxo99/AI-Entertainment/blob/main/image/a.PNG" width="700" height="auto"/>
  </br>
  <br>
    <h4>웹 앱 UI</h4>
    <img style="float: left;" src="https://github.com/schxo99/AI-Entertainment/blob/main/image/c.PNG" width="700" height="auto"/>
    <img style="float: left;" src="https://github.com/schxo99/AI-Entertainment/blob/main/image/m.PNG" width="700" height="auto"/>
  </br>
</div>

#### 커스텀 음성 모델 생성
1. 클라이언트로부터 음성데이터 만들기 요청이 들어오면 mr 제공 및 녹음 후 파일을 서버로 보내고 서버에서 음성데이터를 buffer로 변환 후 데이터베이스에 저장.
2. DB에 음성데이터가 들어오면 로컬서버에서 buffer를 음성데이터로 변환 후 배치파을을 실행하여 음성 모델 생성.

#### 커스텀 노래 생성
클라이언트로부터 모델과 노래 선택 시 DB에 저장이 되고, DB저장 시 로컬서버에서 배치파일을 실행하여 커스텀 음악 생성 후, buffer로 변환하여 DB에 저장 및 배포 서버에 저장.


<!DOCTYPE html>
<html>
<head>
    <title>WAV Audio Player</title>
</head>
<body>
    <audio controls>
        <source src="https://github.com/schxo99/AI-Entertainment/blob/main/image/Stay-%EC%95%88%EC%A7%80%EC%98%81.wav" type="audio/wav">
    </audio>
</body>
</html>



@echo off

REM 경로설정
cd /d "C:\Users\me\Desktop\diff-svc\diff-svc-main"

REM 가상환경 실행
call diff\Scripts\activate

REM 환경변수
set PYTHONPATH=.

REM 그래픽카드 선택
set CUDA_VISIBLE_DEVICES=0

REM 음악 씌우기
python infer.py

call conda deactivate

exit
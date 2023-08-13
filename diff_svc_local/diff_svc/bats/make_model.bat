@echo off

REM 경로설정
cd /d "C:\Users\me\Desktop\diff-svc\diff-svc-main"

REM 가상환경 실행
call diff\Scripts\activate

REM 환경변수
set PYTHONPATH=.

REM 그래픽카드 선택
set CUDA_VISIBLE_DEVICES=0

REM 전처리
python sep_wav.py

REM 환경변수
set PYTHONPATH=.

REM 그래픽카드 선택
set CUDA_VISIBLE_DEVICES=0

REM 이진화
python preprocessing/binarize.py --config training/config_nsf.yaml


REM 환경변수
set PYTHONPATH=.

REM 그래픽카드 선택
set CUDA_VISIBLE_DEVICES=0

REM 학습
python run.py --config training/config_nsf.yaml --exp_name test --reset

REM 가상환경 탈출
call conda deactivate

exit
# lv42-token-automation

ver 1.0

[현재 기능]
- .env에 등록된 값으로 42intra API SECRET 크롤링 후 안전하게 삭제
- ssh 연결을 통해 ec2 접속, 특정 PATH의 .env 수정 및 특정 명령으로 reboot

[추가 예정]
- 특정 일자 또는 특정 주기로 routine 실행 가능하도록 설정
- 실행 명령 간편화 (프로그램으로 제작)
- config 파일로 환경변수 전체 관리
- 필요한 패키지(node.js, selenium, mocha...) 자동설치
- 크롤링 및 서버 설정 도중 예외처리 고도화

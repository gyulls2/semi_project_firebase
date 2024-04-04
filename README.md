# 🔖 갈피를 잡다
<img src="https://github.com/gyulls2/semi_project_firebase/assets/117346967/6c4fa95f-3dfa-4996-9013-33103faa6377" alt="갈피를 잡다 랜딩페이지" />
<br/><br/>

🔗 배포 URL : [🔖 갈피를 잡다](https://sesac-5cabd.web.app/)   <br/>
🔗 velog 회고록 : [[새싹 프론트엔드] JavaScript Semi-Project 독서 기록 서비스(갈피를 잡다) 회고](https://velog.io/@tangerine/SeSAC-JavaScript-Semi-Project)  <br/>
🔗 발표 자료 : [갈피를 잡다 PPT](https://drive.google.com/file/d/12AJS8CNLvBWyjumjQwZr32F0RhiSBPms/view?usp=sharing)
<br/><br/><br/>

## 🔖 프로젝트 소개

카카오 도서 API를 활용한 책 검색 & 책갈피 생성 사이트입니다. <br/>
책을 읽고 기억에 남는 문장으로 자신만의 감성이 담긴 책갈피를 만들고, SNS로 공유하여 사용자의 독서 욕구를 자극하고 독서 행동을 이끌어 내고자 하는 의도를 갖고 서비스를 기획하였습니다. 사용자가 검색한 책에 코멘트를 입력하면, 책갈피를 생성해 화면에 띄워주고 데이터를 JSON-server에 저장하는 기능을 구현하였습니다. 1인 프로젝트로 기획부터 디자인, 반응형 사이트 제작, 기능 구현까지 전담하여 업무를 수행하였습니다.
<br/><br/>

🛠️ JSON-sever로 개발 후 배포를 위해 Firebase로 리팩토링 하였습니다. (23.01.12)

<br/><br/>

## 🗓 작업기간

2022.11.14 ~ 2022.11.23

<br/><br/>

## 🛠 기술스택

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/> <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=white"/> <img src="https://img.shields.io/badge/jQuery-0769AD?style=flat-square&logo=jQuery&logoColor=white"/> <img src="https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white"/> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black"/> <img src="https://img.shields.io/badge/Github-181717?style=flat-square&logo=Github&logoColor=white"/>

<br/><br/>

## 🛠 주요 기능

- Ajax와 API 통신을 사용해 도서 검색 기능 구현
- 사용자에게 입력받은 책갈피 문장을 JSON-server에 저장
- 책갈피 클릭 시 저장된 책 정보를 담은 모달창 생성
- 정규표현식으로 textarea 내 개행문자, 공백 검사
- 시간 순 책갈피 정렬 기능 구현
- 미디어 쿼리로 반응형 웹 구현

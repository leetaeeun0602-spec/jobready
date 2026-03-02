# 📋 JobReady - 취업 준비 출석체크 플랫폼

토익, 오픽, 자격증 일일 출석체크 시스템

---

## 🚀 빠른 시작 (PyCharm + Claude Code)

### 1단계: 프로젝트 열기
```bash
# PyCharm에서 이 폴더를 프로젝트로 열기
# File → Open → jobready 폴더 선택
```

### 2단계: 의존성 설치
```bash
# PyCharm 터미널 (하단) 또는 Claude Code에서 실행
npm install
```

### 3단계: 서버 실행
```bash
npm start
```

### 4단계: 브라우저에서 확인
```
http://localhost:3000
```

---

## 📁 프로젝트 구조

```
jobready/
├── server.js              ← Express 서버 (엔트리포인트)
├── package.json           ← 의존성 관리
├── .gitignore             ← Git 제외 파일
├── README.md              ← 이 파일
└── public/                ← 정적 파일 (브라우저가 접근)
    ├── index.html         ← 메인 페이지
    ├── css/
    │   └── style.css      ← 전체 스타일
    ├── js/
    │   └── main.js        ← 출석체크 로직
    └── images/            ← 이미지 (추후 추가)
```

---

## ✅ 구현된 기능

- [x] 6개 카테고리 (TOEIC, OPIc, SQLD, ADsP, 컴활1급, 나만의 목표)
- [x] 일일 출석체크 버튼
- [x] LocalStorage 데이터 영구 저장 (새로고침해도 유지)
- [x] 미니 달력 (이번 달 출석 현황)
- [x] 연속 출석 (Streak) 자동 계산
- [x] 진행률 바 (목표 대비 달성률)
- [x] 대시보드 (오늘 출석, 최장 연속, 이번 달, 누적)
- [x] 컨페티 효과 (출석 체크 시)
- [x] 반응형 디자인 (모바일 대응)
- [x] 스크롤 애니메이션

---

## 🚢 배포 방법 (Phase 2~4)

### Phase 2: GitHub에 올리기
```bash
git init
git add .
git commit -m "🎉 JobReady 첫 커밋"
git remote add origin https://github.com/[본인ID]/jobready.git
git branch -M main
git push -u origin main
```

### Phase 3: Railway 배포
1. railway.app 접속 → GitHub 로그인
2. New Project → Deploy from GitHub repo
3. jobready 저장소 선택 → 자동 배포

### Phase 4: Cloudflare 도메인 연결
1. Cloudflare에서 도메인 구매
2. Railway Settings → Custom Domain → 도메인 입력
3. Cloudflare DNS → CNAME 레코드 추가

---

## 🔧 다음 단계 (레벨업)

- [ ] 회원가입/로그인 기능
- [ ] 서버 사이드 데이터 저장 (MongoDB)
- [ ] 학습 메모 기능
- [ ] 주간/월간 리포트
- [ ] 친구와 출석 공유

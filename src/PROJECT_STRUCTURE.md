# 📁 Decision Flow — Claude Track 프로젝트 구조 문서

> **버전**: v1.0 (Phase 2 완료)
> **최종 업데이트**: 2026년 5월
> **개발 트랙**: Claude AI 전담 버전
> **저장소**: https://github.com/volfgangk/decision-flow-claude

---

## 🗂️ 전체 파일 구조
decision-flow-claude/
│
├── public/
│   ├── 앱로고.jpg              ← 앱 로고 이미지
│   └── index.html             ← HTML 진입점 (Tailwind CDN 포함)
│
├── src/
│   │
│   ├── components/            ← UI 컴포넌트 모음
│   │   ├── common/            ← 앱 전역 공통 컴포넌트
│   │   │   ├── Toast.jsx          상단 알림 메시지
│   │   │   ├── BottomNav.jsx      하단 네비게이션 바
│   │   │   ├── GuestModal.jsx     참여자 이름 입력 모달
│   │   │   └── PopupModal.jsx     선택지 상세 팝업
│   │   │
│   │   └── views/             ← 화면별 독립 컴포넌트
│   │       ├── HomeView.jsx       홈 화면 (안건 목록)
│   │       ├── CreateView.jsx     안건 만들기 화면
│   │       ├── VoteView.jsx       투표 진행 화면
│   │       ├── MinimapView.jsx    리스트 미니맵 결과 화면
│   │       └── VisualMapView.jsx  비주얼 트리맵 결과 화면
│   │
│   ├── constants/             ← 앱 전역 상수 모음
│   │   ├── config.js              5-2-2 트리 규칙 숫자
│   │   ├── colors.js              브랜드 색상 & 디자인 토큰
│   │   ├── templates.js           AI 자동 템플릿 목록
│   │   └── mockData.js            테스트용 샘플 안건 데이터
│   │
│   ├── hooks/                 ← React 커스텀 훅
│   │   └── useDecisionEngine.js   앱 전체 데이터 관리 훅
│   │                              (안건 저장/불러오기, 투표 처리)
│   │
│   ├── utils/                 ← 순수 연산 유틸리티
│   │   └── treeEngine.js          트리 구조 전담 연산 엔진
│   │                              (투표 계산, 우승 경로 탐색)
│   │
│   ├── App.js                 ← 메인 라우터 (화면 전환 담당)
│   ├── index.js               ← React 앱 진입점
│   ├── index.css              ← 글로벌 CSS
│   └── PROJECT_STRUCTURE.md  ← 이 파일 (프로젝트 구조 문서)
│
├── .env                       ← 환경변수 (API 키 등)
├── .gitignore                 ← Git 제외 파일 목록
├── package.json               ← 프로젝트 의존성 정보
└── README.md                  ← 저장소 소개 문서
---

## 🧩 각 파일의 역할 한눈에 보기

| 파일 | 역할 | 수정할 때 |
|------|------|-----------|
| `constants/config.js` | 트리 규칙 숫자 | 선택지 개수 제한 변경 시 |
| `constants/colors.js` | 브랜드 색상 | 앱 색상 전체 변경 시 |
| `constants/templates.js` | 템플릿 버튼 | 홈 화면 템플릿 추가/수정 시 |
| `constants/mockData.js` | 테스트 데이터 | 샘플 안건 내용 변경 시 |
| `utils/treeEngine.js` | 투표 계산 엔진 | 계산 방식 변경 시 |
| `hooks/useDecisionEngine.js` | 데이터 관리 | 저장/불러오기 방식 변경 시 |
| `components/common/Toast.jsx` | 알림 메시지 | 토스트 디자인 변경 시 |
| `components/common/BottomNav.jsx` | 하단 메뉴 | 메뉴 항목 추가/변경 시 |
| `components/common/GuestModal.jsx` | 이름 입력 | 참여자 입력 폼 변경 시 |
| `components/common/PopupModal.jsx` | 상세 팝업 | 팝업 디자인 변경 시 |
| `components/views/HomeView.jsx` | 홈 화면 | 홈 화면 전체 변경 시 |
| `components/views/CreateView.jsx` | 안건 생성 | 안건 만들기 화면 변경 시 |
| `components/views/VoteView.jsx` | 투표 화면 | 투표 화면 변경 시 |
| `components/views/MinimapView.jsx` | 리스트 결과 | 리스트 뷰 변경 시 |
| `components/views/VisualMapView.jsx` | 트리 결과 | 트리맵 변경 시 |
| `App.js` | 화면 라우터 | 화면 전환 흐름 변경 시 |

---

## 📦 사용 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.2.0 | UI 프레임워크 |
| lucide-react | 0.383.0 | 아이콘 라이브러리 |
| Tailwind CSS | CDN | 스타일링 |
| react-scripts | 5.0.1 | 빌드 도구 |
| localStorage | 브라우저 내장 | 데이터 저장 |

---

## 🔑 localStorage 키 목록

| 키 | 저장 내용 |
|----|-----------|
| `df_claude_v1` | 안건 목록 전체 |
| `df_claude_voted_v1` | 투표 완료한 안건 ID 목록 |

---

## 🚦 화면 전환 흐름
홈 화면 (home)
↓ 새 안건 만들기
안건 생성 (create)
↓ 발행
홈 화면 (home)
↓ 안건 클릭
투표 화면 (vote)
↓ 투표 완료
├── 리스트 뷰 (minimap)
│       ↕ 전환
└── 트리맵 뷰 (visualmap)
---

## 🛠️ 개발 환경

- **IDE**: StackBlitz (브라우저 기반)
- **저장소**: GitHub (volfgangk/decision-flow-claude)
- **미리보기**: StackBlitz 내장 브라우저
- **AI 트랙**: Claude (Anthropic)
- **비교 트랙**: Gemini (Google) — 별도 저장소

---

## 📅 개발 히스토리

| 단계 | 내용 | 상태 |
|------|------|------|
| Phase 0 | 긴급 버그 패치 (localStorage, 신택스 오류) | ✅ 완료 |
| Phase 1 | Claude 트랙 환경 구축 및 v1.0 이식 | ✅ 완료 |
| Phase 2 | 물리적 파일 분리 (15개 Task) | ✅ 완료 |
| Phase 3 | 성능 최적화 고도화 | 🔜 예정 |
| Phase 4 | 디자인 고도화 | 🔜 예정 |
| Phase 5 | 새 기능 추가 | 🔜 예정 |


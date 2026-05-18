// ================================================
// 📌 mockData.js — 테스트용 샘플 안건 데이터
// 이 파일이 하는 일: 앱 처음 실행 시 보여줄 예시 데이터
// 수정할 일: 테스트 안건 내용 변경 시
// ================================================

const INITIAL_MOCK_DATA = [
    {
      id: 10001,
      title: "🔥 2026 하반기 팀 워크샵 장소 정하기 (테스트 안건1)",
      status: "진행중", dDay: "D-2", voters: 8,
      options: [
        { id: '1',     text: '제주도 (푸른 바다와 맛있는 해산물이 가득한 섬)',    voteCount: 5 },
        { id: '1-1',   text: '함덕 해변 근처 (최고의 힐링 장소)',                voteCount: 2 },
        { id: '1-1-1', text: '서우봉 둘레길 오후 산책 코스 탐방',                voteCount: 1 },
        { id: '1-1-2', text: '해변 앞 유명 카페 델문도 단체 방문',               voteCount: 1 },
        { id: '1-2',   text: '서귀포 숲속 산장 (깊은 대화 가능)',                voteCount: 3 },
        { id: '1-2-1', text: '산장 야외 바베큐 파티 및 불멍 캠핑',               voteCount: 2 },
        { id: '1-2-2', text: '아침 편백나무 숲길 피톤치드 명상',                 voteCount: 1 },
        { id: '2',     text: '강릉/속초 (시원한 파도와 커피 거리가 있는 동해안)', voteCount: 3 },
        { id: '2-1',   text: '안목해변 커피거리 정복 코스',                      voteCount: 2 },
        { id: '2-1-1', text: '로컬 유명 로스팅 카페 바리스타 체험',              voteCount: 2 },
        { id: '2-1-2', text: '해변 오션뷰 테라스 브런치 타임',                   voteCount: 0 },
        { id: '2-2',   text: '설악산 조용한 힐링 펜션 단지',                     voteCount: 1 },
        { id: '2-2-1', text: '흔들바위 가벼운 오전 등산 코스',                   voteCount: 1 },
        { id: '2-2-2', text: '계곡 토종닭 백숙 몸보신 만찬',                     voteCount: 0 },
      ],
      voteLogs: [
        { logId: 1, userName: "김철수(팀장)", optionId: "1-1-1" },
        { logId: 2, userName: "이영희",       optionId: "1-2-2" },
        { logId: 3, userName: "박민수",       optionId: "1-2-1" },
      ],
    },
    {
      id: 10002,
      title: "✨ 신규 서비스 로고 시안 투표 (테스트 안건2)",
      status: "진행중", dDay: "D-5", voters: 4,
      options: [
        { id: '1',     text: 'A안 (모던하고 심플한 미니멀리즘 그래픽 디자인)', voteCount: 2 },
        { id: '1-1',   text: '심플 라인 타이포그래피 융합 타입',              voteCount: 1 },
        { id: '1-1-1', text: '블랙 & 화이트 모노톤 다크모드 시안',            voteCount: 1 },
        { id: '1-1-2', text: '네온 그린 포인트 컬러 하이라이트 시안',         voteCount: 0 },
        { id: '1-2',   text: '볼드 솔리드 인클로저 타입',                    voteCount: 1 },
        { id: '1-2-1', text: '앱 아이콘 최적화 스퀘어 시안',                 voteCount: 1 },
        { id: '1-2-2', text: '라운드 서클 엠블럼 심볼 시안',                 voteCount: 0 },
        { id: '2',     text: 'B안 (전통과 신뢰를 강조한 클래식 심볼릭 디자인)', voteCount: 2 },
        { id: '2-1',   text: '그라데이션 입체 볼륨 타입',                    voteCount: 1 },
        { id: '2-1-1', text: '파스텔 마블링 소프트 그라데이션',              voteCount: 1 },
        { id: '2-1-2', text: '메탈릭 실버 크롬 하이테크 그라데이션',         voteCount: 0 },
        { id: '2-2',   text: '시그니처 타이포그래피 혼합형',                 voteCount: 1 },
        { id: '2-2-1', text: '세리프 클래식 서체 명조 계열 결합',            voteCount: 1 },
        { id: '2-2-2', text: '산세리프 모던 서체 고딕 계열 결합',            voteCount: 0 },
      ],
      voteLogs: [],
    },
    {
      id: 20001,
      title: "🍕 [참여 테스트] 이번 주 금요일 전사 오찬 메뉴 선정 투표",
      status: "진행중", dDay: "D-1", voters: 14,
      options: [
        { id: '1', text: "시카고 치즈 피자 & 오븐 파스타 세트", voteCount: 8 },
        { id: '2', text: "정갈한 수제 프리미엄 한정식 도시락",  voteCount: 6 },
      ],
      voteLogs: [],
    },
  ];
  
  export default INITIAL_MOCK_DATA;
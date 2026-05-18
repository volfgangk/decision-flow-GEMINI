// ================================================
// 📌 treeEngine.js — 트리 연산 전담 엔진
// 이 파일이 하는 일: 투표 계산, 우승 경로 탐색,
//                   트리 구조 탐색 등 모든 연산
// 수정할 일: 투표 계산 방식 변경 시
// ================================================

const TreeEngine = {

    // 📌 ID의 깊이 반환 (예: "1-2-1" → 3)
    getDepth: (id) => id.split('-').length,
  
    // 📌 해당 노드가 자식이 없는 최하단 노드인지 확인
    isLeafNode: (options, id) =>
      !options.some(o => o.id.startsWith(id + '-')),
  
    // 📌 특정 부모의 특정 깊이 자식들만 가져오기
    getChildren: (options, parentId, targetDepth) =>
      options.filter(
        o => o.id.startsWith(parentId + '-') &&
             o.id.split('-').length === targetDepth
      ),
  
    // 📌 현재 가장 많은 표를 받은 경로 계산
    //    (우승 경로 = 핑크색으로 강조되는 경로)
    computeWinningPaths: (options = [], totalVotes = 0) => {
      const winSet = new Set();
      if (totalVotes === 0 || options.length === 0) return winSet;
  
      const leaves = options.filter(
        o => !options.some(sub => sub.id.startsWith(o.id + '-'))
      );
      if (leaves.length === 0) return winSet;
  
      const maxVotes = Math.max(0, ...leaves.map(o => o.voteCount || 0));
      if (maxVotes === 0) return winSet;
  
      leaves
        .filter(o => (o.voteCount || 0) === maxVotes)
        .forEach(leaf => {
          let path = '';
          leaf.id.split('-').forEach(part => {
            path = path ? `${path}-${part}` : part;
            winSet.add(path);
          });
        });
  
      return winSet;
    },
  
    // 📌 마감까지 남은 시간 텍스트 반환
    getRemainingTime: (deadline, dDay) => {
      if (!deadline) {
        if (dDay === 'D-Day') return '⏳ 5시간 42분 남음';
        if (dDay === 'D-1')   return '⏳ 23시간 15분 남음';
        return `⏳ ${dDay}`;
      }
      const diffMs = new Date(deadline) - new Date();
      if (diffMs <= 0) return '⏳ 마감된 안건';
      const hours = diffMs / 3_600_000;
      return hours <= 24
        ? `⏳ ${Math.floor(hours)}시간 ${Math.floor((diffMs % 3_600_000) / 60_000)}분 남음`
        : `⏳ D-${Math.ceil(hours / 24)}`;
    },
  };
  
  export default TreeEngine;
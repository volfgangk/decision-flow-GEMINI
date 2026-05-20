// ================================================
// 📌 useDecisionEngine.js — 앱 데이터 관리 훅
// 이 파일이 하는 일: 안건 저장/불러오기, 투표 처리,
//                   화면 전환 상태 관리
// 수정할 일: 데이터 처리 방식 변경 시
// ================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import INITIAL_MOCK_DATA from '../constants/mockData';

function useDecisionEngine() {
  const [view, setView]   = useState('home');
  const [toast, setToast] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [decisions, setDecisions] = useState(() => {
    try {
      const saved = localStorage.getItem('df_claude_v1');
      return saved ? JSON.parse(saved) : INITIAL_MOCK_DATA;
    } catch { return INITIAL_MOCK_DATA; }
  });

  const [votedIds, setVotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('df_claude_voted_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('d');
      if (!encoded) return;
      const sharedDecision = JSON.parse(decodeURIComponent(encoded));
      if (!sharedDecision || !sharedDecision.id) return;
      setDecisions(prev => {
        if (prev.find(d => d.id === sharedDecision.id)) return prev;
        return [sharedDecision, ...prev];
      });
      setSelectedId(sharedDecision.id);
      setView('vote');
      window.history.replaceState({}, '', window.location.pathname);
    } catch {
      // 파싱 실패 시 무시git commit --allow-empty -m "chore: force redeploy"
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('df_claude_v1',       JSON.stringify(decisions));
      localStorage.setItem('df_claude_voted_v1', JSON.stringify(votedIds));
    } catch (e) {
      console.warn('localStorage 저장 실패:', e);
    }
  }, [decisions, votedIds]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handlePublish = useCallback((data) => {
    setDecisions(prev => [{
      id: Date.now(),
      title: data.title,
      status: '진행중',
      dDay: 'D-Day',
      voters: 0,
      options: data.options,
      voteLogs: [],
      earlyCloseRate: data.earlyCloseRate || 70,
    }, ...prev]);
    setView('home');
    showToast('안건 트리가 발행되었습니다! 🎉');
  }, [showToast]);

  const handleVoteSubmit = useCallback((decisionId, optionId, userName, persona) => {
    setDecisions(prev => prev.map(d => {
      if (d.id !== decisionId) return d;
      return {
        ...d,
        voters: d.voters + 1,
        options: d.options.map(o =>
          o.id === optionId ? { ...o, voteCount: o.voteCount + 1 } : o
        ),
        voteLogs: [...(d.voteLogs || []),
  { logId: Date.now(), userName, optionId, persona }],
      };
    }));
    setVotedIds(prev => [...prev, decisionId]);
    showToast('투표가 완료되었습니다! ✨');
  }, [showToast]);

  const handleKickUser = useCallback((decisionId, logId, optionId) => {
    setDecisions(prev => prev.map(d => {
      if (d.id !== decisionId) return d;
      return {
        ...d,
        voters: Math.max(0, d.voters - 1),
        options: d.options.map(o =>
          o.id === optionId
            ? { ...o, voteCount: Math.max(0, o.voteCount - 1) }
            : o
        ),
        voteLogs: d.voteLogs.filter(l => l.logId !== logId),
      };
    }));
    showToast('해당 표가 무효화 되었습니다.');
  }, [showToast]);

  const currentDecision = useMemo(
    () => decisions.find(d => d.id === selectedId),
    [decisions, selectedId]
  );

  const hasVoted = useMemo(
    () => votedIds.includes(selectedId),
    [votedIds, selectedId]
  );
  const handleDeleteDecision = useCallback((decisionId) => {
    setDecisions(prev => prev.filter(d => d.id !== decisionId));
    showToast('안건이 삭제되었습니다.');
  }, [showToast]);
  return {
    view, setView,
    toast, showToast,
    selectedId, setSelectedId,
    decisions, votedIds,
    currentDecision, hasVoted,
    handlePublish, handleVoteSubmit, handleKickUser, handleDeleteDecision,
  };
}

export default useDecisionEngine;
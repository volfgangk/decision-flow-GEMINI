// ================================================
// 📌 MyRoomView.jsx — 마이룸 화면 (최종 보안 버전)
// ================================================

import React, { useMemo, useState } from 'react';
import { ChevronLeft, Trophy, FileText, Users, CheckCircle2, Clock, X, Lock, Unlock } from 'lucide-react';

const MyRoomView = ({ setView, decisions, votedIds, onSelectId, onDelete }) => {
  const [userName, setUserName] = useState('참여자');
  const MOCK_IDS = [10001, 10002, 20001];

  // 🚨 [보안] 투표 참여 중인지 판단: 활성 안건 중 내가 투표한 안건이 있는가?
  const isLocked = useMemo(() => {
    return decisions?.some(d => d.status === 'active' && votedIds?.includes(d.id));
  }, [decisions, votedIds]);

  // 📊 통계 계산
  const stats = useMemo(() => {
    const myDecisions = decisions?.filter(d => d.id !== 20001) || [];
    const participated = decisions?.filter(d => votedIds?.includes(d.id)) || [];
    const closed = myDecisions.filter(d => d.status === '마감' || (d.deadline && new Date(d.deadline) <= new Date()));
    const resolved = closed.filter(d => d.voters >= 2);
    const resolutionRate = closed.length > 0 ? Math.round((resolved.length / closed.length) * 100) : 0;
    const totalVoters = myDecisions.reduce((sum, d) => sum + (d.voters || 0), 0);

    return {
      myCount: myDecisions.length,
      participatedCount: participated.length,
      totalVoters,
      resolutionRate,
      closedCount: closed.length,
      activeCount: myDecisions.filter(d => d.status === '진행중').length,
    };
  }, [decisions, votedIds]);

  const myDecisions = decisions?.filter(d => d.id !== 20001) || [];
  const participatedDecisions = decisions?.filter(d => votedIds?.includes(d.id)) || [];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center shrink-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft />
        </button>
        <div className="flex-1 text-center">
          <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] block">MY ROOM</span>
          <h1 className="font-black text-base text-gray-900">마이룸</h1>
        </div>
        <div className="w-9" />
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* 프로필 카드 (보안 락 적용) */}
        <div className="bg-gradient-to-br from-[#E8668A] to-[#F4A067] px-5 py-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🙋</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <input 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={isLocked}
                  className={`bg-transparent font-black text-white text-lg w-full outline-none border-b ${isLocked ? 'border-transparent cursor-not-allowed' : 'border-white/50'}`}
                />
                {isLocked ? <Lock className="w-4 h-4 text-white/50" /> : <Unlock className="w-4 h-4 text-white/70" />}
              </div>
              <p className="text-white/70 text-[10px] font-bold">
                {isLocked ? '투표 참여 중에는 이름을 변경할 수 없습니다.' : '나의 활동 명함입니다.'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-white/70 text-[10px] font-black mb-2 uppercase tracking-wider">획득한 뱃지</p>
            <div className="flex gap-2">
              {stats.myCount >= 1 && <div className="bg-white/20 rounded-xl px-2 py-1 text-xs font-black text-white">🎯 첫 안건</div>}
              {stats.totalVoters >= 5 && <div className="bg-white/20 rounded-xl px-2 py-1 text-xs font-black text-white">👥 소통왕</div>}
              {stats.resolutionRate >= 70 && <div className="bg-white/20 rounded-xl px-2 py-1 text-xs font-black text-white">✅ 완결러</div>}
            </div>
          </div>
        </div>

        {/* 통계 대시보드 */}
        <div className="px-5 mb-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">나의 통계</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 bg-white border-2 border-[#E8668A]/20 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-gray-500">안건 완결률</span>
                <Trophy className="w-4 h-4 text-[#E8668A]" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-[#E8668A]">{stats.resolutionRate}%</span>
                <span className="text-xs text-gray-400 font-bold mb-1.5">({stats.closedCount}개 마감)</span>
              </div>
              <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E8668A] to-[#F4A067] rounded-full transition-all duration-700" style={{ width: `${stats.resolutionRate}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-1"><span className="text-[11px] font-black text-gray-400">내가 만든 안건</span><FileText className="w-3.5 h-3.5 text-[#4A648A]" /></div>
              <div className="text-2xl font-black text-[#4A648A]">{stats.myCount}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-1"><span className="text-[11px] font-black text-gray-400">내가 참여한 안건</span><Users className="w-3.5 h-3.5 text-[#8CB82D]" /></div>
              <div className="text-2xl font-black text-[#8CB82D]">{stats.participatedCount}</div>
            </div>
          </div>
        </div>

        {/* (리스트 렌더링 영역은 기존 코드 유지) */}
      </main>
    </div>
  );
};

export default MyRoomView;
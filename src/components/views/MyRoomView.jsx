// ================================================
// 📌 MyRoomView.jsx — 마이룸 화면
// 이 파일이 하는 일: 내 통계, 안건 히스토리, 뱃지
// 수정할 일: 마이룸 화면 변경 시
// ================================================

import React, { useMemo } from 'react';
import { ChevronLeft, Trophy, FileText, Users, CheckCircle2, Clock } from 'lucide-react';

const MyRoomView = ({ setView, decisions, votedIds, onSelectId }) => {

  // 📊 통계 계산 (localStorage 데이터 기반)
  const stats = useMemo(() => {
    const myDecisions = decisions.filter(d => d.id !== 20001);
    const participated = decisions.filter(d => votedIds.includes(d.id));
    const closed = myDecisions.filter(d =>
      d.status === '마감' || (d.deadline && new Date(d.deadline) <= new Date())
    );
    const resolved = closed.filter(d => d.voters >= 2);
    const resolutionRate = closed.length > 0
      ? Math.round((resolved.length / closed.length) * 100)
      : 0;
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

  const myDecisions = decisions.filter(d => d.id !== 20001);
  const participatedDecisions = decisions.filter(d => votedIds.includes(d.id));

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

        {/* 프로필 카드 */}
        <div className="bg-gradient-to-br from-[#E8668A] to-[#F4A067] px-5 py-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🙋
            </div>
            <div>
              <h2 className="font-black text-white text-lg">나의 Decision Flow</h2>
              <p className="text-white/70 text-xs font-bold">함께 더 나은 결정을 만들어요</p>
            </div>
          </div>

          {/* 뱃지 미리보기 */}
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-white/70 text-[10px] font-black mb-2 uppercase tracking-wider">
              획득한 뱃지
            </p>
            <div className="flex gap-2">
              {stats.myCount >= 1 && (
                <div className="bg-white/20 rounded-xl px-2 py-1 text-xs font-black text-white">
                  🎯 첫 안건
                </div>
              )}
              {stats.totalVoters >= 5 && (
                <div className="bg-white/20 rounded-xl px-2 py-1 text-xs font-black text-white">
                  👥 소통왕
                </div>
              )}
              {stats.resolutionRate >= 70 && (
                <div className="bg-white/20 rounded-xl px-2 py-1 text-xs font-black text-white">
                  ✅ 완결러
                </div>
              )}
              {stats.myCount === 0 && stats.totalVoters === 0 && (
                <p className="text-white/50 text-[11px] font-bold">
                  안건을 만들면 뱃지를 획득해요!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 통계 대시보드 */}
        <div className="px-5 mb-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            나의 통계
          </h3>
          <div className="grid grid-cols-2 gap-3">

            {/* 안건 완결률 ★ 핵심 지표 */}
            <div className="col-span-2 bg-white border-2 border-[#E8668A]/20 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-gray-500">안건 완결률</span>
                <Trophy className="w-4 h-4 text-[#E8668A]" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-[#E8668A]">
                  {stats.resolutionRate}%
                </span>
                <span className="text-xs text-gray-400 font-bold mb-1.5">
                  ({stats.closedCount}개 마감)
                </span>
              </div>
              <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E8668A] to-[#F4A067] rounded-full transition-all duration-700"
                  style={{ width: `${stats.resolutionRate}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-1.5">
                North Star 목표: 70% 이상 유지
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black text-gray-400">내가 만든 안건</span>
                <FileText className="w-3.5 h-3.5 text-[#4A648A]" />
              </div>
              <div className="text-2xl font-black text-[#4A648A]">{stats.myCount}</div>
              <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                진행중 {stats.activeCount}개
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black text-gray-400">내가 참여한 안건</span>
                <Users className="w-3.5 h-3.5 text-[#8CB82D]" />
              </div>
              <div className="text-2xl font-black text-[#8CB82D]">
                {stats.participatedCount}
              </div>
              <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                총 투표 {stats.participatedCount}회
              </div>
            </div>

            <div className="col-span-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black text-gray-400">내 안건 총 참여자 수</span>
                <Users className="w-3.5 h-3.5 text-[#F4A067]" />
              </div>
              <div className="text-2xl font-black text-[#F4A067]">{stats.totalVoters}명</div>
              <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                내 안건에 참여해 준 모든 분들
              </div>
            </div>
          </div>
        </div>

        {/* 내가 만든 안건 목록 */}
        {myDecisions.length > 0 && (
          <div className="px-5 mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              내가 만든 안건 ({myDecisions.length})
            </h3>
            <div className="space-y-2">
              {myDecisions.map(item => (
                <div
                  key={item.id}
                  onClick={() => setView('vote')}
                  className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm cursor-pointer active:scale-[0.99] transition-all"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="bg-pink-50 text-[#E8668A] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                      {item.status}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{item.dDay}</span>
                    </div>
                  </div>
                  <p className="text-[13px] font-black text-gray-800 mb-1 break-keep leading-tight">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="w-3 h-3" />
                      <span className="text-[10px] font-medium">{item.voters}명 참여</span>
                    </div>
                    <span className="text-[10px] text-[#8CB82D] font-black">
                      {item.options?.length || 0}개 선택지
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 내가 참여한 안건 목록 */}
        {participatedDecisions.length > 0 && (
          <div className="px-5 mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              내가 참여한 안건 ({participatedDecisions.length})
            </h3>
            <div className="space-y-2">
              {participatedDecisions.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8CB82D] shrink-0" />
                    <span className="text-[9px] font-black text-[#8CB82D]">투표 완료</span>
                  </div>
                  <p className="text-[13px] font-black text-gray-800 break-keep leading-tight">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 안건이 없을 때 */}
        {myDecisions.length === 0 && participatedDecisions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="font-black text-gray-700 mb-2">아직 활동 기록이 없어요</h3>
            <p className="text-sm text-gray-400 font-bold leading-relaxed mb-6">
              첫 안건을 만들면<br/>통계가 여기에 쌓여요
            </p>
            <button
              onClick={() => setView('create')}
              className="bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white rounded-2xl py-3 px-6 font-black text-sm shadow-lg active:scale-95 transition-all"
            >
              첫 안건 만들기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRoomView;
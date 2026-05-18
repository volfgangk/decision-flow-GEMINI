import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    X, ChevronLeft,
    Copy, Check,
    ChevronRight, Trophy, ChevronDown,
    BarChart2, Network, Home
  } from 'lucide-react';

import CONFIG from './constants/config';
import { COLORS, DESIGN_TOKENS } from './constants/colors';
import TEMPLATES from './constants/templates';
import TreeEngine from './utils/treeEngine';
import useDecisionEngine from './hooks/useDecisionEngine';


// =========================================================================
// 4. [COMMON COMPONENTS] 공통 원자 컴포넌트
//    📌 Toast, 하단 네비, 모달 등 앱 전역에서 쓰이는 것들
// =========================================================================
import Toast from './components/common/Toast';

import BottomNav from './components/common/BottomNav';

import GuestModal from './components/common/GuestModal';

import PopupModal from './components/common/PopupModal';

// =========================================================================
// 5. [VIEWS] 화면별 독립 컴포넌트
// =========================================================================

import HomeView from './components/views/HomeView';

import CreateView from './components/views/CreateView';

// ── 5.3 VOTE VIEW ──────────────────────────────────────────────────────────
const VoteView = ({ decision, setView, onVoteSubmit, hasVoted, showToast, isAdmin, onKick }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [showGuest, setShowGuest]   = useState(!isAdmin && !hasVoted);
  const [userName, setUserName]     = useState(isAdmin ? '방장' : '');

  const winningPaths = useMemo(
    () => TreeEngine.computeWinningPaths(decision.options, decision.voters),
    [decision.options, decision.voters]
  );
  const rootOptions = useMemo(
    () => decision.options.filter(o => !o.id.includes('-')),
    [decision.options]
  );
  const showStats = isAdmin || hasVoted;

  const getPercentage = useCallback(
    (count) => !decision.voters ? '0%' : ((count / decision.voters) * 100).toFixed(1) + '%',
    [decision.voters]
  );

  return (
    <>
      {showGuest && (
        <GuestModal onJoin={name => { setUserName(name); setShowGuest(false); }} />
      )}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
        <h1 className="font-black text-base text-gray-900 truncate max-w-[240px] text-center">{decision.title}</h1>
        <button onClick={() => showToast('참여자용 투표 링크가 복사되었습니다! ✨')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <Copy className="w-5 h-5" />
        </button>
      </header>

      <main className={`flex-1 px-5 pt-4 overflow-y-auto bg-gray-50 ${isAdmin ? 'pb-56' : 'pb-40'}`}>
        {/* 상태 배지 */}
        <div className="mb-4 flex items-center gap-2 flex-wrap shrink-0">
          <div className="inline-flex items-center gap-1.5 bg-[#FAFFEB] border border-[#B6FF33]/60 px-2.5 py-1 rounded-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8CB82D] animate-pulse" />
            <span className="text-[10px] font-black text-[#6B8E23] uppercase tracking-wider">{decision.status}</span>
          </div>
          <div className={`inline-flex items-center gap-1 bg-white border px-2.5 py-1 rounded-md shadow-sm ${
            isAdmin ? 'border-blue-100' : hasVoted ? 'border-pink-100' : 'border-gray-200'
          }`}>
            <span className={`text-[10px] font-black ${isAdmin ? 'text-blue-500' : hasVoted ? 'text-[#E8668A]' : 'text-gray-400'}`}>
              {isAdmin ? '👑 방장 모드' : hasVoted ? '✅ 내 투표 완료' : '📝 미참여'}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md shadow-sm ml-auto">
            <span className="text-[10px] font-black text-[#FF6B6B] tracking-tight">
              {TreeEngine.getRemainingTime(decision.deadline, decision.dDay)}
            </span>
          </div>
        </div>

        {/* 선택지 트리 */}
        <div className="space-y-3">
          {rootOptions.map(root => {
            const l1Children  = TreeEngine.getChildren(decision.options, root.id, 2);
            const isLeaf      = TreeEngine.isLeafNode(decision.options, root.id);
            const isSelected  = selectedId === root.id;
            const isWinner    = showStats && winningPaths.has(root.id);

            return (
              <div key={root.id} className="flex flex-col gap-1.5 bg-gray-200/40 border border-gray-200/60 rounded-[32px] p-3 transition-all">
                {isLeaf ? (
                  <button
                    disabled={hasVoted || isAdmin}
                    onClick={() => setSelectedId(root.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex justify-between items-center ${
                      isSelected
                        ? 'bg-white border-[#B6FF33] shadow-[0_10px_20px_-5px_rgba(182,255,51,0.3)]'
                        : isWinner
                        ? `${DESIGN_TOKENS.statsBg} ${DESIGN_TOKENS.statsBorder} shadow-sm`
                        : 'bg-white border-gray-100 shadow-sm'
                    } ${isAdmin ? 'cursor-default' : ''}`}
                  >
                    <div className="flex gap-2 flex-1 mr-2 overflow-hidden items-center">
                      <span className="text-[15px] font-black text-[#E8668A] shrink-0">{root.id}.</span>
                      <span className="text-[15px] font-black text-gray-800 break-words">{root.text}</span>
                    </div>
                    {showStats ? (
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {isWinner && <span className="text-[10px] font-black text-[#FF6B6B] bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md animate-pulse">🔥 대세</span>}
                        <span className="text-xs font-black text-[#8CB82D] bg-[#FAFFEB] border border-[#B6FF33]/30 px-2.5 py-1.5 rounded-lg shadow-sm">
                          {root.voteCount}표 ({getPercentage(root.voteCount)})
                        </span>
                      </div>
                    ) : isSelected && (
                      <div className="w-5 h-5 bg-[#B6FF33] rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#2C4000]" />
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="w-full px-4 py-2 flex items-center gap-2">
                    <span className="text-[14px] font-black text-gray-400 shrink-0">{root.id}.</span>
                    <span className="text-[14px] font-black text-gray-500">{root.text}</span>
                  </div>
                )}

                {l1Children.map(l1 => {
                  const l2Children = TreeEngine.getChildren(decision.options, l1.id, 3);
                  const isL1Leaf   = TreeEngine.isLeafNode(decision.options, l1.id);
                  const isL1Sel    = selectedId === l1.id;
                  const isL1Win    = showStats && winningPaths.has(l1.id);

                  return (
                    <div key={l1.id} className="space-y-1.5">
                      {isL1Leaf ? (
                        <button
                          disabled={hasVoted || isAdmin}
                          onClick={() => setSelectedId(l1.id)}
                          className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between border-2 ${
                            isL1Sel
                              ? 'bg-white border-[#B6FF33] shadow-[0_10px_20px_-5px_rgba(182,255,51,0.3)]'
                              : isL1Win
                              ? `${DESIGN_TOKENS.statsBg} ${DESIGN_TOKENS.statsBorder} shadow-sm`
                              : 'bg-white border-gray-100 shadow-sm'
                          } ${isAdmin ? 'cursor-default' : ''}`}
                        >
                          <div className="flex items-center gap-3 flex-1 mr-2 overflow-hidden">
                            <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0" />
                            <span className="text-[14px] font-black text-[#F4A067] shrink-0">{l1.id}.</span>
                            <span className="text-[14px] font-bold text-gray-800 break-words">{l1.text}</span>
                          </div>
                          {showStats ? (
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              {isL1Win && <span className="text-[10px] font-black text-[#FF6B6B] bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md animate-pulse">🔥 대세</span>}
                              <span className="text-xs font-black text-[#8CB82D] bg-[#FAFFEB] border border-[#B6FF33]/30 px-2.5 py-1.5 rounded-lg shadow-sm">
                                {l1.voteCount}표 ({getPercentage(l1.voteCount)})
                              </span>
                            </div>
                          ) : isL1Sel && (
                            <div className="w-5 h-5 bg-[#B6FF33] rounded-full flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 text-[#2C4000]" />
                            </div>
                          )}
                        </button>
                      ) : (
                        <div className="w-full px-4 py-1.5 flex items-center gap-3">
                          <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0" />
                          <span className="text-[13px] font-black text-gray-400">{l1.id}.</span>
                          <span className="text-[13px] font-black text-gray-500">{l1.text}</span>
                        </div>
                      )}

                      {l2Children.map(l2 => {
                        const isL2Sel = selectedId === l2.id;
                        const isL2Win = showStats && winningPaths.has(l2.id);
                        return (
                          <button
                            key={l2.id}
                            disabled={hasVoted || isAdmin}
                            onClick={() => setSelectedId(l2.id)}
                            className={`p-3 rounded-xl text-left transition-all flex items-center justify-between border-2 ${
                              isL2Sel
                                ? 'bg-white border-[#B6FF33] shadow-[0_10px_20px_-5px_rgba(182,255,51,0.3)]'
                                : isL2Win
                                ? `${DESIGN_TOKENS.statsBg} ${DESIGN_TOKENS.statsBorder} shadow-sm`
                                : 'bg-white border-gray-100 shadow-sm'
                            } ${isAdmin ? 'cursor-default' : ''}`}
                            style={{ width: 'calc(100% - 24px)', marginLeft: '24px' }}
                          >
                            <div className="flex items-center gap-3 flex-1 mr-2 overflow-hidden">
                              <CornerDownRight className="w-3.5 h-3.5 text-gray-200 shrink-0" />
                              <span className="text-[12px] font-black text-[#8CB82D] shrink-0">{l2.id}.</span>
                              <span className="text-[12px] font-bold text-gray-700 break-words">{l2.text}</span>
                            </div>
                            {showStats ? (
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                {isL2Win && <span className="text-[10px] font-black text-[#FF6B6B] bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md animate-pulse">🔥 대세</span>}
                                <span className="text-xs font-black text-[#8CB82D] bg-[#FAFFEB] border border-[#B6FF33]/30 px-2.5 py-1.5 rounded-lg shadow-sm">
                                  {l2.voteCount}표 ({getPercentage(l2.voteCount)})
                                </span>
                              </div>
                            ) : isL2Sel && (
                              <div className="w-4 h-4 bg-[#B6FF33] rounded-full flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-[#2C4000]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 관리자 패널 */}
        {isAdmin && (
          <div className="mt-8 bg-white border-2 border-gray-900 rounded-2xl p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" /> 실시간 참여자 감찰 명단
              </h3>
              <span className="bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
                {decision.voteLogs?.length || 0}명
              </span>
            </div>
            <div className="space-y-2">
              {decision.voteLogs?.length > 0
                ? decision.voteLogs.map((log, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900 text-[13px]">{log.userName}</span>
                        <span className="font-medium text-gray-500 text-[11px] truncate max-w-[200px]">
                          선택: {decision.options.find(o => o.id === log.optionId)?.text || log.optionId}
                        </span>
                      </div>
                      <button
                        onClick={() => window.confirm(`${log.userName}님의 표를 무효화하시겠습니까?`) && onKick(decision.id, log.logId, log.optionId)}
                        className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                : <div className="text-center py-6 text-gray-400 font-medium text-xs">아직 참여자가 없습니다.</div>
              }
            </div>
          </div>
        )}
      </main>

      <div className={`absolute bottom-[76px] left-0 w-full px-6 pb-6 bg-gradient-to-t from-white via-white/90 to-transparent z-10 ${isAdmin ? 'pt-6' : 'pt-10'}`}>
        {isAdmin ? (
          <button onClick={() => setView('minimap')} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl py-4 font-black shadow-xl active:scale-95 transition-all text-lg">
            투표 강제 조기 마감하기
          </button>
        ) : hasVoted ? (
          <div className="flex gap-2">
            <button onClick={() => setView('minimap')} className="flex-1 bg-white border-2 border-[#D2DFEE] text-[#4A648A] rounded-2xl py-4 font-black shadow-sm active:scale-95 transition-all text-[13px] flex items-center justify-center gap-1.5">
              <BarChart2 className="w-4 h-4" /> 리스트 뷰
            </button>
            <button onClick={() => setView('visualmap')} className="flex-1 bg-[#FFF0F3] border-2 border-[#FCD9E1] text-[#E8668A] rounded-2xl py-4 font-black shadow-sm active:scale-95 transition-all text-[13px] flex items-center justify-center gap-1.5">
              <Network className="w-4 h-4" /> 비주얼 트리
            </button>
          </div>
        ) : (
          <button
            disabled={!selectedId}
            onClick={() => selectedId && onVoteSubmit(decision.id, selectedId, userName)}
            className={`w-full rounded-2xl py-5 font-black shadow-xl transition-all text-lg ${
              !selectedId
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white active:scale-95'
            }`}
          >
            투표 완료하기
          </button>
        )}
      </div>
    </>
  );
};

// ── 5.4 MINIMAP VIEW ───────────────────────────────────────────────────────
const MinimapView = ({ decision, setView }) => {
  const [popupNode, setPopupNode] = useState(null);

  const winningPaths = useMemo(
    () => TreeEngine.computeWinningPaths(decision.options, decision.voters),
    [decision.options, decision.voters]
  );
  const rootOptions = useMemo(
    () => decision.options.filter(o => !o.id.includes('-')),
    [decision.options]
  );

  return (
    <>
      <div className="flex flex-col h-full bg-gray-50">
        <header className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button onClick={() => setView('vote')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-gray-400 tracking-[0.2em]">LIST MINIMAP</span>
            <h1 className="font-black text-base text-gray-900">리스트 미니맵</h1>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto pb-32">
          <div className="bg-white px-5 py-6 mb-2 shadow-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#E8668A]" />
              <h2 className="text-sm font-black text-gray-900">현재 이 안건의 진행 상태</h2>
            </div>
          </div>

          <div className="px-5 py-4 space-y-4">
            {rootOptions.sort((a, b) => b.voteCount - a.voteCount).map(root => {
              const percent    = decision.voters > 0 ? Math.round((root.voteCount / decision.voters) * 100) : 0;
              const isWinner   = winningPaths.has(root.id);
              const l1Children = TreeEngine.getChildren(decision.options, root.id, 2);

              return (
                <div key={root.id} className={isWinner
                  ? 'p-[2.5px] bg-gradient-to-r from-[#E8668A] to-[#F4A067] rounded-2xl shadow-md'
                  : 'border border-[#D2DFEE] rounded-2xl bg-white shadow-sm'
                }>
                  <div className="bg-white rounded-[13.5px] flex flex-col">
                    <div className="relative overflow-hidden rounded-t-[13.5px] border-b border-gray-100">
                      <div
                        className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out z-0 ${isWinner ? 'bg-[#FFF0F3]' : 'bg-[#F0F4F8]'}`}
                        style={{ width: `${percent}%` }}
                      />
                      <div className="relative p-4 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3 flex-1 pr-2">
                          <span className={`text-[15px] font-black w-5 shrink-0 ${isWinner ? 'text-[#E8668A]' : 'text-[#4A648A]'}`}>{root.id}.</span>
                          <span className={`text-[15px] font-bold break-keep leading-snug ${isWinner ? 'text-gray-900' : 'text-gray-800'}`}>{root.text}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-[16px] font-black ${isWinner ? 'text-[#E8668A]' : 'text-[#4A648A]'}`}>{percent}%</div>
                          <div className="text-[10px] font-bold text-gray-400">{root.voteCount}표</div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 space-y-2 ${isWinner ? 'bg-gray-50/30' : 'bg-gray-50/50'} rounded-b-[13.5px]`}>
                      {l1Children.map(l1 => {
                        const isL1Win = winningPaths.has(l1.id);
                        if (!isL1Win && decision.voters > 0) return (
                          <div key={l1.id} onClick={() => setPopupNode(l1)} className="h-7 mx-2 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm active:scale-95">
                            <span className="text-[11px] text-gray-400 font-black tracking-[0.3em] opacity-60">•••</span>
                          </div>
                        );
                        return (
                          <div key={l1.id} className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0" />
                              <div className="flex-1 bg-white border border-pink-100 rounded-xl p-3 flex justify-between items-center shadow-sm">
                                <span className="text-[13px] font-bold text-gray-800 truncate pl-1">
                                  <span className="text-[#E8668A] font-black mr-1.5">{l1.id}.</span>{l1.text}
                                </span>
                                <span className="text-[12px] font-black text-[#E8668A] shrink-0">{l1.voteCount}표</span>
                              </div>
                            </div>
                            {TreeEngine.getChildren(decision.options, l1.id, 3).map(l2 => {
                              const isL2Win = winningPaths.has(l2.id);
                              if (!isL2Win && decision.voters > 0) return (
                                <div key={l2.id} onClick={() => setPopupNode(l2)} className="h-6 mx-8 bg-white rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100 border border-gray-200 shadow-sm active:scale-95">
                                  <span className="text-[10px] text-gray-300 font-black tracking-[0.3em] opacity-60">•••</span>
                                </div>
                              );
                              return (
                                <div key={l2.id} className="flex items-center gap-2 ml-5">
                                  <CornerDownRight className="w-3.5 h-3.5 text-gray-200 shrink-0" />
                                  <div className="flex-1 bg-[#FFF0F3] border border-[#FCD9E1] rounded-lg p-2.5 flex justify-between items-center shadow-sm">
                                    <span className="text-[12px] font-bold text-gray-800 truncate pl-1">
                                      <span className="text-[#E8668A]/60 font-black mr-1.5">{l2.id}.</span>{l2.text}
                                    </span>
                                    <span className="text-[11px] font-black text-[#E8668A] shrink-0">{l2.voteCount}표</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <div className="absolute bottom-[76px] left-0 w-full px-5 pb-5 pt-10 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent z-10 flex gap-2">
          <button onClick={() => setView('home')} className="flex-1 bg-white border border-gray-200 text-gray-600 rounded-2xl py-3.5 font-black text-[11px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all">
            <Home className="w-5 h-5 text-gray-400" /> 홈으로
          </button>
          <button onClick={() => window.alert('공유 링크가 복사되었습니다! ✨')} className="flex-1 bg-orange-50 border border-orange-100 text-[#F4A067] rounded-2xl py-3.5 font-black text-[11px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all">
            <Copy className="w-5 h-5 text-[#F4A067]" /> 공유하기
          </button>
          <button onClick={() => setView('visualmap')} className="flex-[1.4] bg-[#FFF0F3] border-2 border-[#E8668A]/40 text-[#E8668A] rounded-2xl py-3.5 font-black text-[12px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all">
            <Network className="w-5 h-5 text-[#E8668A]" /> 트리맵 전환
          </button>
        </div>
      </div>
      {popupNode && <PopupModal node={popupNode} onClose={() => setPopupNode(null)} />}
    </>
  );
};

// ── 5.5 VISUAL MAP VIEW ────────────────────────────────────────────────────
const VisualMapView = ({ decision, setView }) => {
  const [popupNode, setPopupNode]   = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const winningPaths = useMemo(
    () => TreeEngine.computeWinningPaths(decision.options, decision.voters),
    [decision.options, decision.voters]
  );
  const rootOptions = useMemo(
    () => decision.options.filter(o => !o.id.includes('-')),
    [decision.options]
  );

  // 🔧 [성능 개선] winningPaths 직렬화로 의존성 안정화
  const winningPathsKey = useMemo(
    () => [...winningPaths].sort().join(','),
    [winningPaths]
  );
  useEffect(() => {
    setExpandedIds(new Set(winningPaths));
  }, [winningPathsKey]); // eslint-disable-line

  const toggleExpand = useCallback((id, e) => {
    e.stopPropagation();
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const renderTree = (node, depth, isLastChild, parentIsWinner) => {
    const isWinner   = winningPaths.has(node.id);
    const children   = TreeEngine.getChildren(decision.options, node.id, depth + 1);
    const isExpanded = expandedIds.has(node.id);
    const percent    = decision.voters > 0 ? Math.round((node.voteCount / decision.voters) * 100) : 0;

    if (depth > 1 && !isWinner && decision.voters > 0) {
      return (
        <div key={node.id} className="flex flex-col relative ml-7 mt-2 mb-1.5">
          <div className="absolute left-[-22px] top-[-16px] w-[22px] h-[30px] border-l-2 border-b-2 rounded-bl-xl border-gray-200 opacity-60 -z-10" />
          {!isLastChild && (
            <div className={`absolute left-[-22px] top-[14px] bottom-[-16px] border-l-2 ${parentIsWinner ? 'border-[#E8668A]' : 'border-[#D2DFEE] opacity-60'} -z-10`} />
          )}
          <div onClick={() => setPopupNode(node)} className="bg-white border border-gray-200 hover:bg-gray-50 rounded-lg h-7 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all">
            <span className="text-[11px] text-gray-400 font-black tracking-[0.3em] opacity-60">•••</span>
          </div>
        </div>
      );
    }

    return (
      <div key={node.id} className={`flex flex-col relative ${depth > 1 ? 'ml-7 mt-3' : 'mb-6'}`}>
        {depth > 1 && <div className={`absolute left-[-22px] top-[-16px] w-[22px] h-[40px] border-l-2 border-b-2 rounded-bl-3xl ${isWinner ? 'border-[#E8668A]' : 'border-[#D2DFEE] opacity-60'} -z-10`} />}
        {depth > 1 && !isLastChild && <div className={`absolute left-[-22px] top-[24px] bottom-[-16px] border-l-2 ${parentIsWinner ? 'border-[#E8668A]' : 'border-[#D2DFEE] opacity-60'} -z-10`} />}

        <div
          onClick={() => setPopupNode(node)}
          className={`relative z-10 flex items-center justify-between p-4 rounded-[20px] cursor-pointer transition-all active:scale-95 border-[2.5px] ${
            isWinner
              ? `bg-gradient-to-r from-white to-[#FFF0F3] border-[#E8668A] shadow-[0_5px_20px_rgba(232,102,138,0.2)] scale-[1.02] ml-1`
              : `bg-white/80 border-[#E8EDF2] shadow-sm hover:border-[#D2DFEE]`
          }`}
        >
          <div className="flex items-center gap-3 flex-1 pr-2">
            <div className={`min-w-[28px] h-7 px-1.5 rounded-full flex items-center justify-center shrink-0 font-black text-[11px] tracking-tight ${isWinner ? 'bg-[#E8668A] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {node.id}
            </div>
            <span className={`text-[14px] font-bold leading-snug break-keep ${isWinner ? 'text-gray-900' : 'text-gray-500'}`}>
              {node.text}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {depth === 1 && (
              <span className={`text-[12px] font-black ${isWinner ? 'text-[#E8668A]' : 'text-gray-400'}`}>{percent}%</span>
            )}
            {children.length > 0 && (
              <button
                onClick={e => toggleExpand(node.id, e)}
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                  isExpanded
                    ? isWinner ? 'bg-[#E8668A] border-[#E8668A] text-white rotate-180' : 'bg-gray-200 border-gray-200 text-gray-500 rotate-180'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isExpanded && children.length > 0 && (
          <div className="flex flex-col relative">
            <div className={`absolute left-[24px] top-[-2px] bottom-6 w-0 border-l-2 ${isWinner ? 'border-[#E8668A]' : 'border-[#D2DFEE] opacity-60'} -z-10`} />
            {children.map((child, i) => renderTree(child, depth + 1, i === children.length - 1, isWinner))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-full bg-[#F8F9FB]">
        <header className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button onClick={() => setView('vote')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-[#E8668A] tracking-[0.2em]">VISUAL TREEMAP</span>
            <h1 className="font-black text-base text-gray-900">비주얼 트리맵</h1>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto pb-32">
          <div className="px-5 py-6 mb-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-3">
              <Network className="w-6 h-6 text-[#E8668A]" />
            </div>
            <h2 className="text-sm font-black text-gray-900">현재 이 안건의 진행 흐름</h2>
            <p className="text-[11px] text-gray-400 mt-1 font-bold">노드를 탭하면 상세 표수를 확인할 수 있습니다</p>
          </div>
          <div className="px-5 pb-10">
            {rootOptions.sort((a, b) => b.voteCount - a.voteCount).map(root => renderTree(root, 1, true, false))}
          </div>
        </main>

        <div className="absolute bottom-[76px] left-0 w-full px-5 pb-5 pt-10 bg-gradient-to-t from-[#F8F9FB] via-[#F8F9FB]/95 to-transparent z-10 flex gap-2">
          <button onClick={() => setView('home')} className="flex-1 bg-white border border-gray-200 text-gray-600 rounded-2xl py-3.5 font-black text-[11px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all">
            <Home className="w-5 h-5 text-gray-400" /> 홈으로
          </button>
          <button onClick={() => window.alert('공유 링크가 복사되었습니다! ✨')} className="flex-1 bg-orange-50 border border-orange-100 text-[#F4A067] rounded-2xl py-3.5 font-black text-[11px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all">
            <Copy className="w-5 h-5 text-[#F4A067]" /> 공유하기
          </button>
          <button onClick={() => setView('minimap')} className="flex-[1.4] bg-white border-2 border-[#D2DFEE] text-[#4A648A] rounded-2xl py-3.5 font-black text-[12px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all">
            <BarChart2 className="w-5 h-5 text-[#4A648A]" /> 리스트 전환
          </button>
        </div>
      </div>
      {popupNode && <PopupModal node={popupNode} onClose={() => setPopupNode(null)} />}
    </>
  );
};

// =========================================================================
// 6. [APP] 메인 라우터 — 이 파일의 유일한 진입점
//    📌 화면 전환 흐름을 바꾸려면 이 블록만 수정
// =========================================================================
export default function App() {
  const engine = useDecisionEngine();
  const isAdmin = new URLSearchParams(window.location.search).get('token') === 'admin';

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white h-[850px] max-h-screen relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">

        {engine.view === 'home' && (
          <HomeView
            setView={engine.setView}
            showToast={engine.showToast}
            decisions={engine.decisions}
            onSelectId={id => { engine.setSelectedId(id); engine.setView('vote'); }}
          />
        )}
        {engine.view === 'create' && (
          <CreateView setView={engine.setView} onPublish={engine.handlePublish} />
        )}
        {engine.view === 'vote' && engine.currentDecision && (
          <VoteView
            decision={engine.currentDecision}
            setView={engine.setView}
            onVoteSubmit={engine.handleVoteSubmit}
            hasVoted={engine.hasVoted}
            showToast={engine.showToast}
            isAdmin={isAdmin}
            onKick={engine.handleKickUser}
          />
        )}
        {engine.view === 'minimap' && engine.currentDecision && (
          <MinimapView decision={engine.currentDecision} setView={engine.setView} />
        )}
        {engine.view === 'visualmap' && engine.currentDecision && (
          <VisualMapView decision={engine.currentDecision} setView={engine.setView} />
        )}

        <BottomNav view={engine.view} setView={engine.setView} showToast={engine.showToast} />
        <Toast message={engine.toast} />
      </div>
    </div>
  );
}
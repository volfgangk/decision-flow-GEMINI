// ================================================
// 📌 MinimapView.jsx — 리스트 미니맵 화면
// 이 파일이 하는 일: 투표 결과를 리스트 형태로 표시
// 수정할 일: 결과 화면 디자인 변경 시
// ================================================

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Copy, Trophy, CornerDownRight, Home, Network } from 'lucide-react';
import TreeEngine from '../../utils/treeEngine';
import PopupModal from '../common/PopupModal';

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
          <button onClick={() => setView('vote')} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft />
          </button>
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
          <button
  onClick={() => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('링크가 복사되었습니다! ✨'))
      .catch(() => alert('링크: ' + window.location.href));
  }}
  className="flex-1 bg-orange-50 border border-orange-100 text-[#F4A067] rounded-2xl py-3.5 font-black text-[11px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all"
>
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

export default MinimapView;
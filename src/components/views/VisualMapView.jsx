import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, Copy, ChevronDown, BarChart2, Network, Home } from 'lucide-react';
import TreeEngine from '../../utils/treeEngine';
import PopupModal from '../common/PopupModal';

const VisualMapView = ({ decision, setView }) => {
  const [popupNode, setPopupNode]     = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const winningPaths = useMemo(
    () => TreeEngine.computeWinningPaths(decision.options, decision.voters),
    [decision.options, decision.voters]
  );
  const rootOptions = useMemo(
    () => decision.options.filter(o => !o.id.includes('-')),
    [decision.options]
  );
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
        {depth > 1 && (
          <div className={`absolute left-[-22px] top-[-16px] w-[22px] h-[40px] border-l-2 border-b-2 rounded-bl-3xl ${isWinner ? 'border-[#E8668A]' : 'border-[#D2DFEE] opacity-60'} -z-10`} />
        )}
        {depth > 1 && !isLastChild && (
          <div className={`absolute left-[-22px] top-[24px] bottom-[-16px] border-l-2 ${parentIsWinner ? 'border-[#E8668A]' : 'border-[#D2DFEE] opacity-60'} -z-10`} />
        )}
        <div
          onClick={() => setPopupNode(node)}
          className={`relative z-10 flex items-center justify-between p-4 rounded-[20px] cursor-pointer transition-all active:scale-95 border-[2.5px] ${
            isWinner
              ? 'bg-gradient-to-r from-white to-[#FFF0F3] border-[#E8668A] shadow-[0_5px_20px_rgba(232,102,138,0.2)] scale-[1.02] ml-1'
              : 'bg-white/80 border-[#E8EDF2] shadow-sm hover:border-[#D2DFEE]'
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
          <button onClick={() => setView('minimap')} className="flex-[1.4] bg-white border-2 border-[#D2DFEE] text-[#4A648A] rounded-2xl py-3.5 font-black text-[12px] flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all">
            <BarChart2 className="w-5 h-5 text-[#4A648A]" /> 리스트 전환
          </button>
        </div>
      </div>
      {popupNode && <PopupModal node={popupNode} onClose={() => setPopupNode(null)} />}
    </>
  );
};

export default VisualMapView;
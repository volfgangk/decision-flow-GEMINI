// ================================================
// 📌 CreateView.jsx — 안건 만들기 화면
// 이 파일이 하는 일: 새 안건 생성 폼
// 수정할 일: 안건 생성 화면 변경 시
// ================================================

import React, { useState, useEffect } from 'react';
import { PlusCircle, X, ChevronLeft, CornerDownRight, AlertCircle } from 'lucide-react';
import CONFIG from '../../constants/config';
import TreeEngine from '../../utils/treeEngine';

const CreateView = ({ setView, onPublish }) => {
  const [title, setTitle]     = useState('');
  const [deadline, setDeadline] = useState('');
  const [opts, setOpts]       = useState([
    { id: '1', text: '', voteCount: 0 },
    { id: '2', text: '', voteCount: 0 },
  ]);
  const [showErr, setShowErr] = useState(false);
  const [earlyCloseRate, setEarlyCloseRate] = useState(70);

  useEffect(() => {
    const d = new Date(Date.now() + 86_400_000);
    setDeadline(new Date(d - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16));
  }, []);

  const addOpt = (parentId = null) => {
    if (!parentId) {
      const roots = opts.filter(o => !o.id.includes('-'));
      if (roots.length >= CONFIG.MAX_ROOT_NODES) return;
      const newId = String(Math.max(0, ...roots.map(o => parseInt(o.id))) + 1);
      setOpts(prev => [...prev, { id: newId, text: '', voteCount: 0 }]
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })));
    } else {
      const depth = TreeEngine.getDepth(parentId);
      if (depth >= CONFIG.MAX_DEPTH) return;
      const sibs = TreeEngine.getChildren(opts, parentId, depth + 1);
      if (sibs.length >= CONFIG.MAX_CHILD_PER_NODE) return;
      const newId = `${parentId}-${sibs.length + 1}`;
      setOpts(prev => [...prev, { id: newId, text: '', voteCount: 0 }]
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })));
    }
  };

  const removeOpt = (id) =>
    setOpts(prev => prev.filter(o => !(o.id === id || o.id.startsWith(id + '-'))));

  const rootCount = opts.filter(o => !o.id.includes('-')).length;

  return (
    <>
      <header className="px-4 py-5 bg-white border-b border-gray-100 flex items-center shrink-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft />
        </button>
        <h1 className="flex-1 text-center font-black text-lg mr-8">안건 만들기</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-40 overflow-y-auto bg-gray-50/30 space-y-6">
        {/* 제목 */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">안건 제목</label>
            <span className={`text-[10px] font-black ${title.length >= 30 ? 'text-red-500' : 'text-gray-300'}`}>
              {title.length}/30
            </span>
          </div>
          <input
            type="text" maxLength={30} value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 이번 워크샵 어디로 갈까요?"
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#E8668A] outline-none font-bold text-gray-800 shadow-sm"
          />
        </div>

        {/* 선택지 */}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">
            선택지 구성 (5-2-2 가이드 잠금)
          </label>
          <div className="space-y-3">
            {opts.map(opt => {
              const depth = TreeEngine.getDepth(opt.id);
              const childCount = TreeEngine.getChildren(opts, opt.id, depth + 1).length;
              const isMandatory = depth === 1 && (opt.id === '1' || opt.id === '2');
              return (
                <div key={opt.id} className="flex gap-2 items-center" style={{ marginLeft: `${(depth - 1) * 14}px` }}>
                  {depth > 1 && <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0" />}
                  <span className="font-black text-gray-400 text-[13px] shrink-0 min-w-[20px]">{opt.id}.</span>
                  <input
                    type="text" value={opt.text}
                    onChange={e => setOpts(prev => prev.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o))}
                    placeholder="내용 입력"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold focus:ring-1 focus:ring-[#E8668A] outline-none bg-white shadow-sm"
                  />
                  {depth < CONFIG.MAX_DEPTH && (
                    <button type="button" onClick={() => addOpt(opt.id)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-black shrink-0 transition-all ${
                        childCount >= CONFIG.MAX_CHILD_PER_NODE
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-pink-50 text-[#E8668A] hover:bg-pink-100'
                      }`}>
                      {childCount >= CONFIG.MAX_CHILD_PER_NODE ? '최대' : '+하위'}
                    </button>
                  )}
                  {!isMandatory
                    ? <button type="button" onClick={() => removeOpt(opt.id)} className="text-gray-300 hover:text-red-400 p-1 transition-colors"><X className="w-4 h-4" /></button>
                    : <div className="w-6 h-6 shrink-0" />
                  }
                </div>
              );
            })}
            <button type="button" onClick={() => addOpt(null)}
              className={`w-full py-4 border-2 border-dashed rounded-2xl font-black text-sm transition-all ${
                rootCount >= CONFIG.MAX_ROOT_NODES
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-orange-200 text-[#F4A067] hover:bg-orange-50'
              }`}>
              {rootCount >= CONFIG.MAX_ROOT_NODES ? '현재 버전은 5개 생성이 최대입니다.' : '+ 선택지 추가'}
            </button>
          </div>
        </div>

        {/* 마감 기한 */}
        <div>
        {/* 조기 마감 트리거 */}
<div>
  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">
    조기 마감 가능 투표율
  </label>
  <p className="text-[11px] text-gray-400 font-bold mb-3 leading-relaxed">
    설정한 투표율 달성 시 생성자에게 알림이 가고<br/>조기 마감 여부를 선택할 수 있습니다.
  </p>
  <div className="flex gap-2">
    {[50, 60, 70, 80, 90, 100].map(rate => (
      <button
        key={rate}
        type="button"
        onClick={() => setEarlyCloseRate(rate)}
        className={`flex-1 py-2.5 rounded-xl text-[11px] font-black transition-all ${
          earlyCloseRate === rate
            ? 'bg-[#E8668A] text-white shadow-md'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        {rate}%
      </button>
    ))}
  </div>
  {earlyCloseRate === 100 && (
    <p className="text-[11px] text-[#4A648A] font-bold mt-2">
      💡 100% = 모든 참여자 투표 완료 시에만 마감 가능
    </p>
  )}
</div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">마감 기한 설정</label>
          <input
            type="datetime-local" value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#E8668A] outline-none font-bold text-gray-700 shadow-sm bg-white"
          />
        </div>
      </main>

      <div className="absolute bottom-[76px] left-0 w-full px-6 pb-6 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none">
        <button type="button"
          onClick={() => {
            const validRoots = opts.filter(o => !o.id.includes('-') && o.text.trim());
            if (!title.trim() || validRoots.length < 2) { setShowErr(true); return; }
            onPublish({ title, options: opts.filter(o => o.text.trim()), earlyCloseRate });
          }}
          className="w-full bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white rounded-2xl py-4 font-black shadow-xl pointer-events-auto active:scale-95 transition-all text-lg"
        >
          의견모으기 시작
        </button>
      </div>

      {showErr && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 w-full text-center shadow-2xl animate-in">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">선택지가 조금 부족해요</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">
              의견모으기를 시작하려면<br/>최상위 선택지가 최소 2개 이상 필요합니다.
            </p>
            <button onClick={() => setShowErr(false)} className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black active:scale-95 transition-all">
              다시 확인하기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateView;
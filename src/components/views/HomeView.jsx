import React, { useState } from 'react';
import { PlusCircle, Zap, Users, Clock } from 'lucide-react';
import TEMPLATES from '../../constants/templates';

const HomeView = ({ setView, showToast, decisions, onSelectId }) => {
  const [activeTab, setActiveTab] = useState('created');
  const list = activeTab === 'created'
    ? decisions.filter(d => d.id !== 20001)
    : decisions.filter(d => d.id === 20001);

  return (
    <>
      <header className="px-6 pt-3.5 pb-0.5 bg-white shrink-0">
        <h1 className="text-xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
          Decision Flow
          <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black tracking-wide">
            🤖 CLAUDE
          </span>
        </h1>
      </header>
      <main className="flex-1 px-5 pb-24 overflow-y-auto bg-white flex flex-col">
        <div className="flex justify-center mb-3 mt-0.5 h-14 shrink-0">
          <img src="/앱로고.jpg" alt="Logo" className="h-full w-auto object-contain mix-blend-multiply" onError={e => { e.target.style.display = 'none'; }} />
        </div>
        <section className="mb-3.5 relative shrink-0">
          <div className="absolute inset-0 border-2 border-[#a8ff35] rounded-2xl animate-pulse shadow-[0_0_12px_rgba(168,255,53,0.4)] -z-10" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 border border-white">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-[#8CB82D] fill-[#8CB82D]" />
              <h2 className="text-[10px] font-black text-[#8CB82D] uppercase tracking-widest">AI Auto Templates</h2>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TEMPLATES.map(tpl => (
                <button key={tpl.id} onClick={() => showToast('준비중입니다.')} className={`${tpl.bgColor} bg-opacity-60 p-2 rounded-xl flex items-center gap-2.5 active:scale-95 transition-all`}>
                  <div className="p-1 bg-white rounded-md shadow-sm shrink-0">{tpl.icon}</div>
                  <span className="font-bold text-gray-800 text-[12px] truncate">{tpl.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <button onClick={() => setView('create')} className="shrink-0 w-full bg-gradient-to-br from-[#E8668A] to-[#F4A067] text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-pink-100 mb-4 active:scale-[0.98] transition-transform">
          <PlusCircle className="w-5 h-5" />
          <span className="text-base font-black tracking-tight">새 안건 만들기</span>
        </button>
        <div className="flex items-end px-1 relative z-0 -mb-[1px] shrink-0">
          {[
            ['created',      '[내가 만든 안건]',   'bg-[#FFF0F3] text-[#E8668A] border-[#FCD9E1]'],
            ['participated', '[내가 참여한 안건]', 'bg-[#F0F4F8] text-[#4A648A] border-[#D2DFEE]'],
          ].map(([id, label, activeCls]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`transition-all duration-200 font-black text-[11px] px-3 py-2 rounded-t-xl border-t border-x ${activeTab === id ? `${activeCls} z-10 scale-100 shadow-sm` : 'bg-[#F8F9FA] text-gray-400 border-gray-200 z-0 scale-95 opacity-70 translate-y-[1px]'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className={`flex-1 border rounded-[22px] rounded-tl-none p-3.5 shadow-sm flex flex-col min-h-[260px] mb-4 ${activeTab === 'created' ? 'bg-[#FFF0F3] border-[#FCD9E1]' : 'bg-[#F0F4F8] border-[#D2DFEE]'}`}>
          <div className="mb-2 shrink-0">
            <span className={`text-[10px] font-black tracking-wider uppercase ${activeTab === 'created' ? 'text-[#C95374]' : 'text-[#5B3BC4]'}`}>
              {activeTab === 'created' ? '최근 진행 중인 안건' : '내가 참여 중인 안건'}
            </span>
          </div>
          {list.length > 0 ? (
            <div className="space-y-2.5 overflow-y-auto pr-1 pb-2 scrollbar-hide">
              {list.map(item => (
                <div key={item.id} onClick={() => onSelectId(item.id)} className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99]">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="bg-pink-50 text-[#E8668A] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">{item.status || '진행중'}</span>
                    <div className="flex items-center text-gray-400 gap-1"><Clock className="w-3 h-3" /><span className="text-[10px] font-bold">{item.dDay}</span></div>
                  </div>
                  <h3 className="text-[14px] font-black text-gray-800 leading-tight mb-1.5 break-keep">{item.title}</h3>
                  <div className="flex items-center gap-1.5 text-gray-400"><Users className="w-3 h-3" /><span className="text-[11px] font-medium">{item.voters}명이 참여 중</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 text-center">
              <div className="text-2xl mb-1 opacity-50">📂</div>
              <p className="text-[11px] font-black text-gray-400 mb-3 leading-relaxed">보관함이 비어있습니다.</p>
              <button onClick={() => setView('create')} className="bg-gradient-to-br from-[#E8668A] to-[#F4A067] text-white rounded-xl py-2 px-4 flex items-center gap-1.5 shadow-md text-[11px] font-black active:scale-[0.98]">
                <PlusCircle className="w-3.5 h-3.5" />새 안건 만들기
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default HomeView;
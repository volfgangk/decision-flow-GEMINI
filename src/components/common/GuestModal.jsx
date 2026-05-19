// ================================================
// 📌 GuestModal.jsx — 참여자 이름 입력 + 페르소나 아바타
// ================================================

import React, { useState, useMemo } from 'react';

const PERSONAS = [
  { emoji: '🦁', name: '신중한 사자' },
  { emoji: '🦊', name: '엉뚱한 여우' },
  { emoji: '🐧', name: '차분한 펭귄' },
  { emoji: '🐻', name: '대담한 곰' },
  { emoji: '🐬', name: '자유로운 돌고래' },
  { emoji: '🦋', name: '나비한 나비' },
  { emoji: '🐯', name: '조용한 호랑이' },
  { emoji: '🐼', name: '전략적인 판다' },
  { emoji: '🦉', name: '호기심많은 부엉이' },
  { emoji: '🐮', name: '든든한 소' },
  { emoji: '🦎', name: '날쌘 도마뱀' },
  { emoji: '🐺', name: '팀플레이어 늑대' },
];

const GuestModal = ({ onJoin, onClose }) => {
  const [name, setName] = useState('');

  // 랜덤 페르소나 — 모달이 열릴 때 한 번만 결정
  const persona = useMemo(() => {
    return PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
  }, []);

  const handleJoin = () => {
    if (!name.trim()) return;
    // 이름과 함께 아바타 정보도 전달
    onJoin(name.trim(), persona);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl animate-in text-center">
        {/* 닫기 버튼 */}
        <button
         onClick={onClose}
         className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
        <span className="text-gray-500 text-sm font-black">✕</span>
        </button>
        {/* 아바타 표시 */}
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FFF0F3] to-[#FFE4B5] rounded-2xl flex items-center justify-center text-4xl shadow-md">
            {persona.emoji}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#E8668A] rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-white text-[10px] font-black">✨</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-gray-900 mb-1">환영합니다!</h3>
        <p className="text-sm text-[#E8668A] font-black mb-1">
          {persona.name}
        </p>
        <p className="text-xs text-gray-400 font-bold mb-6">
          오늘의 페르소나가 배정되었습니다
        </p>

        <input
          type="text"
          maxLength={10}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
          placeholder="예: 홍길동 (마케팅팀)"
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-black placeholder-gray-400 focus:outline-none focus:border-[#E8668A] transition-all text-center"
        />
        <div className="text-right text-[11px] text-gray-400 font-black mt-1 mb-4 pr-1">
          {name.length}/10
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 mb-5">
          <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
            🔒 입력하신 이름과 투표 내역은<br/>신뢰도를 위해 방장에게만 전달돼요.
          </p>
        </div>

        <button
          disabled={!name.trim()}
          onClick={handleJoin}
          className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all ${
            !name.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#E8668A] to-[#F4A067] active:scale-95'
          }`}
        >
          {persona.emoji} 선택지 확인하러 가기
        </button>
      </div>
    </div>
  );
};

export default GuestModal;
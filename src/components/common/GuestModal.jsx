// ================================================
// 📌 GuestModal.jsx — 참여자 이름 입력 모달
// 이 파일이 하는 일: 투표 참여 전 이름 입력 화면
// 수정할 일: 참여자 입력 폼 변경 시
// ================================================

import React, { useState } from 'react';

const GuestModal = ({ onJoin }) => {
  const [name, setName] = useState('');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl animate-in text-center">
        <div className="text-5xl mb-4">👋</div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">환영합니다!</h3>
        <p className="text-sm text-gray-500 font-bold leading-relaxed mb-6 px-2">
          결정에 힘을 실어줄<br/>이름을 적어주세요.
        </p>
        <input
          type="text"
          maxLength={10}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예: 홍길동 (마케팅팀)"
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-black placeholder-gray-400 focus:outline-none focus:border-[#E8668A] transition-all text-center"
        />
        <div className="text-right text-[11px] text-gray-400 font-black mt-1 mb-4 pr-1">
          {name.length}/10
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5">
          <p className="text-[12px] text-gray-600 font-bold leading-relaxed">
            🔒 건강한 의사결정을 위해 작성하신 정보는<br/>방장에게만 전달돼요.
          </p>
        </div>
        <button
          disabled={!name.trim()}
          onClick={() => onJoin(name.trim())}
          className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all ${
            !name.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#E8668A] to-[#F4A067] active:scale-95'
          }`}
        >
          선택지 확인하러 가기
        </button>
      </div>
    </div>
  );
};

export default GuestModal;
// ================================================
// 📌 PopupModal.jsx — 선택지 상세 팝업
// 이 파일이 하는 일: 미니맵/트리맵에서 노드 클릭 시
//                   상세 득표수 보여주는 팝업
// 수정할 일: 팝업 디자인 변경 시
// ================================================

import React from 'react';

const PopupModal = ({ node, onClose }) => (
  <div
    className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-5 animate-in"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-[28px] p-6 w-full max-w-xs shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="mb-5">
        <h4 className="text-[11px] font-black text-[#E8668A] mb-1.5 uppercase tracking-wider">
          선택지 {node.id}
        </h4>
        <p className="text-[15px] font-bold text-gray-800 leading-relaxed">
          {node.text}
        </p>
      </div>
      <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-2">
        <span className="text-xs font-black text-gray-500">현재 누적 득표수</span>
        <span className="text-xl font-black text-[#8CB82D]">{node.voteCount}표</span>
      </div>
      <button
        onClick={onClose}
        className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
      >
        확인
      </button>
    </div>
  </div>
);

export default PopupModal;
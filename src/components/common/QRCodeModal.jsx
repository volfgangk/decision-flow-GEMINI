import React from 'react';
import { X } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, agendaTitle, agendaId }) {
  if (!isOpen) return null;

  // 임시 가상 QR 주소 생성 (투표 화면 주소)
  const voteUrl = `${window.location.origin}?view=vote&id=${agendaId}`;
  const qrMockUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(voteUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-6 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl relative flex flex-col items-center">
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] font-black bg-pink-50 text-[#E8668A] px-2.5 py-1 rounded-md mb-2">
          대면 초대용 QR코드
        </span>
        
        <h3 className="font-black text-sm text-gray-900 text-center mb-5 max-w-[200px] truncate">
          {agendaTitle}
        </h3>

        {/* 🌟 클릭 시 나타나는 선명한 실제 QR코드 이미지 매핑 */}
        <div className="w-48 h-48 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-3 shadow-inner">
          <img 
            src={qrMockUrl} 
            alt="Vote QR Code" 
            className="w-full h-full object-contain"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=QR+Error"; }}
          />
        </div>

        <p className="text-[11px] text-gray-400 font-bold text-center mt-5 leading-normal">
          상대방이 스마트폰 카메라로 스캔하면<br />
          곧바로 투표 화면으로 진입합니다.
        </p>
      </div>
    </div>
  );
}
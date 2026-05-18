// ================================================
// 📌 Toast.jsx — 상단 알림 메시지
// 이 파일이 하는 일: "투표 완료!" 같은 팝업 메시지
// 수정할 일: 알림 디자인 변경 시
// ================================================

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[60]">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm whitespace-nowrap animate-in">
        <CheckCircle2 className="w-5 h-5 text-[#B6FF33]" />
        {message}
      </div>
    </div>
  );
};

export default Toast;
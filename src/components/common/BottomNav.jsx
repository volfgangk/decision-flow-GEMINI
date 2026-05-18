// ================================================
// 📌 BottomNav.jsx — 하단 네비게이션 바
// 이 파일이 하는 일: 홈/마이룸/알림/설정 하단 메뉴
// 수정할 일: 하단 메뉴 항목 추가/변경 시
// ================================================

import React from 'react';
import { Home, User, Bell, Settings } from 'lucide-react';

const BottomNav = ({ view, setView, showToast }) => {
  const items = [
    { id: 'home',     label: '홈',    Icon: Home     },
    { id: 'profile',  label: '마이룸', Icon: User     },
    { id: 'notice',   label: '알림',  Icon: Bell     },
    { id: 'settings', label: '설정',  Icon: Settings },
  ];
  const isHomeActive = ['home','vote','minimap','visualmap','create'].includes(view);

  return (
    <nav className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-[76px] pb-2 z-20">
      {items.map(({ id, label, Icon }) => {
        const active = id === 'home' ? isHomeActive : view === id;
        return (
          <button
            key={id}
            onClick={() => id === 'home' ? setView('home') : showToast('준비 중인 메뉴입니다!')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${active ? 'text-[#E8668A]' : 'text-gray-400'}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-black">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
// ================================================
// 📌 templates.js — AI 자동 템플릿 목록
// 이 파일이 하는 일: 홈 화면의 빠른 템플릿 버튼 관리
// 수정할 일: 템플릿 추가/삭제/이름 변경 시
// ================================================

import React from 'react';
import { Coffee, Zap, Calendar, Users } from 'lucide-react';

const TEMPLATES = [
  {
    id: 1,
    title: '팀 회식',
    icon: <Coffee className="w-3.5 h-3.5 text-pink-500" />,
    bgColor: 'bg-[#FFD6E0]'
  },
  {
    id: 2,
    title: '프로젝트명',
    icon: <Zap className="w-3.5 h-3.5 text-orange-500" />,
    bgColor: 'bg-[#FFE4B5]'
  },
  {
    id: 3,
    title: '워크샵 일정',
    icon: <Calendar className="w-3.5 h-3.5 text-purple-500" />,
    bgColor: 'bg-[#E6D7FF]'
  },
  {
    id: 4,
    title: '회의 개선',
    icon: <Users className="w-3.5 h-3.5 text-blue-500" />,
    bgColor: 'bg-[#D6E4FF]'
  },
];

export default TEMPLATES;
// ================================================
// 📌 NotificationView.jsx — 알림 화면
// 이 파일이 하는 일: 인앱 알림 센터
// 수정할 일: 알림 화면 변경 시
// ================================================

import React, { useMemo } from 'react';
import { ChevronLeft, Bell, Users, Clock, CheckCircle2, Zap, Trophy } from 'lucide-react';
import TreeEngine from '../../utils/treeEngine';

const NotificationView = ({ setView, decisions, votedIds }) => {

  // 알림 목록 자동 생성
  const notifications = useMemo(() => {
    const list = [];

    decisions.forEach(d => {
      const isMyDecision = d.id !== 20001;
      const iParticipated = votedIds.includes(d.id);
      const remaining = TreeEngine.getRemainingTime(d.deadline, d.dDay);
      const isExpired = remaining === '⏳ 마감된 안건';

      // 내가 만든 안건: 참여자 알림
      if (isMyDecision && d.voters > 0) {
        list.push({
          id: `vote_${d.id}`,
          icon: '🗳️',
          color: 'text-[#E8668A]',
          bg: 'bg-pink-50',
          title: `"${d.title.substring(0, 20)}..."`,
          body: `${d.voters}명이 투표에 참여했습니다. 고맙습니다! 🙏`,
          time: '방금',
          decisionId: d.id,
        });
      }

      // 내가 만든 안건: 마감 임박
      if (isMyDecision && !isExpired && d.dDay === 'D-1') {
        list.push({
          id: `deadline_${d.id}`,
          icon: '⏰',
          color: 'text-orange-500',
          bg: 'bg-orange-50',
          title: '마감 임박!',
          body: `"${d.title.substring(0, 20)}..." 마감이 얼마 남지 않았습니다.`,
          time: '1시간 전',
          decisionId: d.id,
        });
      }

      // 내가 참여한 안건: 완결 알림
      if (iParticipated && isExpired) {
        list.push({
          id: `closed_${d.id}`,
          icon: '✅',
          color: 'text-[#8CB82D]',
          bg: 'bg-[#FAFFEB]',
          title: '안건이 완결되었습니다',
          body: `"${d.title.substring(0, 20)}..."의 최종 결과를 확인해보세요.`,
          time: '어제',
          decisionId: d.id,
        });
      }
    });

    // 기본 알림 (알림이 없을 때 보여줄 예시)
    if (list.length === 0) {
      list.push({
        id: 'welcome',
        icon: '🎉',
        color: 'text-[#F4A067]',
        bg: 'bg-orange-50',
        title: 'Decision Flow에 오신 것을 환영합니다!',
        body: '첫 안건을 만들어 팀원들과 함께 결정해보세요.',
        time: '방금',
        decisionId: null,
      });
    }

    return list;
  }, [decisions, votedIds]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center shrink-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft />
        </button>
        <div className="flex-1 text-center">
          <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] block">NOTIFICATIONS</span>
          <h1 className="font-black text-base text-gray-900">알림</h1>
        </div>
        <div className="w-9" />
      </header>

      <main className="flex-1 overflow-y-auto pb-32">

        {/* 알림 설정 안내 배너 */}
        <div className="mx-5 mt-4 mb-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-black text-blue-600">알림 설정</span>
          </div>
          <p className="text-[11px] text-blue-500 font-bold leading-relaxed">
            알림 세부 설정은 <span className="underline cursor-pointer" onClick={() => setView('settings')}>설정 탭</span>에서 변경할 수 있습니다.
          </p>
        </div>

        {/* 알림 목록 */}
        <div className="px-5 space-y-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            최근 알림 ({notifications.length})
          </h3>

          {notifications.map(noti => (
            <div
              key={noti.id}
              onClick={() => noti.decisionId && setView('vote')}
              className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-3 ${noti.decisionId ? 'cursor-pointer active:scale-[0.99] transition-all' : ''}`}
            >
              <div className={`w-10 h-10 ${noti.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>
                {noti.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className={`text-[12px] font-black ${noti.color}`}>{noti.title}</p>
                  <span className="text-[10px] text-gray-400 font-bold shrink-0">{noti.time}</span>
                </div>
                <p className="text-[12px] text-gray-600 font-medium mt-0.5 leading-relaxed">
                  {noti.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 예정 기능 안내 */}
        <div className="mx-5 mt-6 bg-gray-100 rounded-2xl p-4">
          <p className="text-[11px] font-black text-gray-400 mb-2">🔜 업데이트 예정</p>
          <div className="space-y-1.5">
            {[
              '투표 마감 전 리마인드 알림',
              '미참여자에게 알림 보내기 (방장 전용)',
              '내 선택이 최종 결정될 때 알림',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="text-[11px] text-gray-400 font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationView;
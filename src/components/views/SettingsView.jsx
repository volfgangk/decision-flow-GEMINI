// ================================================
// 📌 SettingsView.jsx — 설정 화면
// 이 파일이 하는 일: 앱 전체 설정 관리
// 수정할 일: 설정 항목 추가/변경 시
// ================================================

import React, { useState } from 'react';
import {
  ChevronLeft, Bell, Palette, Shield, Crown,
  Info, ChevronRight, Lock
} from 'lucide-react';

const SettingsView = ({ setView, showToast }) => {
  const [notifications, setNotifications] = useState({
    newVote: true,
    deadline: true,
    result: true,
    nightMode: false,
  });

  const [defaultDeadline, setDefaultDeadline] = useState(() => {
    const saved = localStorage.getItem('df_setting_deadline');
    return saved ? parseInt(saved) : 24;
  });
  const handleDeadlineChange = (delta) => {
    setDefaultDeadline(prev => {
      const next = Math.min(168, Math.max(1, prev + delta));
      localStorage.setItem('df_setting_deadline', String(next));
      return next;
    });
  };
  const [resultTiming, setResultTiming] = useState('immediate');

  const ToggleSwitch = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-[#E8668A]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  const SectionHeader = ({ icon: Icon, title, color = "text-gray-600" }) => (
    <div className={`flex items-center gap-2 mb-3 ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-black uppercase tracking-widest">{title}</span>
    </div>
  );

  const SettingRow = ({ label, sub, right, onClick }) => (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-3.5 border-b border-gray-50 ${onClick ? 'cursor-pointer active:bg-gray-50 -mx-4 px-4 transition-colors' : ''}`}
    >
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {right}
        {onClick && <ChevronRight className="w-4 h-4 text-gray-300" />}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center shrink-0">
        <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft />
        </button>
        <div className="flex-1 text-center">
          <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] block">SETTINGS</span>
          <h1 className="font-black text-base text-gray-900">설정</h1>
        </div>
        <div className="w-9" />
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-5 py-4 space-y-5">

        {/* 🔔 알림 설정 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <SectionHeader icon={Bell} title="알림 설정" color="text-[#E8668A]" />
          <SettingRow
            label="새 투표자 알림"
            sub="내 안건에 누군가 투표할 때"
            right={<ToggleSwitch value={notifications.newVote} onChange={v => setNotifications(p => ({...p, newVote: v}))} />}
          />
          <SettingRow
            label="마감 리마인드"
            sub="안건 마감 24시간 전"
            right={<ToggleSwitch value={notifications.deadline} onChange={v => setNotifications(p => ({...p, deadline: v}))} />}
          />
          <SettingRow
            label="결과 알림"
            sub="안건이 마감되면 알림"
            right={<ToggleSwitch value={notifications.result} onChange={v => setNotifications(p => ({...p, result: v}))} />}
          />
          <SettingRow
            label="야간 방해금지"
            sub="오후 10시 ~ 오전 8시"
            right={<ToggleSwitch value={notifications.nightMode} onChange={v => setNotifications(p => ({...p, nightMode: v}))} />}
          />
        </div>

        {/* 🔒 안건 기본값 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <SectionHeader icon={Shield} title="안건 기본값" color="text-[#4A648A]" />
          <div className="py-3.5 border-b border-gray-50">
  <p className="text-sm font-bold text-gray-800 mb-1">기본 마감 시간</p>
  <p className="text-[11px] text-gray-400 font-bold mb-3">
    새 안건 생성 시 기본으로 설정되는 마감 시간
  </p>
  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3">
    {/* 마이너스 버튼 */}
    <button
      type="button"
      onClick={() => handleDeadlineChange(-1)}
      className="w-11 h-11 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center font-black text-gray-600 text-xl active:scale-95 transition-all shadow-sm hover:border-[#E8668A] hover:text-[#E8668A]"
    >
      −
    </button>

    {/* 시간 표시 */}
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black text-[#E8668A]">
        {defaultDeadline}
      </span>
      <span className="text-[11px] font-black text-gray-400 mt-0.5">
        {defaultDeadline < 24
          ? `${defaultDeadline}시간`
          : defaultDeadline === 24
          ? '24시간 (1일)'
          : defaultDeadline === 48
          ? '48시간 (2일)'
          : defaultDeadline === 72
          ? '72시간 (3일)'
          : defaultDeadline === 168
          ? '168시간 (1주일)'
          : `${defaultDeadline}시간`
        }
      </span>
    </div>

    {/* 플러스 버튼 */}
    <button
      type="button"
      onClick={() => handleDeadlineChange(+1)}
      className="w-11 h-11 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center font-black text-gray-600 text-xl active:scale-95 transition-all shadow-sm hover:border-[#E8668A] hover:text-[#E8668A]"
    >
      +
    </button>
  </div>
  <div className="flex justify-between mt-2 px-1">
    <span className="text-[10px] text-gray-300 font-bold">최소 1시간</span>
    <span className="text-[10px] text-gray-300 font-bold">최대 168시간 (1주일)</span>
  </div>
</div>
          <div className="py-3.5">
            <p className="text-sm font-bold text-gray-800 mb-2">결과 공개 시점</p>
            <div className="flex gap-2">
              {[['immediate', '즉시 공개'], ['after', '마감 후 공개']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setResultTiming(val)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-black transition-all ${
                    resultTiming === val
                      ? 'bg-[#4A648A] text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🎨 디스플레이 (프리미엄) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <SectionHeader icon={Palette} title="디스플레이" color="text-[#F4A067]" />
          <SettingRow
            label="테마 색상"
            sub="앱 전체 색상 변경"
            right={
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#E8668A] to-[#F4A067]" />
                <Lock className="w-3 h-3 text-gray-300" />
              </div>
            }
            onClick={() => showToast('💎 프리미엄 기능입니다!')}
          />
          <SettingRow
            label="트리맵 연결선 스타일"
            sub="선 두께, 실선/점선/곡선"
            right={<Lock className="w-3 h-3 text-gray-300" />}
            onClick={() => showToast('💎 프리미엄 기능입니다!')}
          />
          <SettingRow
            label="트리 깊이 제한"
            sub={`현재: 3단계 (프리미엄: 최대 10단계)`}
            right={<Lock className="w-3 h-3 text-gray-300" />}
            onClick={() => showToast('💎 프리미엄 기능입니다!')}
          />
        </div>

        {/* 💎 프리미엄 */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="font-black text-white text-sm">Decision Flow 프리미엄</span>
          </div>
          <p className="text-white/60 text-xs font-bold mb-4 leading-relaxed">
            트리 깊이 확장, 디자인 커스터마이즈,<br/>무제한 안건 생성까지
          </p>
          <button
            onClick={() => showToast('🔜 곧 출시 예정입니다!')}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl py-3 font-black text-sm active:scale-95 transition-all"
          >
            프리미엄 시작하기
          </button>
        </div>

        {/* ℹ️ 앱 정보 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <SectionHeader icon={Info} title="앱 정보" color="text-gray-400" />
          <SettingRow label="버전" right={<span className="text-xs text-gray-400 font-bold">v1.0.0</span>} />
          <SettingRow
            label="개인정보 처리방침"
            onClick={() => showToast('🔜 준비 중입니다.')}
          />
          <SettingRow
            label="문의하기"
            sub="volfgangk@gmail.com"
            onClick={() => showToast('🔜 준비 중입니다.')}
          />
        </div>

      </main>
    </div>
  );
};

export default SettingsView;
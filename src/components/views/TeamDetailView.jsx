import React, { useState } from 'react';
import { ChevronLeft, Share2, Copy, CheckCircle2, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function TeamDetailView({ team, onBack, currentUserId }) {
  const [isCopied, setIsCopied] = useState(false);

  // 팀 정보가 렌더링 전에 없으면 빈 화면 방지
  if (!team) return null;

  // 내가 이 팀의 방장인지 확인
  const isAdmin = team.admin_id === currentUserId;
  const memberCount = team.member_ids ? team.member_ids.length : 1;

  // 초대코드 복사 기능
  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.invite_code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // 2초 후 체크 표시 원상복구
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-50 flex flex-col h-full animate-in slide-in-from-right duration-300">
      
      {/* 1. 상단 글로벌 네비게이션 헤더 */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 -ml-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800 truncate max-w-[200px]">
            {team.team_name}
          </h1>
        </div>
        
        {/* 방장 여부 배지 */}
        {isAdmin && (
          <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-md">
            방장
          </span>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        
        {/* 2. 초대 코드 및 QR 섹션 (바이럴 유도) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 to-pink-400"></div>
          
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <Users size={18} />
            <span className="text-sm font-medium">현재 참여 인원: {memberCount}명</span>
          </div>
          
          {/* QR 코드 생성기 */}
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-5 inline-block">
            {/* 향후 Phase D에서 실제 딥링크 주소로 변경 예정 */}
            <QRCodeSVG value={`https://decisionflow.app/join/${team.invite_code}`} size={130} level="M" />
          </div>

          <div className="flex items-center justify-center gap-3 w-full">
            <code className="text-4xl font-black text-slate-800 tracking-[0.15em] uppercase">
              {team.invite_code}
            </code>
            <button 
              onClick={handleCopyCode}
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="초대코드 복사"
            >
              {isCopied ? <CheckCircle2 size={22} className="text-green-500" /> : <Copy size={22} />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            팀원들에게 위 코드나 QR을 공유하여 팀에 초대하세요.<br/>
            앱 메인 화면에서 코드를 입력하면 즉시 참여됩니다.
          </p>
        </section>

        {/* 3. 안건 목록 섹션 (Phase C 대비 임시 Placeholder) */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-slate-800">진행 중인 팀 안건</h2>
            <span className="text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded-full uppercase tracking-wider">
              Phase C
            </span>
          </div>
          
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Share2 className="text-slate-300" size={28} />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">안건 동기화 준비 중</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              팀원들과 실시간으로 투표를 진행할 수 있는<br/>
              강력한 안건 연동 기능이 곧 업데이트됩니다!
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
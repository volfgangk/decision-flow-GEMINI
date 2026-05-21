import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import { DESIGN_TOKENS } from './constants/colors';
import TreeEngine from './utils/treeEngine';
import useDecisionEngine from './hooks/useDecisionEngine';
import Toast from './components/common/Toast';
import BottomNav from './components/common/BottomNav';
import PopupModal from './components/common/PopupModal';
import HomeView from './components/views/HomeView';
import CreateView from './components/views/CreateView';
import VoteView from './components/views/VoteView';

// 인증 훅
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
// 백엔드 파이프라인 훅 (PRD v2.1)
import { useTeam } from './hooks/useTeam';
import { useAgenda } from './hooks/useAgenda';

// 마법의 팝업 (PRD v2.1)
import PublishModal from './components/common/PublishModal';

import MinimapView from './components/views/MinimapView';
import VisualMapView from './components/views/VisualMapView';
import MyRoomView from './components/views/MyRoomView';
import NotificationView from './components/views/NotificationView';
import SettingsView from './components/views/SettingsView';

export default function App() {
  const engine  = useDecisionEngine();
  const isAdmin = new URLSearchParams(window.location.search).get('token') === 'admin';
  
  const { authUser, isLoading: isAuthLoading, error } = useFirebaseAuth();

  // ── [PRD v2.1] 배선 상태 관리 ──
  // 🚨 교정 포인트: 팀 생성 로딩 상태(isTeamLoading) 추가 추출
  const { createTeam, isLoading: isTeamLoading } = useTeam();
  const { createAgenda, isAgendaLoading } = useAgenda();
  
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [draftAgenda, setDraftAgenda] = useState(null);

  // ── [PRD v2.1] CreateView에서 [의견모으기 시작]을 눌렀을 때 ──
  const handlePublishClick = (agendaData) => {
    setDraftAgenda(agendaData);
    setIsPublishModalOpen(true);
  };

  // ── [PRD v2.1] 마법의 팝업에서 확인을 눌렀을 때 ──
  const handlePublishConfirm = async (userName, teamName) => {
    try {
      // 1. 팀 먼저 생성 (이때 isTeamLoading이 true가 됨)
      const newTeam = await createTeam(teamName, userName);
      
      // 2. 안건을 해당 팀 안으로 귀속하여 생성 (이때 isAgendaLoading이 true가 됨)
      await createAgenda(newTeam.team_id, draftAgenda);
      
      // 3. 팝업 닫고 청소
      setIsPublishModalOpen(false);
      setDraftAgenda(null);
      engine.showToast('성공적으로 발행되었습니다! 🎉');
      
      // 4. 완료 후 홈 화면으로 이동
      engine.setView('home');

    } catch (err) {
      console.error("통합 발행 에러:", err);
      engine.showToast('발행 중 문제가 발생했습니다.');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex justify-center items-center font-sans">
        <div className="w-full max-w-md bg-white h-[850px] max-h-screen relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">안전한 접속 환경을 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex justify-center items-center font-sans">
        <div className="w-full max-w-md bg-white h-[850px] max-h-screen relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center p-6 text-center">
          <p className="text-red-500 font-bold mb-2">접속 오류가 발생했습니다.</p>
          <p className="text-sm text-slate-500">네트워크 상태를 확인해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white h-[850px] max-h-screen relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
        
        {engine.view === 'home' && (
          <HomeView
            setView={engine.setView}
            showToast={engine.showToast}
            decisions={engine.decisions}
            onSelectId={id => { engine.setSelectedId(id); engine.setView('vote'); }}
          />
        )}
        
        {engine.view === 'create' && (
          <CreateView setView={engine.setView} onPublish={handlePublishClick} />
        )}
        
        {engine.view === 'vote' && engine.currentDecision && (
          <VoteView
            decision={engine.currentDecision}
            setView={engine.setView}
            onVoteSubmit={engine.handleVoteSubmit}
            hasVoted={engine.hasVoted}
            showToast={engine.showToast}
            isAdmin={isAdmin}
            onKick={engine.handleKickUser}
          />
        )}
        
        {engine.view === 'minimap' && engine.currentDecision && (
          <MinimapView decision={engine.currentDecision} setView={engine.setView} />
        )}
        {engine.view === 'visualmap' && engine.currentDecision && (
          <VisualMapView decision={engine.currentDecision} setView={engine.setView} />
        )}
        {engine.view === 'myroom' && (
          <MyRoomView
            setView={engine.setView}
            decisions={engine.decisions}
            votedIds={engine.votedIds || []}
            onSelectId={id => { engine.setSelectedId(id); engine.setView('vote'); }}
            onDelete={engine.handleDeleteDecision}
          />
        )}
        {engine.view === 'notifications' && (
          <NotificationView
            setView={engine.setView}
            decisions={engine.decisions}
            votedIds={engine.votedIds || []}
          />
        )}
        {engine.view === 'settings' && (
          <SettingsView
            setView={engine.setView}
            showToast={engine.showToast}
          />
        )}
        <BottomNav view={engine.view} setView={engine.setView} />
        <Toast message={engine.toast} />

        {/* 🚨 교정 포인트: 팀 생성 중이거나 안건 생성 중일 때 모두 버튼을 비활성화합니다 */}
        <PublishModal 
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onConfirm={handlePublishConfirm}
          isPublishing={isTeamLoading || isAgendaLoading} 
        />
        
      </div>
    </div>
  );
}
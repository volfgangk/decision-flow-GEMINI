import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// ── 추가된 인증 훅 ──────────────────────────────────────────────────────────
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

// ── MINIMAP VIEW ───────────────────────────────────────────────────────────
import MinimapView from './components/views/MinimapView';

// ── VISUAL MAP VIEW ────────────────────────────────────────────────────────
import VisualMapView from './components/views/VisualMapView';
import MyRoomView from './components/views/MyRoomView';
import NotificationView from './components/views/NotificationView';
import SettingsView from './components/views/SettingsView';

// ── APP (메인 라우터) ──────────────────────────────────────────────────────
export default function App() {
  const engine  = useDecisionEngine();
  const isAdmin = new URLSearchParams(window.location.search).get('token') === 'admin';
  
  // 파이어베이스 익명 인증 상태 호출
  const { authUser, isLoading, error } = useFirebaseAuth();

  // 1. 로딩 상태 처리 (기존 UI 래퍼와 동일한 규격 적용)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex justify-center items-center font-sans">
        <div className="w-full max-w-md bg-white h-[850px] max-h-screen relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">안전한 접속 환경을 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 2. 에러 상태 처리
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

  // 3. 정상 렌더링 (인증 완료 후 기존 구조 노출)
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
          <CreateView setView={engine.setView} onPublish={engine.handlePublish} />
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
      </div>
    </div>
  );
}
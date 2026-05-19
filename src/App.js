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

// ── MINIMAP VIEW ───────────────────────────────────────────────────────────
import MinimapView from './components/views/MinimapView';

// ── VISUAL MAP VIEW ────────────────────────────────────────────────────────
import VisualMapView from './components/views/VisualMapView';

// ── APP (메인 라우터) ──────────────────────────────────────────────────────
export default function App() {
  const engine  = useDecisionEngine();
  const isAdmin = new URLSearchParams(window.location.search).get('token') === 'admin';

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
        <BottomNav view={engine.view} setView={engine.setView} showToast={engine.showToast} />
        <Toast message={engine.toast} />
      </div>
    </div>
  );
}
// src/components/common/PublishModal.jsx
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { validateInput } from '../../utils/textFilter';

export default function PublishModal({ isOpen, onClose, onConfirm, isPublishing }) {
  const [userName, setUserName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    // 1. 내 이름(실명) 필터링 (최대 20자)
    const nameValidation = validateInput(userName, 20);
    if (!nameValidation.isValid) {
      setLocalError(`[이름 입력 오류] ${nameValidation.errorMessage}`);
      return;
    }

    // 2. 소속 팀 이름 필터링 (최대 20자)
    const teamValidation = validateInput(teamName, 20);
    if (!teamValidation.isValid) {
      setLocalError(`[그룹명 입력 오류] ${teamValidation.errorMessage}`);
      return;
    }

    // 모든 검열을 통과하면 상위 컴포넌트(App.js)로 이름과 팀명을 올려보냄
    onConfirm(userName.trim(), teamName.trim());
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-5 flex justify-between items-start border-b border-pink-100/50">
          <div>
            <h2 className="text-xl font-black text-gray-800">성공적으로 작성되었습니다! 🎉</h2>
            <p className="text-xs font-bold text-gray-500 mt-1">
              투표를 안전하게 보관하고 팀원들과 공유할 준비를 마쳐주세요.
            </p>
          </div>
          <button onClick={onClose} disabled={isPublishing} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm disabled:opacity-50">
            <X size={18} />
          </button>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
              내 이름 (실명)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="예: 홍길동"
              disabled={isPublishing}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8668A] outline-none font-bold text-gray-800 shadow-sm disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
              이 투표를 진행할 그룹/팀명
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="예: 마케팅팀 워크샵"
              disabled={isPublishing}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F4A067] outline-none font-bold text-gray-800 shadow-sm disabled:bg-gray-50"
            />
          </div>

          {localError && (
            <div className="text-[11px] text-red-500 font-bold bg-red-50 p-3 rounded-lg break-keep">
              {localError}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPublishing}
              className="w-full bg-gradient-to-r from-[#E8668A] to-[#F4A067] text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isPublishing ? (
                <><Loader2 size={18} className="animate-spin" /> 처리 중...</>
              ) : (
                '완료 및 초대코드 생성하기'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTeam } from '../../hooks/useTeam';

export default function JoinTeamModal({ isOpen, onClose, onSuccess }) {
  const [inviteCode, setInviteCode] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { joinTeam, isLoading, error } = useTeam();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (inviteCode.trim().length !== 6) {
      setLocalError('6자리 초대코드를 정확히 입력해 주세요.');
      return;
    }

    try {
      const joinedTeam = await joinTeam(inviteCode);
      setInviteCode('');
      if (onSuccess) onSuccess(joinedTeam);
      onClose();
    } catch (err) {
      console.error("참여 에러:", err);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* 헤더 구역 */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-blue-50">
          <h2 className="text-lg font-bold text-slate-800">초대코드로 팀 참여</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-blue-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* 본문 입력 구역 */}
        <form onSubmit={handleSubmit} className="p-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
              전달받은 6자리 코드를 입력해 주세요
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="예: A3X9B1"
              className="w-full px-4 py-4 text-center text-2xl tracking-[0.2em] font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
              maxLength={6}
            />
          </div>

          {(localError || error) && (
            <div className="mt-3 text-xs text-red-500 font-medium bg-red-50 p-2 rounded text-center">
              {localError || error}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition duration-200 flex justify-center items-center disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : '팀 참여하기'}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}
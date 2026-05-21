import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTeam } from '../../hooks/useTeam';

export default function CreateTeamModal({ isOpen, onClose, onSuccess }) {
  const [teamName, setTeamName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [localError, setLocalError] = useState('');
  
  // 우리가 미리 만들어둔 백엔드 통신 무기 장착
  const { createTeam, isLoading, error } = useTeam();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!teamName.trim() || !adminName.trim()) {
      setLocalError('팀 이름과 방장 실명을 모두 입력해 주세요.');
      return;
    }

    try {
      // 파이어베이스에 팀 생성 지시
      const newTeam = await createTeam(teamName, adminName);
      setTeamName('');
      setAdminName('');
      if (onSuccess) onSuccess(newTeam);
      onClose();
    } catch (err) {
      console.error("생성 에러:", err);
      // 에러 메시지는 useTeam의 error 상태를 통해 화면에 출력됨
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* 헤더 구역 */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-pink-50">
          <h2 className="text-lg font-bold text-slate-800">새로운 팀 만들기</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-pink-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* 본문 입력 구역 */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                팀 이름
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="예: 마케팅팀 워크샵"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                내 이름 (실명)
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                maxLength={10}
              />
              <p className="text-xs text-slate-400 mt-1">
                ※ 원활한 소통을 위해 방장은 실명 등록이 필수입니다.
              </p>
            </div>
          </div>

          {/* 에러 메시지 출력 */}
          {(localError || error) && (
            <div className="mt-3 text-xs text-red-500 font-medium bg-red-50 p-2 rounded">
              {localError || error}
            </div>
          )}

          {/* 버튼 구역 */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition duration-200 flex justify-center items-center disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : '팀 생성 완료'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
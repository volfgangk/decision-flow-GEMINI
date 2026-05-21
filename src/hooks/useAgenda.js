import { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const useAgenda = () => {
  const [isAgendaLoading, setIsAgendaLoading] = useState(false);
  const [agendaError, setAgendaError] = useState(null);

  // 안건 생성 로직 (PRD v2.1: 안건은 반드시 특정 팀에 종속됨)
  const createAgenda = async (teamId, agendaData) => {
    setIsAgendaLoading(true);
    setAgendaError(null);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("인증되지 않은 사용자입니다.");
      if (!teamId) throw new Error("소속된 팀 정보가 누락되었습니다.");

      // 파이어베이스 Agendas 컬렉션에 새 문서 추가
      const agendasRef = collection(db, 'Agendas');
      const newAgendaDoc = await addDoc(agendasRef, {
        team_id: teamId,                // 1. 소속 팀 (PRD v2.1 핵심)
        creator_id: currentUser.uid,    // 2. 생성자 UID
        title: agendaData.title,        // 3. 안건 제목
        options: agendaData.options,    // 4. 선택지 배열
        early_close_rate: agendaData.earlyCloseRate, // 5. 조기 마감 조건
        deadline: agendaData.deadline,  // 6. 마감 기한
        status: 'active',               // 7. 상태 (진행중)
        voter_ids: [],                  // 8. 투표자 명단 (초기엔 빈 배열)
        created_at: serverTimestamp(),
      });

      // 서버 저장이 완벽하게 끝났으므로, 폰 메모리(LocalStorage)의 임시 데이터를 삭제하여 유령 안건 방지
      localStorage.removeItem('decision_flow_agenda_draft');

      setIsAgendaLoading(false);
      return newAgendaDoc.id; // 생성된 안건의 고유 ID 반환

    } catch (err) {
      console.error("안건 생성 오류:", err);
      setAgendaError(err.message);
      setIsAgendaLoading(false);
      throw err;
    }
  };

  return { createAgenda, isAgendaLoading, agendaError };
};
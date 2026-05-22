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
      
      // 🚨 [보안 및 에러 픽스] undefined 값이 DB에 들어가는 것을 원천 차단합니다.
      const newAgendaDoc = await addDoc(agendasRef, {
        team_id: teamId,                
        creator_id: currentUser.uid,    
        title: agendaData.title || "",                 
        options: agendaData.options || [],             
        early_close_rate: agendaData.earlyCloseRate ?? null, // 0은 통과, undefined는 null로
        deadline: agendaData.deadline || null,               // 값이 없으면 null 처리
        status: 'active',               
        voter_ids: [],                  
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
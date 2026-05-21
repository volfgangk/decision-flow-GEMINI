import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const useHomeData = () => {
  const [agendas, setAgendas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const agendasRef = collection(db, 'Agendas');
    
    const unsubscribe = onSnapshot(agendasRef, (snapshot) => {
      const fetchedAgendas = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.creator_id === currentUser.uid || (data.voter_ids && data.voter_ids.includes(currentUser.uid))) {
          fetchedAgendas.push({ id: doc.id, ...data });
        }
      });
      
      // 🚨 교정 포인트: 파이어베이스의 null 타임스탬프 지연 방어 (크래시 원천 차단)
      fetchedAgendas.sort((a, b) => {
        const timeA = a.created_at?.toMillis() || 0;
        const timeB = b.created_at?.toMillis() || 0;
        return timeB - timeA;
      });
      
      setAgendas(fetchedAgendas);
      setIsLoading(false);
    }, (error) => {
      console.error("홈 데이터 로드 실패:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { agendas, isLoading };
};
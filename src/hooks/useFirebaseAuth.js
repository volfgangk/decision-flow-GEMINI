import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 파이어베이스 인증 상태를 감시하는 리스너
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 이미 임시 출입증(익명 ID)을 발급받은 유저인 경우
        setAuthUser(user);
        setIsLoading(false);
      } else {
        // 출입증이 없는 최초 접속 유저인 경우 -> 익명 로그인 자동 실행
        signInAnonymously(auth)
          .then(() => {
            // 성공 시 onAuthStateChanged가 다시 실행되면서 user 상태가 저장됩니다.
          })
          .catch((err) => {
            console.error("익명 인증 ID 발급 실패:", err);
            setError(err);
            setIsLoading(false);
          });
      }
    });

    // 화면이 닫히거나 바뀔 때 리스너를 안전하게 정리
    return () => unsubscribe();
  }, []);

  return { authUser, isLoading, error };
};
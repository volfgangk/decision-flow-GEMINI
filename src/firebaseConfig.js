import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: 나중에 대표님의 파이어베이스 콘솔에서 발급받은 진짜 설정값으로 교체해야 합니다.
// (지금은 이대로 두셔도 에러가 나지 않도록 껍데기만 만들어 두었습니다.)
const firebaseConfig = {
  apiKey: "API_KEY_PLACEHOLDER",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// 파이어베이스 앱 초기화 (시동 걸기)
const app = initializeApp(firebaseConfig);

// 인증(Auth) 및 데이터베이스(Firestore) 기능 밖으로 꺼내기
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
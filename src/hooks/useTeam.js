import { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';

export const useTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. 6자리 영문 대문자 + 숫자 조합의 고유 초대코드 생성기
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // 2. 팀 생성 로직 (방장 권한 및 실명 등록 강제)
  const createTeam = async (teamName, adminName) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("인증되지 않은 사용자입니다. 앱을 새로고침 해주세요.");

      const userRef = doc(db, 'Users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      let currentTeams = [];
      let isPremium = false;

      if (userSnap.exists()) {
        const userData = userSnap.data();
        currentTeams = userData.joined_team_ids || [];
        isPremium = userData.is_premium || false;

        // 💡 [BM 정책 수정] 베타 테스트 기간: 넉넉한 50개 한도 부여 및 정중한 안내
        if (!isPremium && currentTeams.length >= 50) {
          throw new Error("현재 베타 버전의 최대 한도(50개)에 도달했습니다. 더욱 강력해질 정식 업데이트를 기대해 주세요!");
        }
      }

      await setDoc(userRef, {
        user_id: currentUser.uid,
        name: adminName,
        joined_team_ids: currentTeams,
        is_premium: isPremium
      }, { merge: true });

      const inviteCode = generateInviteCode();
      const newTeamRef = doc(collection(db, 'Teams'));

      const teamData = {
        team_id: newTeamRef.id,
        team_name: teamName,
        invite_code: inviteCode,
        admin_id: currentUser.uid,
        member_ids: [currentUser.uid], 
        created_at: serverTimestamp()
      };
      
      await setDoc(newTeamRef, teamData);

      await updateDoc(userRef, {
        joined_team_ids: arrayUnion(newTeamRef.id)
      });

      setIsLoading(false);
      return teamData; 

    } catch (err) {
      console.error("팀 생성 오류:", err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // 3. 초대코드를 이용한 팀 참여 로직 (팀원 권한)
  const joinTeam = async (inviteCode) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("인증되지 않은 사용자입니다. 앱을 새로고침 해주세요.");

      const teamsRef = collection(db, 'Teams');
      const q = query(teamsRef, where("invite_code", "==", inviteCode.toUpperCase().trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("존재하지 않거나 유효하지 않은 초대코드입니다.");
      }

      const teamDoc = querySnapshot.docs[0];
      const teamId = teamDoc.id;
      const teamData = teamDoc.data();
      const currentMembers = teamData.member_ids || [];

      // 💡 [BM 정책 수정] 베타 기간 팀당 인원 50명으로 확장
      if (currentMembers.length >= 50) {
        throw new Error("현재 베타 버전의 팀 정원(50명)이 가득 찼습니다. 다음 업데이트를 기다려 주세요!");
      }

      const userRef = doc(db, 'Users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const myTeams = userData.joined_team_ids || [];
        
        if (myTeams.includes(teamId)) {
          throw new Error("이미 가입되어 활동 중인 팀입니다.");
        }
        
        // 💡 [BM 정책 수정] 가입 시에도 50개 한도 적용
        if (!userData.is_premium && myTeams.length >= 50) {
          throw new Error("현재 베타 버전의 최대 소속 한도(50개)에 도달했습니다. 정식 업데이트를 기대해 주세요!");
        }
      }

      await updateDoc(doc(db, 'Teams', teamId), {
        member_ids: arrayUnion(currentUser.uid)
      });

      await setDoc(userRef, {
        user_id: currentUser.uid,
        joined_team_ids: arrayUnion(teamId)
      }, { merge: true });

      setIsLoading(false);
      return teamData; 

    } catch (err) {
      console.error("팀 참여 오류:", err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { createTeam, joinTeam, isLoading, error };
};
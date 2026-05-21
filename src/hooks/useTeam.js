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

      // [자체검증] 유저 서랍장(Users)을 먼저 열어 요금제 및 생성 한도를 체크합니다.
      const userRef = doc(db, 'Users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      let currentTeams = [];
      let isPremium = false;

      if (userSnap.exists()) {
        const userData = userSnap.data();
        currentTeams = userData.joined_team_ids || [];
        isPremium = userData.is_premium || false;

        // [BM 정책 반영] 무료 요금제 사용자는 팀 개수가 2개 이상이면 생성을 차단합니다.
        if (!isPremium && currentTeams.length >= 2) {
          throw new Error("무료 요금제는 최대 2개의 팀만 소속(생성/참여)할 수 있습니다.");
        }
      }

      // [방장 실명제 강제] 유저 문서에 실명을 업데이트합니다.
      await setDoc(userRef, {
        user_id: currentUser.uid,
        name: adminName,
        joined_team_ids: currentTeams,
        is_premium: isPremium
      }, { merge: true });

      // 무작위 6자리 초대코드 발급 및 팀 새 문서 생성
      const inviteCode = generateInviteCode();
      const newTeamRef = doc(collection(db, 'Teams'));

      // [양방향 무결성] Teams 컬렉션에 새 팀 저장 (초기 멤버 배열에 방장 uid를 미리 넣음)
      const teamData = {
        team_id: newTeamRef.id,
        team_name: teamName,
        invite_code: inviteCode,
        admin_id: currentUser.uid,
        member_ids: [currentUser.uid], // 최초 생성 시 방장이 첫 번째 멤버로 등록됨
        created_at: serverTimestamp()
      };
      
      await setDoc(newTeamRef, teamData);

      // 방장의 joined_team_ids 배열에 새로 만든 팀 ID를 추가하여 결합
      await updateDoc(userRef, {
        joined_team_ids: arrayUnion(newTeamRef.id)
      });

      setIsLoading(false);
      return teamData; // 성공 시 생성된 팀 정보 반환

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

      // [단건 조회 규칙 통과] 입력한 초대코드가 일치하는 팀 서랍장을 검색합니다.
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

      // [BM 정책 반영] 해당 팀의 정원이 무료 한도인 10명을 초과하는지 백엔드 레벨에서 차단합니다.
      // (방장의 요금제 기준이 정원이 되므로 방장의 프리미엄 여부를 확인해야 하지만, v1단계선 팀당 10명 제한을 우선 적용합니다)
      if (currentMembers.length >= 10) {
        throw new Error("해당 팀의 정원(10명)이 가득 차서 참여할 수 없습니다.");
      }

      // 내 유저 서랍장(Users) 상태 확인
      const userRef = doc(db, 'Users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const myTeams = userData.joined_team_ids || [];
        
        // 중복 참여 방어 코드
        if (myTeams.includes(teamId)) {
          throw new Error("이미 가입되어 활동 중인 팀입니다.");
        }
        // 내 요금제 기준 소속 팀 개수(2개) 초과 제한
        if (!userData.is_premium && myTeams.length >= 2) {
          throw new Error("무료 요금제는 최대 2개의 팀만 소속(생성/참여)할 수 있습니다.");
        }
      }

      // [교정된 규칙 통과] Teams 문서의 member_ids 배열에 내 uid를 안전하게 결합시킵니다.
      await updateDoc(doc(db, 'Teams', teamId), {
        member_ids: arrayUnion(currentUser.uid)
      });

      // 내 유저 문서의 joined_team_ids 배열에도 이 팀 ID를 추가하여 결합을 마칩니다.
      await setDoc(userRef, {
        user_id: currentUser.uid,
        joined_team_ids: arrayUnion(teamId)
      }, { merge: true });

      setIsLoading(false);
      return teamData; // 가입 성공한 팀 정보 반환

    } catch (err) {
      console.error("팀 참여 오류:", err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { createTeam, joinTeam, isLoading, error };
};
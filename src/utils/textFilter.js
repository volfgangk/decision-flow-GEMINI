// src/utils/textFilter.js

// 차단할 부적절한 단어 사전 (추후 운영 상황에 맞춰 얼마든지 추가 가능)
const BAD_WORDS = [
    '씨발', '시발', '개새끼', '병신', '지랄', '좆', '썅', 
    '애미', '애비', '느금마', '창녀', '미친', '새끼',
    'fuck', 'shit', 'bitch', 'asshole'
  ];
  
  /**
   * 텍스트에 비속어가 포함되어 있는지 검사 (공백을 무시하여 우회 입력 차단)
   */
  export const containsProfanity = (text) => {
    if (!text) return false;
    // 모든 공백 제거 후 소문자로 변환하여 검사 (예: "씨 발", "F u c k")
    const noSpaceText = text.replace(/\s+/g, '').toLowerCase();
    return BAD_WORDS.some(badWord => noSpaceText.includes(badWord));
  };
  
  /**
   * 모든 텍스트 입력창 공용 검증 함수 (팀명, 안건 제목, 실명 등에 모두 적용)
   * @param {string} text - 유저가 입력한 텍스트
   * @param {number} maxLength - 해당 입력창의 최대 허용 글자 수
   */
  export const validateInput = (text, maxLength) => {
    const trimmedText = (text || '').trim();
    
    if (trimmedText.length === 0) {
      return { isValid: false, errorMessage: '내용을 입력해 주세요.' };
    }
    
    if (trimmedText.length > maxLength) {
      return { isValid: false, errorMessage: `최대 ${maxLength}자까지만 입력 가능합니다.` };
    }
    
    if (containsProfanity(trimmedText)) {
      return { isValid: false, errorMessage: '부적절한 단어가 포함되어 있어 사용할 수 없습니다.' };
    }
    
    return { isValid: true, errorMessage: '' };
  };
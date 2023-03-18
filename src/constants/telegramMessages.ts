import { Row } from 'typings/wantedGigs';

export const registChatRoomMessage = `
<b>🛎 외주 알림이 등록되었습니다.</b>
%0A%0A
<b>알림을 받을 채팅방</b>: ${process.env.USER_CHAT_ID}
%0A%0A
`;

export const registMessage = (message: Row) => `
<b>💌 새로운 외주가 등록되었습니다.</b>
%0A%0A
<b>제목</b>: [${message.id}] ${message.title} <b>(${message.work_place_txt})</b>
%0A
<b>분류</b>: ${message.jobs}
%0A%0A
<b>급여</b>: 최소 ${message.salary.start}만원 ~ 최고 ${message.salary.end}만원
%0A%0A
<b>근무기간</b>: ${message.term.start}개월 ~ ${
  message.term.end ? message.term.end + '개월' : ''
}
%0A
<b>근무장소</b>: ${message.address}
`;

export const registSuccessMessage = (message: Row) => `
<b>🎉 매칭 요청이 완료되었습니다.</b>
%0A%0A
<b>제목</b>: [${message.id}] ${message.title} <b>(${message.work_place_txt})</b>
%0A
<b>요청 일자</b>: ${new Date().toLocaleDateString()}
%0A%0A
<b>상세보기</b>: https://www.wanted.co.kr/gigs/projects/${message.id}
`;

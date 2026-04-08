export interface Program {
  id: number
  title: string
  img: string
  badges: string[]
}

export const PROGRAMS: Program[] = [
  { id: 1, img: '/main/program/card_02.jpg', title: '🇺🇸 미국 명문\n공립학교 캠프',        badges: ['뉴저지', '초3-고1'] },
  { id: 2, img: '/main/program/card_03.jpg', title: '🇨🇦 캐나다 명문\n사립학교 캠프',      badges: ['밴쿠버-써리', '초5-중2'] },
  { id: 3, img: '/main/program/card_04.jpg', title: '🇬🇧 영국 보딩스쿨\n& 유럽 여행',     badges: ['초4-고2'] },
  { id: 4, img: '/main/program/card_01.jpg', title: '🇵🇭 필리핀 소그룹 수업\n& 액티비티',  badges: ['세부', '초2-중3'] },
  { id: 5, img: '/main/program/card_05.jpg', title: '🇳🇿 뉴질랜드 공립\n스쿨링 프로그램', badges: ['오클랜드', '초5-중1'] },
  { id: 6, img: '/main/program/card_06.jpg', title: '🇳🇿 뉴질랜드 홈스테이\n& 문화탐방',  badges: ['해밀턴', '초2-중3'] },
]

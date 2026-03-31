'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ReviewSection.module.css'

const REVIEWS = [
  { id: 1,  text: '통화했을때 이제 남은 시간이 얼마 없어서 매일 재밌게 즐겁게 보내는게 목표라고 하더라고요. 그 말을 듣는데 어찌나 기특하던지.. 캠프를 통해서 정서적으로 훌쩍 자란 것 같단 생각이 많이 들었습니다. ', author: '송*연', tags: ['뉴질랜드 10주', '나홀로'] },
  { id: 2,  text: '아이들이 얼마나 즐겁고 편하게 지내는지, 사진 하나하나 밝고 개구진 표정들이 참 따뜻하고 감사하게 느껴집니다. 아이들에게는 오랫동안 기억에 남을 것 같아요.', author: '박*진', tags: ['뉴질랜드 3주', '부모동반'] },
  { id: 3,  text: '자연환경이 좋아서 그런지 아이가 스트레스 없이 잘 지냈어요~ 홈스테이하면서 영어를 생활 속에서 배우는 느낌이라 더 좋았던 것 같고요. 전반적으로 만족스러운 초등 영어캠프였어요 ㅎㅎ', author: '한*린', tags: ['뉴질랜드 4주', '나홀로'] },
  { id: 4,  text: '뉴질랜드 어학캠프 보내고 나서 아이가 좀 달라졌어요… 처음엔 영어 때문에 힘들어했는데 점점 적응하더니 자신감이 붙더라고요. 현지 친구들이랑 어울리면서 영어회화도 많이 늘었어요 ㅎㅎ', author: '오*영', tags: ['뉴질랜드 4주', '나홀로'] },
  { id: 5,  text: '처음 접하는 낯선 환경 속에서 잘 적응할 수 있을지 걱정이 되었어요. 새로운 친구들과 어울리며 다양한 경험을 하고, 영어에 대한 자신감도 키워오는 모습을 보니 정말 뿌듯하네요ㅎㅎ', author: '강*은', tags: ['필리핀 4주', '나홀로'] },
  { id: 6,  text: '필리핀 어학캠프는 관리형이라 생활이나 공부 둘 다 잡아줘서 마음이 편했어요… 영어회화 실력도 눈에 띄게 늘었고요. 가성비 생각하면 만족도 높은 영어캠프였던 것 같아요 ㅎㅎ', author: '지*훈', tags: ['필리핀 4주', '나홀로'] },
  { id: 7,  text: '좀 차분한 분위기라 보내기 괜찮았어요~ 수업이랑 문화체험이 같이 있어서 아이도 지루해하지 않았다고 하네요. 영어에 흥미 붙이기에는 좋은 환경인 것 같아요 ㅎㅎ', author: '신*라', tags: ['영국 4주', '나홀로'] },
  { id: 8,  text: '토론이나 발표 수업이 많아서 좀 부담스러울까 걱정했는데요… 그만큼 스피킹 실력은 확실히 늘었어요. 런던 같은 곳도 가보고 문화체험까지 해서 기억에 오래 남을 것 같아요 ㅎㅎ', author: '김*현', tags: ['영국 4주', '나홀로'] },
  { id: 9,  text: '', author: '', tags: [] },
  { id: 10, text: '', author: '', tags: [] },
  { id: 11, text: '', author: '', tags: [] },
  { id: 12, text: '', author: '', tags: [] },
]

// 4카드 = 2행씩 배경 변경 (총 3그룹)
const BG_GRADIENTS = [
  'linear-gradient(180deg, #4C85FF 0%, #E5EDFF 100%)',
  'linear-gradient(180deg, #0030B0 0%, #4C85FF 100%)',
  'linear-gradient(180deg, #001A6E 0%, #0030B0 100%)',
]

// 카드 높이 425px + gap 24px = 449px/행, 2행 = 898px/그룹
const CARD_ROW_HEIGHT = 425 + 24
const GROUP_HEIGHT = CARD_ROW_HEIGHT * 2 // 4카드(2열×2행) = 898px

const LEFT  = REVIEWS.filter((_, i) => i % 2 === 0) // 6개
const RIGHT = REVIEWS.filter((_, i) => i % 2 === 1) // 6개

export default function ReviewSection() {
  const [bgIndex, setBgIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const scrolledInto = -section.getBoundingClientRect().top
      const idx = Math.floor(Math.max(0, scrolledInto) / GROUP_HEIGHT)
      setBgIndex(Math.min(idx, BG_GRADIENTS.length - 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.review}
      style={{ background: BG_GRADIENTS[bgIndex] }}
    >
      <h2 className={styles.review_title}>
        소중한 경험,<br />한평생유학에서만<br />가능합니다.
      </h2>

      <div className={styles.review_cols}>
        {/* 왼쪽 열 */}
        <div className={styles.review_col}>
          {LEFT.map((r) => (
            <div key={r.id} className={styles.review_card}>
              <div className={styles.review_card_top}>
                <p className={styles.review_text}>{r.text}</p>
                <p className={styles.review_author}>{r.author}</p>
              </div>
              <div className={styles.review_tags}>
                {r.tags.map((tag) => (
                  <span key={tag} className={styles.review_tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 열 — 160px 아래 offset */}
        <div className={`${styles.review_col} ${styles.review_col_right}`}>
          {RIGHT.map((r) => (
            <div key={r.id} className={styles.review_card}>
              <div className={styles.review_card_top}>
                <p className={styles.review_text}>{r.text}</p>
                <p className={styles.review_author}>{r.author}</p>
              </div>
              <div className={styles.review_tags}>
                {r.tags.map((tag) => (
                  <span key={tag} className={styles.review_tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

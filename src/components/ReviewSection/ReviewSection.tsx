'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ReviewSection.module.css'

const REVIEWS = [
  { id: 1,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 2,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 3,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 4,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 5,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 6,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 7,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 8,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 9,  text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 10, text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 11, text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
  { id: 12, text: '매 순간마다 아이들 사랑으로 섬겨주겨서 ~~너무 감사했습니다. 꿈에서도 영어로 꿈꾼다고 하더니 그새 영어가 더 늘었네요~~ㅎㅎ', author: '송*연', tags: ['뉴질랜드', '10주 프로그램'] },
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

'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './ReviewSection.module.css'

const REVIEWS = [
  { id: 1,  image: '/main/review/review_01.png', text: '통화했을때 이제 남은 시간이 얼마 없어서 매일 재밌게 즐겁게 보내는게 목표라고 하더라고요. 그 말을 듣는데 어찌나 기특하던지.. 캠프를 통해서 정서적으로 훌쩍 자란 것 같단 생각이 많이 들었습니다. ', author: '송*연', tags: ['뉴질랜드 10주', '나홀로'] },
  { id: 2,  image: '/main/review/review_02.jpg', text: '아이들이 얼마나 즐겁고 편하게 지내는지, 사진 하나하나 밝고 개구진 표정들이 참 따뜻하고 감사하게 느껴집니다. 아이들에게는 오랫동안 기억에 남을 것 같아요.', author: '박*진', tags: ['뉴질랜드 3주', '부모동반'] },
  { id: 3,  image: '/main/review/review_03.jpg', text: '자연환경이 좋아서 그런지 아이가 스트레스 없이 잘 지냈어요~ 홈스테이하면서 영어를 생활 속에서 배우는 느낌이라 더 좋았던 것 같고요. 전반적으로 만족스러운 초등 영어캠프였어요 ㅎㅎ', author: '한*린', tags: ['뉴질랜드 4주', '나홀로'] },
  { id: 4,  image: '/main/review/review_04.jpg', text: '뉴질랜드 어학캠프 보내고 나서 아이가 좀 달라졌어요… 처음엔 영어 때문에 힘들어했는데 점점 적응하더니 자신감이 붙더라고요. 현지 친구들이랑 어울리면서 영어회화도 많이 늘었어요^^', author: '오*영', tags: ['뉴질랜드 4주', '나홀로'] },
  { id: 5,  image: '/main/review/review_05.jpg', text: '처음 접하는 낯선 환경 속에서 잘 적응할 수 있을지 걱정이 되었어요. 새로운 친구들과 어울리며 다양한 경험을 하고, 영어에 대한 자신감도 키워오는 모습을 보니 정말 뿌듯하네요ㅎㅎ', author: '강*은', tags: ['필리핀 4주', '나홀로'] },
  { id: 6,  image: '/main/review/review_06.jpg', text: '필리핀 어학캠프는 관리형이라 생활이나 공부 둘 다 잡아줘서 마음이 편했어요… 영어회화 실력도 눈에 띄게 늘었고요. 가성비 생각하면 만족도 높은 영어캠프였던 것 같아요~', author: '지*훈', tags: ['필리핀 4주', '나홀로'] },
  { id: 7,  image: '/main/review/review_07.jpg', text: '좀 차분한 분위기라 보내기 괜찮았어요~ 수업이랑 문화체험이 같이 있어서 아이도 지루해하지 않았다고 하네요. 영어에 흥미 붙이기에는 좋은 환경인 것 같아요~', author: '신*라', tags: ['영국 4주', '나홀로'] },
  { id: 8,  image: '/main/review/review_08.jpg', text: '토론이나 발표 수업이 많아서 좀 부담스러울까 걱정했는데요… 그만큼 스피킹 실력은 확실히 늘었어요. 런던 같은 곳도 가보고 문화체험까지 해서 기억에 오래 남을 것 같아요 ㅎㅎ', author: '김*현', tags: ['영국 4주', '나홀로'] },
  { id: 9,  image: '/main/review/review_09.jpg', text: '초등학생 영어캠프로 캐나다 선택했는데 잘한 것 같아요~ 자연환경도 좋고 아이가 편안하게 지냈다고 하더라고요. 홈스테이 가족도 잘 챙겨주셔서 영어에 대한 거부감이 많이 줄었어요^^', author: '이*정', tags: ['캐나다 4주', '나홀로'] },
  { id: 10, image: '/main/review/review_010.jpg', text: '전반적으로 분위기가 안정적이라 마음 놓고 보낼 수 있었어요… 수업이랑 액티비티가 잘 섞여 있어서 영어실력향상에도 도움이 된 것 같고요. 무엇보다 아이가 적극적으로 변한 게 제일 만족스럽네요!', author: '최*영', tags: ['캐나다 4주', '나홀로'] },
  { id: 11, image: '/main/review/review_011.jpg', text: '고민하다가 보내봤는데… 솔직히 처음엔 걱정 많았거든요. 근데 아이가 현지 학교 수업이랑 액티비티 하면서 영어로 말하는 게 자연스러워졌다고 해서 놀랐어요 ㅎㅎ 여름방학 영어캠프로 확실히 효과는 있었던 것 같아요.', author: '김*은', tags: ['미국 3주', '나홀로'] },
  { id: 12, image: '/main/review/review_012.jpg', text: '미국 가서 계속 영어만 쓰다 보니까 처음엔 좀 힘들어했는데요, 일주일 지나니까 적응했더라고요ㅎㅎ 다양한 나라 친구들이랑 어울리면서 영어회화 실력도 늘고, 진짜 해외 경험 제대로 한 느낌이에요.', author: '박*재', tags: ['미국 3주', '나홀로'] },
]

// 4카드 = 2행씩 배경 변경 (총 3그룹)
const BG_IMAGES = [
  '/main/review/review_background_01.png',
  '/main/review/review_background_02.png',
  '/main/review/review_background_03.png',
]

// 카드 높이 425px + gap 24px = 449px/행, 1.5행 = 673px/그룹
const CARD_ROW_HEIGHT = 425 + 24
const GROUP_HEIGHT = CARD_ROW_HEIGHT * 1.5 // 약 673px마다 배경 변경

const LEFT  = REVIEWS.filter((_, i) => i % 2 === 0) // 6개
const RIGHT = REVIEWS.filter((_, i) => i % 2 === 1) // 6개

export default function ReviewSection() {
  const [bgIndex, setBgIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [gradientVisible, setGradientVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      setVisible(inView)
      // 섹션 끝이 화면 밖에 있을 때만 그라디언트 표시
      setGradientVisible(rect.top < window.innerHeight && rect.bottom > window.innerHeight)
      const scrolled = Math.max(0, -rect.top)
      const idx = Math.min(Math.floor(scrolled / GROUP_HEIGHT), BG_IMAGES.length - 1)
      setBgIndex(idx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className={`${styles.review}${gradientVisible ? ` ${styles.review_visible}` : ''}`}>
      {visible && BG_IMAGES.map((img, i) => (
        <div
          key={img}
          className={styles.review_bg}
          style={{
            backgroundImage: `url(${img})`,
            opacity: i <= bgIndex ? 1 : 0,
          }}
        />
      ))}
      <h2 className={styles.review_title}>
        소중한 경험,<br />한평생유학에서만<br />가능합니다.
      </h2>

      <div className={styles.review_cols}>
        {/* 왼쪽 열 */}
        <div className={styles.review_col}>
          {LEFT.map((r) => (
            <div key={r.id} className={styles.review_card}>
              <div className={styles.review_image_wrap}>
                <Image src={r.image} alt={r.author} fill sizes="424px" loading="lazy" className={styles.review_image} />
              </div>
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
              <div className={styles.review_image_wrap}>
                <Image src={r.image} alt={r.author} fill sizes="424px" loading="lazy" className={styles.review_image} />
              </div>
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

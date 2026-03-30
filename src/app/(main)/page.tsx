import styles from './page.module.css'
import ProgramSwiper from '@/components/ProgramSwiper/ProgramSwiper'
import ReviewSection from '@/components/ReviewSection/ReviewSection'
import { PROGRAMS } from '@/data/programs'

const SYSTEM_CARDS = [
  {
    id: 1,
    title: '전문가 상담 진행',
    desc: '뉴질랜드·캐나다 등 해외 전문가의 상담 진행',
    img: '/main/system/system01.png',
  },
  {
    id: 2,
    title: '안심할 수 있는 프로그램',
    desc: '현지 사진 제공으로 안심할 수 있는 프로그램',
    img: '/main/system/system02.png',
  },
  {
    id: 3,
    title: '신속한 현지 네트워크',
    desc: '빠른 응대로 신뢰할 수 있는 시스템',
    img: '/main/system/system03.png',
  },
  {
    id: 4,
    title: '맞춤 유학 프로그램',
    desc: '개개인의 상황을 고려한 맞춤 프로그램 추천',
    img: '/main/system/system04.png',
  },
]

export default function Home() {
  return (
    <div className={styles.container}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.hero_card_video}>
          <video
            className={styles.hero_video}
            src="/main/main_viedo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <p className={styles.hero_title}>
            유학은<br />한평생에서
          </p>
        </div>

        <div className={styles.hero_card_cta}>
          <p className={styles.hero_cta_title}>
            나에게 딱맞는<br />유학 프로그램은?
          </p>
        </div>
      </section>

      {/* ── 한평생만의 체계적인 시스템 ── */}
      <section className={styles.system}>
        <h2 className={styles.system_title}>한평생만의 체계적인 시스템</h2>

        <div className={styles.system_content}>
          {/* 2×2 카드 그리드 */}
          <div className={styles.system_grid}>
            {SYSTEM_CARDS.map((card) => (
              <div key={card.id} className={styles.system_card}>
                <img src={card.img} alt={card.title} className={styles.system_card_img} />
                <div className={styles.system_card_overlay}>
                  <p className={styles.system_card_title}>{card.title}</p>
                  <p className={styles.system_card_desc}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 간편상담 폼 */}
          <div className={styles.system_form_wrap}>
            <h3 className={styles.system_form_heading}>간편상담</h3>
            <form className={styles.system_form}>
              <div className={styles.form_field}>
                <label className={styles.form_label}>이름 <span className={styles.form_required}>*</span></label>
                <input className={styles.form_input} type="text" placeholder="예) 홍길동" />
              </div>
              <div className={styles.form_field}>
                <label className={styles.form_label}>연락처 <span className={styles.form_required}>*</span></label>
                <input className={styles.form_input} type="tel" placeholder="예) 010-0000-0000" />
              </div>
              <div className={styles.form_field}>
                <label className={styles.form_label}>거주지역 <span className={styles.form_required}>*</span></label>
                <input className={styles.form_input} type="text" placeholder="예) 서울시 도봉구" />
              </div>
              <div className={styles.form_field}>
                <label className={styles.form_label}>희망 시작일 <span className={styles.form_required}>*</span></label>
                <input className={styles.form_input} type="text" placeholder="예) 2026년 4월" />
              </div>
              <div className={styles.form_field_large}>
                <label className={styles.form_label}>문의사항 <span className={styles.form_required}>*</span></label>
                <textarea
                  className={styles.form_textarea}
                  placeholder="구체적인 내용을 적어주시면 상세한 상담이 가능합니다."
                />
              </div>
            </form>

            {/* 개인정보 동의 */}
            <label className={styles.privacy_row}>
              <span className={styles.privacy_link}>개인정보보호처리방침</span>
              <span className={styles.privacy_agree}>동의</span>
              <input type="checkbox" className={styles.privacy_input} />
              <span className={styles.privacy_checkbox}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <g clipPath="url(#clip0_106_222)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.69591 2.29991C9.82245 2.42649 9.89354 2.59815 9.89354 2.77713C9.89354 2.95612 9.82245 3.12778 9.69591 3.25436L4.63656 8.31371C4.5697 8.38058 4.49032 8.43363 4.40295 8.46983C4.31559 8.50602 4.22195 8.52465 4.12738 8.52465C4.03282 8.52465 3.93918 8.50602 3.85181 8.46983C3.76445 8.43363 3.68507 8.38058 3.61821 8.31371L1.10451 5.80046C1.04004 5.73819 0.988615 5.66371 0.953239 5.58135C0.917863 5.499 0.899242 5.41043 0.898463 5.3208C0.897684 5.23118 0.914763 5.14229 0.948702 5.05934C0.982642 4.97638 1.03276 4.90102 1.09614 4.83764C1.15952 4.77426 1.23488 4.72414 1.31784 4.6902C1.40079 4.65626 1.48968 4.63918 1.5793 4.63996C1.66893 4.64074 1.7575 4.65936 1.83986 4.69474C1.92221 4.73011 1.99669 4.78154 2.05896 4.84601L4.12716 6.91421L8.74101 2.29991C8.80369 2.23718 8.87812 2.18742 8.96005 2.15347C9.04197 2.11952 9.12978 2.10205 9.21846 2.10205C9.30714 2.10205 9.39495 2.11952 9.47687 2.15347C9.55879 2.18742 9.63322 2.23718 9.69591 2.29991Z" fill="#D0D0D0"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_106_222">
                      <rect width="10.8" height="10.8" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </label>

            <button type="submit" className={styles.form_submit}>무료상담 신청하기</button>
          </div>
        </div>
      </section>

      {/* ── 한평생만의 전문 유학 프로그램 ── */}
      <section className={styles.program}>
        <h2 className={styles.program_title}>한평생만의 전문 유학 프로그램</h2>
        <ProgramSwiper programs={[...PROGRAMS, ...PROGRAMS, ...PROGRAMS]} />
      </section>

      {/* ── 후기 ── */}
      <ReviewSection />

    </div>
  )
}

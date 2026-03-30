import styles from './page.module.css'
import ProgramSwiper from '@/components/ProgramSwiper/ProgramSwiper'
import ReviewSection from '@/components/ReviewSection/ReviewSection'
import ConsultForm from './ConsultForm'
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
          <button className={styles.hero_cta_btn}>
            맞춤 테스트 하러가기
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.40355 7.10268H12.3217L8.27619 3.24979C7.90818 2.8993 7.90818 2.33118 8.27619 1.98069C8.64421 1.6302 9.24074 1.6302 9.60876 1.98069L15.263 7.36562L15.3274 7.43398C15.6293 7.78649 15.608 8.30614 15.263 8.63472L9.60876 14.0196C9.24074 14.3701 8.64421 14.3701 8.27619 14.0196C7.90818 13.6692 7.90818 13.101 8.27619 12.7505L12.3217 8.89766L1.40355 8.89766C0.883093 8.89766 0.461182 8.49584 0.461182 8.00017C0.461182 7.5045 0.883093 7.10268 1.40355 7.10268Z" fill="#1D1D1D"/>
            </svg>
          </button>
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
          <ConsultForm />
        </div>
      </section>

      {/* ── 한평생만의 전문 유학 프로그램 ── */}
      <section className={styles.program}>
        <h2 className={styles.program_title}>한평생만의 전문 유학 프로그램</h2>
        <ProgramSwiper programs={PROGRAMS} />
      </section>

      {/* ── 후기 ── */}
      <ReviewSection />

    </div>
  )
}

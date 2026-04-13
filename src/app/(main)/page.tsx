import styles from './page.module.css'
import ProgramSwiper from '@/components/ProgramSwiper/ProgramSwiper'
import ReviewSection from '@/components/ReviewSection/ReviewSection'
import HeroConsultButton from './HeroConsultButton'
import ProcessSection from './ProcessSection'
import { PROGRAMS } from '@/data/programs'

const REASONS = [
  {
    id: 1,
    img: '/main/reason/reason_01.png',
    title: '현지 담당자 연결',
    desc: '도착 후부터 귀국까지\n실시간으로 대응합니다.',
  },
  {
    id: 2,
    img: '/main/reason/reason_02.png',
    title: '매일매일 밀착사진',
    desc: '아이의 생활 모습과 적응 상태를\n부모님께 공유합니다.',
  },
  {
    id: 3,
    img: '/main/reason/reason_03.png',
    title: '출국 전 준비체크',
    desc: '필수 준비사항을 단계별로 안내하고\n출국 전까지 함께 점검합니다.',
  },
  {
    id: 4,
    img: '/main/reason/reason_04.png',
    title: '검증된 학교 추천',
    desc: '운영 기준을 통과한 학교 중에서\n학생에게 맞는 곳을 선별합니다.',
  },
]

export default function Home() {
  return (
    <div className={styles.container}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <video
          className={styles.hero_video}
          src="https://pub-953bd72af6024bfdb14d041984863dfb.r2.dev/youhak_hero_banner.mp4"
          poster="https://pub-a1f3c3db5a6946daa21b9a8dc8f05251.r2.dev/youhak_hero_banner_thumb.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <p className={styles.hero_title}>
          잘 보내는 것보다,<br />잘 적응하는 유학이<br className={styles.hero_title_br_mobile}/> 중요합니다
        </p>
        <p className={styles.hero_subtitle}>
          아이 성향에 맞는 프로그램부터<br className={styles.hero_title_br_mobile}/> 현지 생활 적응까지 함께 관리합니다
        </p>
        <HeroConsultButton />
      </section>

      {/* ── 유학 과정 ── */}
      <ProcessSection />


      {/* ── 한평생만의 전문 유학 프로그램 ── */}
      <section className={styles.program}>
        <div className={styles.program_heading}>
          <h2 className={styles.program_title}>전문 유학 프로그램</h2>
          <p className={styles.program_subtitle}>
            <span className={styles.program_subtitle_desktop}>검증된 명문학교부터 신나는 액티비티까지</span>
            <span className={styles.program_subtitle_mobile}>첫 안내부터 현지 도착까지 안전하게</span>
          </p>
        </div>
        <ProgramSwiper programs={PROGRAMS} />
      </section>

      {/* ── 한평생유학을 선택하는 이유 ── */}
      <section className={styles.reason}>
        <div className={styles.reason_heading}>
          <h2 className={styles.reason_title}>한평생유학을 선택하는 이유</h2>
          <p className={styles.reason_subtitle}>한평생만의 체계적인 시스템으로 높은 만족도</p>
        </div>
        <div className={styles.reason_cards}>
          {REASONS.map((item) => (
            <div key={item.id} className={styles.reason_card}>
              <img src={item.img} alt={item.title} className={styles.reason_card_img} />
              <p className={styles.reason_card_title}>{item.title}</p>
              <p className={styles.reason_card_desc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 후기 ── */}
      <ReviewSection />

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.cta_top}>
          <img src="/main/cta/white_logo.png" alt="한평생유학" className={styles.cta_logo} />
          <p className={styles.cta_title}>아이가 잘 지내는 유학,<br className={styles.cta_title_br} /> 지금 경험해보세요.</p>
        </div>
        <HeroConsultButton variant="cta" />
      </section>

    </div>
  )
}

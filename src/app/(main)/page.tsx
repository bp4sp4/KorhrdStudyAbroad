import styles from './page.module.css'
import ProgramSwiper from '@/components/ProgramSwiper/ProgramSwiper'
import ReviewSection from '@/components/ReviewSection/ReviewSection'
import HeroConsultButton from './HeroConsultButton'
import ProcessSection from './ProcessSection'
import { PROGRAMS } from '@/data/programs'

export default function Home() {
  return (
    <div className={styles.container}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <video
          className={styles.hero_video}
          src="https://pub-953bd72af6024bfdb14d041984863dfb.r2.dev/freepik_video-upscale_2738133500_fast.mp4"
          poster="https://pub-a1f3c3db5a6946daa21b9a8dc8f05251.r2.dev/hero_poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <p className={styles.hero_title}>
          잘 보내는 것보다,<br />잘 적응하는 유학이 중요합니다
        </p>
        <p className={styles.hero_subtitle}>
          아이 성향에 맞는 프로그램부터<br />현지 생활 적응까지 함께 관리합니다
        </p>
        <HeroConsultButton />
      </section>

      {/* ── 유학 과정 ── */}
      <ProcessSection />


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

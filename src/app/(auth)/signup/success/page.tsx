'use client'

import Link from 'next/link'
import styles from './success.module.css'

export default function SignupSuccessPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>회원가입이 성공적으로<br className={styles.mobile_br} /> 완료되었습니다.</h1>

        <div className={styles.img_wrap}>
          <img src="/joinsuscess.png" alt="회원가입 완료" className={styles.img} />
          <p className={styles.sub}>한평생유학에서 함께 준비해보세요!</p>
        </div>

        <div className={styles.btn_row}>
          <Link href="/" className={styles.btn_home}>홈으로 돌아가기</Link>
          <Link href="/program" className={styles.btn_apply}>프로그램 알아보기</Link>
        </div>
      </div>
    </div>
  )
}

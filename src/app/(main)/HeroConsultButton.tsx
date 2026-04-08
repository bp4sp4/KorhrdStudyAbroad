'use client'

import { useState } from 'react'
import styles from './page.module.css'
import ConsultModal from './ConsultModal'

export default function HeroConsultButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className={styles.hero_cta_btn} onClick={() => setOpen(true)}>
        무료상담 신청하기 →
      </button>
      {open && <ConsultModal onClose={() => setOpen(false)} />}
    </>
  )
}

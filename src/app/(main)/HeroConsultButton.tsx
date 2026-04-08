'use client'

import { useState } from 'react'
import styles from './page.module.css'
import ConsultModal from './ConsultModal'

interface Props {
  variant?: 'hero' | 'cta'
}

export default function HeroConsultButton({ variant = 'hero' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={variant === 'cta' ? styles.cta_btn : styles.hero_cta_btn}
        onClick={() => setOpen(true)}
      >
        무료상담 신청하기{variant === 'hero' ? ' →' : ''}
      </button>
      {open && <ConsultModal onClose={() => setOpen(false)} />}
    </>
  )
}

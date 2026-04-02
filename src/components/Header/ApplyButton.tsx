'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import styles from './Header.module.css'

export default function ApplyButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  if (isLoggedIn) {
    return <a href="/apply" className={styles.btn_mypage}>참가신청</a>
  }

  return (
    <>
      <button className={styles.btn_apply} onClick={() => setShowModal(true)}>
        참가신청
      </button>

      {showModal && createPortal(
        <div className={styles.modal_overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modal_text}>로그인이 필요한 서비스입니다</p>
            <button className={styles.modal_btn_confirm} onClick={() => { setShowModal(false); router.push('/login') }}>확인</button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

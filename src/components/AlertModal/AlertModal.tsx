'use client'

import styles from './AlertModal.module.css'

interface AlertModalProps {
  message: string
  onClose: () => void
}

export default function AlertModal({ message, onClose }: AlertModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
        <button className={styles.btn_confirm} onClick={onClose}>확인</button>
      </div>
    </div>
  )
}

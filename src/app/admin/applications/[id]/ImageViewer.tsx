'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Image {
  label: string
  url: string
}

export default function ImageViewer({ images }: { images: Image[] }) {
  const [active, setActive] = useState<Image | null>(null)

  return (
    <>
      <div className={styles.images_section}>
        {images.map(img => (
          <div key={img.label} className={styles.image_wrap}>
            <p className={styles.image_label}>{img.label}</p>
            <div className={styles.image_thumb_wrap}>
              <img src={img.url} alt={img.label} className={styles.image_thumb} />
            </div>
            <div className={styles.image_btns}>
              <button
                type="button"
                className={styles.img_btn}
                onClick={() => setActive(img)}
              >
                원본 보기
              </button>
              <a
                href={img.url}
                download
                className={styles.img_btn}
              >
                다운로드
              </a>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className={styles.modal_overlay} onClick={() => setActive(null)}>
          <div className={styles.modal_box} onClick={e => e.stopPropagation()}>
            <div className={styles.modal_header}>
              <span className={styles.modal_title}>{active.label}</span>
              <button
                type="button"
                className={styles.modal_close}
                onClick={() => setActive(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modal_body}>
              <img src={active.url} alt={active.label} className={styles.modal_img} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

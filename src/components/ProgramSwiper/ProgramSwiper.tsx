'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import type { Program } from '@/data/programs'
import styles from './ProgramSwiper.module.css'

interface Props {
  programs: Program[]
}

export default function ProgramSwiper({ programs }: Props) {
  return (
    <Swiper
      modules={[Autoplay]}
      loop
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      speed={600}
      slidesPerView="auto"
      spaceBetween={24}
      className={styles.swiper}
    >
      {programs.map((program, i) => (
        <SwiperSlide key={i} className={styles.slide}>
          <div className={styles.card}>
            {program.img && (
              <img
                src={program.img}
                alt={program.title}
                className={styles.card_img}
              />
            )}
            <p className={styles.card_title}>{program.title}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

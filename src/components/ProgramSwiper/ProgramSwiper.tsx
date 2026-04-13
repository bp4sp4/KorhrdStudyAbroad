'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import type { Program } from '@/data/programs'
import styles from './ProgramSwiper.module.css'

interface Props {
  programs: Program[]
}

export default function ProgramSwiper({ programs }: Props) {
  return (
    <Swiper
      speed={600}
      slidesPerView="auto"
      spaceBetween={16}
      className={styles.swiper}
    >
      {programs.map((program, i) => (
        <SwiperSlide key={i} className={styles.slide}>
          <div className={styles.card} style={{ backgroundImage: `url(${program.img})` }}>
            <div className={styles.card_inner}>
              <p className={styles.card_title}>
                {program.flag && (
                  <Image
                    src={program.flag}
                    alt=""
                    width={36}
                    height={36}
                    className={styles.flag_img}
                  />
                )}
                {program.title}
              </p>
              <div className={styles.card_badges}>
                {program.badges.map(b => (
                  <span key={b} className={styles.badge}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

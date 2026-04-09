import type { Metadata } from 'next'
import './globals.css'
import '@/styles/tokens.css'

const SITE_DESCRIPTION =
  '한평생유학은 유학 프로그램을 안내하는 전문 유학원입니다. 맞춤 상담과 견적을 제공합니다.'

export const metadata: Metadata = {
  title: '한평생유학 - 맞춤 유학 프로그램 안내',
  description: SITE_DESCRIPTION,
  keywords: ['유학', '어학연수', '조기유학', '대학진학', '교환학생', '한평생유학'],
  openGraph: {
    title: '한평생유학 - 맞춤 유학 프로그램 안내',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '한평생유학 - 맞춤 유학 프로그램 안내',
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
  verification: {
    google: 'dhGsA2tqMgWPlueLyju6AIMhWPJQSnXPxMbiV2RBJRA',
    other: {
      'naver-site-verification': '5f8123cb0afcc68776ccf389d9d15b198cc2277e',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

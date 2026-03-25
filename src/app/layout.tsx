import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '한평생 바로유학',
  description: '유학 홈페이지',
  openGraph: {
    title: '한평생 바로유학',
    description: '유학 홈페이지',
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
    title: '한평생 바로유학',
    description: '유학 홈페이지',
    images: ['/og-image.png'],
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

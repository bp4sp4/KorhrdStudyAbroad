import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingBanner from '@/components/FloatingBanner/FloatingBanner'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '88px' }}>{children}</main>
      <Footer />
      <FloatingBanner />
    </>
  )
}

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingBanner from '@/components/FloatingBanner/FloatingBanner'
import styles from './layout.module.css'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
      <FloatingBanner />
    </>
  )
}

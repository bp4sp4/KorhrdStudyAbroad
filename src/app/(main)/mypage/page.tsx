'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip_info)">
      <path d="M7.90021 8.548C8.7846 8.97868 9.53711 9.63747 10.082 10.4564C10.627 11.2754 10.9436 12.2249 10.9992 13.207C11.0049 13.3054 10.9911 13.4039 10.9586 13.4969C10.9262 13.5899 10.8758 13.6757 10.8102 13.7492C10.7447 13.8228 10.6653 13.8827 10.5766 13.9255C10.4879 13.9684 10.3916 13.9934 10.2932 13.999C10.1948 14.0046 10.0963 13.9909 10.0033 13.9584C9.91027 13.926 9.82453 13.8756 9.75099 13.81C9.67744 13.7445 9.61753 13.6651 9.57468 13.5764C9.53182 13.4876 9.50685 13.3914 9.50121 13.293C9.44572 12.2691 9.00009 11.3053 8.25593 10.5999C7.51176 9.89439 6.52562 9.5008 5.50021 9.5C4.47479 9.5008 3.48865 9.89439 2.74448 10.5999C2.00032 11.3053 1.55469 12.2691 1.4992 13.293C1.49362 13.3914 1.46872 13.4877 1.42593 13.5764C1.38313 13.6651 1.32327 13.7446 1.24978 13.8102C1.17628 13.8758 1.09058 13.9263 0.99757 13.9587C0.904561 13.9912 0.806065 14.0051 0.707705 13.9995C0.609345 13.9939 0.513047 13.969 0.42431 13.9262C0.335573 13.8834 0.256134 13.8236 0.19053 13.7501C0.124925 13.6766 0.0744395 13.5909 0.041955 13.4979C0.00947059 13.4049 -0.00437633 13.3064 0.00120485 13.208C0.0566755 12.2257 0.373202 11.276 0.918132 10.4569C1.46306 9.6377 2.21667 8.97876 3.1012 8.548C2.59074 8.06729 2.23643 7.44434 2.08419 6.75988C1.93196 6.07542 1.98881 5.36102 2.24739 4.70926C2.50597 4.0575 2.95436 3.49843 3.53443 3.10451C4.1145 2.71059 4.79952 2.49998 5.50071 2.49998C6.20189 2.49998 6.88691 2.71059 7.46698 3.10451C8.04705 3.49843 8.49544 4.0575 8.75402 4.70926C9.0126 5.36102 9.06945 6.07542 8.91722 6.75988C8.76498 7.44434 8.41067 8.06729 7.90021 8.548ZM13.2502 0C13.4491 0 13.6399 0.0790176 13.7805 0.21967C13.9212 0.360322 14.0002 0.551088 14.0002 0.75V2H15.2502C15.4491 2 15.6399 2.07902 15.7805 2.21967C15.9212 2.36032 16.0002 2.55109 16.0002 2.75C16.0002 2.94891 15.9212 3.13968 15.7805 3.28033C15.6399 3.42098 15.4491 3.5 15.2502 3.5H14.0002V4.75C14.0002 4.94891 13.9212 5.13968 13.7805 5.28033C13.6399 5.42098 13.4491 5.5 13.2502 5.5C13.0513 5.5 12.8605 5.42098 12.7199 5.28033C12.5792 5.13968 12.5002 4.94891 12.5002 4.75V3.5H11.2502C11.0513 3.5 10.8605 3.42098 10.7199 3.28033C10.5792 3.13968 10.5002 2.94891 10.5002 2.75C10.5002 2.55109 10.5792 2.36032 10.7199 2.21967C10.8605 2.07902 11.0513 2 11.2502 2H12.5002V0.75C12.5002 0.551088 12.5792 0.360322 12.7199 0.21967C12.8605 0.0790176 13.0513 0 13.2502 0ZM5.50021 4C5.23387 3.99398 4.96901 4.04122 4.72118 4.13897C4.47335 4.23672 4.24755 4.38299 4.05703 4.5692C3.86651 4.75542 3.71512 4.97782 3.61173 5.22334C3.50835 5.46887 3.45506 5.73258 3.45499 5.99899C3.45492 6.2654 3.50808 6.52913 3.61134 6.77471C3.71461 7.02029 3.86589 7.24277 4.05632 7.42907C4.24674 7.61538 4.47247 7.76177 4.72025 7.85964C4.96803 7.95751 5.23286 8.00489 5.49921 7.999C6.02177 7.98744 6.51904 7.77178 6.88458 7.39816C7.25011 7.02455 7.45486 6.52268 7.45499 5.99999C7.45512 5.4773 7.25062 4.97533 6.88527 4.60153C6.51993 4.22773 6.02276 4.01182 5.50021 4Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip_info"><rect width="16" height="16" fill="white"/></clipPath>
    </defs>
  </svg>
)

const IconPayment = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 1.33323C12.3534 1.33323 12.6926 1.47381 12.9427 1.72386C13.1927 1.9739 13.333 2.31317 13.333 2.66677V4C13.6866 4 14.0259 4.14058 14.2759 4.39062C14.5259 4.64065 14.6665 4.97967 14.6665 5.33323V7.51232C14.7665 7.57006 14.8596 7.6408 14.9427 7.72386C15.1927 7.9739 15.333 8.31317 15.333 8.66677V10C15.333 10.3536 15.1927 10.6929 14.9427 10.9429C14.8596 11.0259 14.7665 11.0964 14.6665 11.1541V13.3332C14.6665 13.6868 14.5259 14.0261 14.2759 14.2761C14.0259 14.5262 13.6866 14.6665 13.333 14.6665H3.33301C2.80263 14.6664 2.29399 14.4558 1.91895 14.0808C1.5439 13.7058 1.33301 13.1969 1.33301 12.6665V3.33323C1.33303 2.80284 1.5439 2.29422 1.91895 1.91917C2.29399 1.54412 2.80261 1.33326 3.33301 1.33323H11.9998ZM2.66654 12.6665C2.66654 12.8432 2.73662 13.0129 2.86155 13.1379C2.98655 13.2629 3.15623 13.3332 3.33301 13.3332H13.333V11.3332H11.9998C11.4693 11.3332 10.9605 11.1227 10.5854 10.7476C10.2104 10.3725 9.99977 9.86364 9.99977 9.33323C9.9998 8.80288 10.2104 8.29421 10.5854 7.91917C10.9605 7.5441 11.4693 7.33323 11.9998 7.33323H13.333V5.33323H3.33301C3.10373 5.33322 2.87866 5.29343 2.66654 5.21845V12.6665ZM11.9998 8.66677C11.823 8.66677 11.6533 8.73705 11.5283 8.86208C11.4034 8.98707 11.333 9.15651 11.333 9.33323C11.333 9.51002 11.4033 9.67967 11.5283 9.80469C11.6533 9.92971 11.823 10 11.9998 10H13.9998V8.66677H11.9998ZM3.33301 2.66677C3.15623 2.66679 2.98655 2.73678 2.86155 2.86178C2.73655 2.98678 2.66657 3.15646 2.66654 3.33323C2.66654 3.51 2.73659 3.67967 2.86155 3.80469C2.98655 3.92969 3.15623 3.99997 3.33301 4H11.9998V2.66677H3.33301Z" fill="currentColor"/>
  </svg>
)

const IconApply = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 1.33324C12.3534 1.33324 12.6926 1.47381 12.9427 1.72386C13.1927 1.97391 13.333 2.31317 13.333 2.66677V4C13.6866 4 14.0259 4.14058 14.2759 4.39063C14.5259 4.64065 14.6665 4.97968 14.6665 5.33324V7.51232C14.7665 7.57007 14.8596 7.64081 14.9427 7.72386C15.1927 7.97391 15.333 8.31317 15.333 8.66677V10C15.333 10.3536 15.1927 10.6929 14.9427 10.9429C14.8596 11.026 14.7665 11.0964 14.6665 11.1542V13.3332C14.6665 13.6868 14.5259 14.0261 14.2759 14.2761C14.0259 14.5262 13.6866 14.6665 13.333 14.6665H3.33301C2.80263 14.6664 2.29399 14.4558 1.91895 14.0808C1.5439 13.7058 1.33301 13.1969 1.33301 12.6665V3.33324C1.33303 2.80284 1.5439 2.29422 1.91895 1.91917C2.29399 1.54412 2.80261 1.33326 3.33301 1.33324H11.9998ZM2.66654 12.6665C2.66654 12.8432 2.73662 13.0129 2.86155 13.1379C2.98655 13.2629 3.15623 13.3332 3.33301 13.3332H13.333V11.3332H11.9998C11.4693 11.3332 10.9605 11.1227 10.5854 10.7476C10.2104 10.3725 9.99977 9.86365 9.99977 9.33324C9.9998 8.80289 10.2104 8.29421 10.5854 7.91917C10.9605 7.5441 11.4693 7.33324 11.9998 7.33324H13.333V5.33324H3.33301C3.10373 5.33323 2.87866 5.29344 2.66654 5.21845V12.6665ZM11.9998 8.66677C11.823 8.66677 11.6533 8.73706 11.5283 8.86208C11.4034 8.98707 11.333 9.15651 11.333 9.33324C11.333 9.51002 11.4033 9.67967 11.5283 9.80469C11.6533 9.92972 11.823 10 11.9998 10H13.9998V8.66677H11.9998ZM3.33301 2.66677C3.15623 2.6668 2.98655 2.73678 2.86155 2.86178C2.73655 2.98678 2.66657 3.15646 2.66654 3.33324C2.66654 3.51 2.73659 3.67968 2.86155 3.80469C2.98655 3.92969 3.15623 3.99998 3.33301 4H11.9998V2.66677H3.33301Z" fill="currentColor"/>
  </svg>
)

const IconHistory = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8.00016 1.33333C8.17697 1.33333 8.34654 1.40357 8.47157 1.52859C8.59659 1.65361 8.66683 1.82318 8.66683 1.99999C8.66683 2.17681 8.59659 2.34638 8.47157 2.4714C8.34654 2.59642 8.17697 2.66666 8.00016 2.66666C6.94533 2.66666 5.91418 2.97946 5.03712 3.56549C4.16006 4.15152 3.47647 4.98448 3.07281 5.95902C2.66914 6.93356 2.56352 8.00591 2.76931 9.04048C2.9751 10.075 3.48305 11.0254 4.22893 11.7712C4.97481 12.5171 5.92512 13.0251 6.95968 13.2309C7.99425 13.4366 9.0666 13.331 10.0411 12.9274C11.0157 12.5237 11.8486 11.8401 12.4347 10.963C13.0207 10.086 13.3335 9.05483 13.3335 8C13.3335 7.82318 13.4037 7.65362 13.5288 7.52859C13.6538 7.40357 13.8234 7.33333 14.0002 7.33333C14.177 7.33333 14.3465 7.40357 14.4716 7.52859C14.5966 7.65362 14.6668 7.82318 14.6668 8C14.6668 11.682 11.6822 14.6667 8.00016 14.6667C4.31816 14.6667 1.3335 11.682 1.3335 8C1.3335 4.318 4.31816 1.33333 8.00016 1.33333ZM8.00016 3.99999C8.17697 3.99999 8.34654 4.07023 8.47157 4.19526C8.59659 4.32028 8.66683 4.48985 8.66683 4.66666C8.66683 4.84347 8.59659 5.01304 8.47157 5.13807C8.34654 5.26309 8.17697 5.33333 8.00016 5.33333C7.47275 5.33333 6.95717 5.48973 6.51864 5.78274C6.08011 6.07576 5.73832 6.49224 5.53648 6.97951C5.33465 7.46678 5.28184 8.00295 5.38474 8.52024C5.48763 9.03752 5.7416 9.51267 6.11454 9.88561C6.48748 10.2586 6.96264 10.5125 7.47992 10.6154C7.99721 10.7183 8.53338 10.6655 9.02065 10.4637C9.50792 10.2618 9.9244 9.92005 10.2174 9.48152C10.5104 9.04298 10.6668 8.52741 10.6668 8C10.6668 7.82318 10.7371 7.65362 10.8621 7.52859C10.9871 7.40357 11.1567 7.33333 11.3335 7.33333C11.5103 7.33333 11.6799 7.40357 11.8049 7.52859C11.9299 7.65362 12.0002 7.82318 12.0002 8C12.0002 8.79112 11.7656 9.56448 11.326 10.2223C10.8865 10.8801 10.2618 11.3928 9.5309 11.6955C8.79999 11.9983 7.99573 12.0775 7.2198 11.9231C6.44388 11.7688 5.73115 11.3878 5.17174 10.8284C4.61233 10.269 4.23136 9.55628 4.07702 8.78036C3.92268 8.00443 4.00189 7.20017 4.30464 6.46926C4.6074 5.73836 5.12009 5.11364 5.77788 4.67412C6.43568 4.23459 7.20904 3.99999 8.00016 3.99999ZM12.3808 1.39999C12.4692 1.39999 12.554 1.43511 12.6165 1.49763C12.679 1.56014 12.7142 1.64492 12.7142 1.73333V2.95333C12.7143 3.04162 12.7495 3.12623 12.812 3.1886C12.8745 3.25097 12.9592 3.286 13.0475 3.286H14.2668C14.3552 3.286 14.44 3.32111 14.5025 3.38363C14.565 3.44614 14.6002 3.53092 14.6002 3.61933V4.22933L13.3415 5.488C13.0915 5.73806 12.7524 5.87859 12.3988 5.87866H11.0655L8.47216 8.47133C8.34643 8.59277 8.17803 8.65996 8.00323 8.65844C7.82843 8.65693 7.66122 8.58681 7.53762 8.46321C7.41401 8.3396 7.3439 8.17239 7.34238 7.9976C7.34086 7.8228 7.40806 7.6544 7.5295 7.52866L10.1228 4.936V3.60266C10.1227 3.24916 10.263 2.91009 10.5128 2.66L11.7728 1.39999H12.3808Z" fill="currentColor"/>
  </svg>
)

const NAV_ITEMS = [
  { id: 'info',    icon: <IconInfo />,    label: '내 정보' },
  { id: 'payment', icon: <IconPayment />, label: '결제 내역' },
  { id: 'apply',   icon: <IconApply />,   label: '신청서 작성' },
  { id: 'history', icon: <IconHistory />, label: '프로그램 신청 내역' },
]

type Payment = {
  id: string
  program: string
  amount: number
  payapp_order_id: string | null
  payapp_tid: string | null
  status: string
  created_at: string
}

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: '대기중', completed: '결제완료', failed: '실패', cancelled: '취소',
}
const PAYMENT_STATUS_COLOR: Record<string, string> = {
  pending: 'badge_pending', completed: 'badge_completed', failed: 'badge_failed', cancelled: 'badge_cancelled',
}

type Application = {
  id: string
  program: string | null
  name: string | null
  status: string
  created_at: string
}

const PROGRAM_LABEL: Record<string, string> = {
  philippines_cebu_solo: '필리핀 세부 나홀로',
  usa_newjersey_solo: '미국 뉴저지 나홀로',
  canada_vancouver_solo: '캐나다 밴쿠버-써리 나홀로',
  uk_solo: '영국 나홀로',
  nz_auckland_solo: '뉴질랜드 오클랜드 나홀로',
  nz_hamilton_solo_4w: '뉴질랜드 해밀턴 나홀로 4주',
  nz_hamilton_parent_4w: '뉴질랜드 해밀턴 부모동반 4주',
  nz_hamilton_solo_3w: '뉴질랜드 해밀턴 나홀로 3주',
  nz_hamilton_parent_3w: '뉴질랜드 해밀턴 부모동반 3주',
  nz_hamilton_solo_10w: '뉴질랜드 해밀턴 나홀로 10주',
  nz_hamilton_parent_10w: '뉴질랜드 해밀턴 부모동반 10주',
}

const STATUS_LABEL: Record<string, string> = {
  draft: '임시저장',
  submitted: '신청완료',
  reviewing: '검토중',
  approved: '승인',
  rejected: '반려',
}

export default function MyPage() {
  const router = useRouter()
  const [active, setActive] = useState('info')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [userId, setUserId] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setEmail(user.email ?? '')
      setUserId(user.id)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()
      if (profile) {
        setFullName(profile.full_name ?? '')
        setPhone(profile.phone ?? '')
      }
    }
    load()
  }, [router])

  useEffect(() => {
    if (active !== 'payment' || !userId) return
    const load = async () => {
      setLoadingPayments(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('payments')
        .select('id, program, amount, payapp_order_id, payapp_tid, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      setPayments(data ?? [])
      setLoadingPayments(false)
    }
    load()
  }, [active, userId])

  useEffect(() => {
    if (active !== 'history' || !userId) return
    const load = async () => {
      setLoadingApplications(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('applications')
        .select('id, program, name, status, created_at')
        .eq('user_id', userId)
        .neq('status', 'draft')
        .order('created_at', { ascending: false })
      setApplications(data ?? [])
      setLoadingApplications(false)
    }
    load()
  }, [active, userId])

  const handlePasswordChange = async () => {
    if (password !== passwordConfirm || password.length < 8) return
    setSavingPassword(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ password })
    setSavingPassword(false)
    setPassword('')
    setPasswordConfirm('')
    showToast('비밀번호가 변경되었습니다.')
  }

  const handleProfileSave = async () => {
    setSavingProfile(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', userId)
    setSavingProfile(false)
    showToast('회원 정보가 저장되었습니다.')
  }

  const isPasswordValid = password.length >= 8
  const isPasswordMatch = password === passwordConfirm

  return (
    <div className={styles.container}>

      {toast && (
        <div className={styles.toast}>{toast}</div>
      )}

      {/* 왼쪽 사이드바 */}
      <aside className={styles.sidebar}>
        <p className={styles.sidebar_title}>마이페이지</p>
        <nav className={styles.sidebar_nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.nav_item} ${active === item.id ? styles.nav_active : ''}`}
              onClick={() => item.id === 'apply' ? router.push('/apply') : setActive(item.id)}
            >
              <span className={styles.nav_icon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 오른쪽 콘텐츠 */}
      <div className={styles.content}>
        {active === 'info' && (
          <div className={styles.card}>

            {/* 로그인 정보 */}
            <h2 className={styles.section_title}>로그인 정보</h2>

            <div className={styles.divider} />

            <div className={styles.field}>
              <label className={styles.label}>
                이메일 아이디 <span className={styles.required}>*</span>
              </label>
              <input
                className={`${styles.input} ${styles.input_disabled}`}
                value={email}
                disabled
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                비밀번호 변경 <span className={styles.required}>*</span>
              </label>
              <div className={styles.input_wrap}>
                <input
                  type={showPw ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eye_btn}
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className={styles.input_wrap}>
                <input
                  type={showPwConfirm ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="비밀번호 확인"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eye_btn}
                  onClick={() => setShowPwConfirm(!showPwConfirm)}
                  tabIndex={-1}
                >
                  {showPwConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className={styles.btn_row_right}>
                <button
                  className={styles.btn_change}
                  onClick={handlePasswordChange}
                  disabled={!isPasswordValid || !isPasswordMatch || !passwordConfirm || savingPassword}
                >
                  {savingPassword ? '변경 중...' : '변경하기'}
                </button>
              </div>
            </div>

            <div className={styles.divider} />

            {/* 회원 정보 */}
            <h2 className={styles.section_title}>회원 정보</h2>

            <div className={styles.field}>
              <label className={styles.label}>
                이름 <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                placeholder="홍길동"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                핸드폰 번호 <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              className={styles.btn_save}
              onClick={handleProfileSave}
              disabled={savingProfile}
            >
              {savingProfile ? '저장 중...' : '저장하기'}
            </button>

            <div className={styles.btn_row_withdraw}>
              <button className={styles.btn_withdraw}>탈퇴하기</button>
            </div>

          </div>
        )}

        {active === 'payment' && (
          <div className={styles.card}>
            <h2 className={styles.section_title}>결제 내역</h2>
            {loadingPayments ? (
              <p className={styles.empty_text}>불러오는 중...</p>
            ) : payments.length === 0 ? (
              <div className={styles.empty_state}>
                <p className={styles.empty_text}>결제 내역이 없습니다.</p>
              </div>
            ) : (
              <ul className={styles.history_list}>
                {payments.map((pay) => (
                  <li key={pay.id} className={styles.history_item}>
                    <div className={styles.history_top}>
                      <div className={styles.history_info}>
                        <p className={styles.history_program}>
                          {PROGRAM_LABEL[pay.program] ?? pay.program}
                        </p>
                        <p className={styles.history_amount}>
                          {pay.amount.toLocaleString('ko-KR')}원
                        </p>
                      </div>
                      <span className={`${styles.history_badge} ${styles[PAYMENT_STATUS_COLOR[pay.status] ?? 'badge_pending']}`}>
                        {PAYMENT_STATUS_LABEL[pay.status] ?? pay.status}
                      </span>
                    </div>
                    <div className={styles.history_bottom}>
                      <span className={styles.history_date}>
                        결제일 · {new Date(pay.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      {pay.payapp_tid && (
                        <span className={styles.history_tid}>거래번호 {pay.payapp_tid}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {active === 'history' && (
          <div className={styles.card}>
            <h2 className={styles.section_title}>프로그램 신청 내역</h2>
            {loadingApplications ? (
              <p className={styles.empty_text}>불러오는 중...</p>
            ) : applications.length === 0 ? (
              <div className={styles.empty_state}>
                <p className={styles.empty_text}>신청 내역이 없습니다.</p>
              </div>
            ) : (
              <ul className={styles.history_list}>
                {applications.map((app) => (
                  <li key={app.id} className={styles.history_item}>
                    <div className={styles.history_top}>
                      <div className={styles.history_info}>
                        <p className={styles.history_program}>
                          {PROGRAM_LABEL[app.program ?? ''] ?? app.program ?? '프로그램 미지정'}
                        </p>
                        <p className={styles.history_name}>{app.name ?? '-'}</p>
                      </div>
                      <span className={`${styles.history_badge} ${styles[`badge_${app.status}`]}`}>
                        {STATUS_LABEL[app.status] ?? app.status}
                      </span>
                    </div>
                    <div className={styles.history_bottom}>
                      <span className={styles.history_date}>
                        신청일 · {new Date(app.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

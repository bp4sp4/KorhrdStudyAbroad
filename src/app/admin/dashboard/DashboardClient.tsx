'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { adminLogout } from '@/app/admin/actions'

type User = {
  id: string
  full_name: string | null
  email: string | null
  target_country: string | null
  created_at: string
  is_admin: boolean | null
}

type Application = {
  id: string
  status: string
  created_at: string
  program: string | null
  name: string | null
  phone: string | null
  email: string | null
}

type Payment = {
  id: string
  user_id: string | null
  program: string
  amount: number
  payapp_order_id: string | null
  payapp_tid: string | null
  status: string
  created_at: string
  profiles: { full_name: string | null } | null
}

type Consultation = {
  id: string
  user_id: string | null
  name: string
  phone: string
  region: string
  desired_start: string
  message: string
  status: string
  created_at: string
}

const TAB_ITEMS = [
  { id: 'users', label: '회원 목록' },
  { id: 'consult', label: '간편상담' },
  { id: 'applications', label: '신청서 목록' },
  { id: 'payments', label: '결제 목록' },
]

const STATUS_LABEL: Record<string, string> = {
  draft: '임시저장', submitted: '신청완료', reviewing: '검토중', approved: '승인', rejected: '반려',
}
const STATUS_CLASS: Record<string, string> = {
  draft: 'badge_draft', submitted: 'badge_submitted', reviewing: 'badge_reviewing',
  approved: 'badge_approved', rejected: 'badge_rejected',
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

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: '대기중', completed: '결제완료', failed: '실패', cancelled: '취소',
}
const PAYMENT_STATUS_CLASS: Record<string, string> = {
  pending: 'badge_draft', completed: 'badge_approved', failed: 'badge_rejected', cancelled: 'badge_reviewing',
}

export default function DashboardClient({
  users,
  applications,
  consultations,
  payments,
  adminEmail,
}: {
  users: User[]
  applications: Application[]
  consultations: Consultation[]
  payments: Payment[]
  adminEmail: string
}) {
  const router = useRouter()
  const [tab, setTab] = useState('users')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.header_title}>HPS Abroad 관리자</h1>
        <div className={styles.header_right}>
          <span className={styles.header_email}>{adminEmail}</span>
          <form action={adminLogout}>
            <button type="submit" className={styles.btn_logout}>로그아웃</button>
          </form>
        </div>
      </header>

      <main className={styles.main}>
        {/* 요약 카드 */}
        <div className={styles.stats_grid}>
          <div className={styles.stat_card}>
            <p className={styles.stat_label}>전체 회원</p>
            <p className={styles.stat_value}>{users.length}</p>
          </div>
          <div className={styles.stat_card}>
            <p className={styles.stat_label}>신청서 전체</p>
            <p className={styles.stat_value}>{applications.length}</p>
          </div>
          <div className={styles.stat_card}>
            <p className={styles.stat_label}>신청완료</p>
            <p className={styles.stat_value}>{applications.filter(a => a.status === 'submitted').length}</p>
          </div>
          <div className={styles.stat_card}>
            <p className={styles.stat_label}>결제 완료</p>
            <p className={styles.stat_value}>{payments.filter(p => p.status === 'completed').length}</p>
          </div>
        </div>

        {/* 탭 */}
        <div className={styles.tab_bar}>
          {TAB_ITEMS.map(t => (
            <button
              key={t.id}
              className={`${styles.tab_btn} ${tab === t.id ? styles.tab_active : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 회원 목록 */}
        {tab === 'users' && (
          <div className={styles.table_wrap}>
            <div className={styles.table_scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>이름</th><th>이메일</th><th>목표 국가</th><th>가입일</th><th>권한</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={5} className={styles.td_empty}>회원이 없습니다.</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id}>
                      <td>{u.full_name ?? '-'}</td>
                      <td className={styles.td_muted}>{u.email}</td>
                      <td>{u.target_country ?? '-'}</td>
                      <td className={styles.td_date}>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                      <td>
                        {u.is_admin
                          ? <span className={styles.badge_admin}>관리자</span>
                          : <span className={styles.badge_user}>일반</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 간편상담 */}
        {tab === 'consult' && (
          <div className={styles.table_wrap}>
            <div className={styles.table_scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>이름</th><th>연락처</th><th>거주지역</th><th>희망 시작일</th><th>회원여부</th><th>신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.length === 0 ? (
                    <tr><td colSpan={6} className={styles.td_empty}>간편상담 신청 내역이 없습니다.</td></tr>
                  ) : consultations.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td className={styles.td_muted}>{c.phone}</td>
                      <td>{c.region}</td>
                      <td>{c.desired_start}</td>
                      <td>
                        {c.user_id
                          ? <span className={styles.badge_admin}>회원</span>
                          : <span className={styles.badge_user}>비회원</span>}
                      </td>
                      <td className={styles.td_date}>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 신청서 목록 */}
        {tab === 'applications' && (
          <div className={styles.table_wrap}>
            <div className={styles.table_scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>이름</th><th>연락처</th><th>이메일</th><th>프로그램</th><th>상태</th><th>신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan={6} className={styles.td_empty}>신청서가 없습니다.</td></tr>
                  ) : applications.map(a => (
                    <tr
                      key={a.id}
                      className={`${styles.tr_clickable} ${loadingId === a.id ? styles.tr_loading : ''}`}
                      onClick={() => {
                        if (loadingId) return
                        setLoadingId(a.id)
                        router.push(`/admin/applications/${a.id}`)
                      }}
                    >
                      <td>{a.name ?? '-'}</td>
                      <td className={styles.td_muted}>{a.phone ?? '-'}</td>
                      <td className={styles.td_muted}>{a.email ?? '-'}</td>
                      <td>{PROGRAM_LABEL[a.program ?? ''] ?? a.program ?? '-'}</td>
                      <td>
                        {loadingId === a.id ? (
                          <span className={styles.badge_loading}>이동 중...</span>
                        ) : (
                          <span className={styles[STATUS_CLASS[a.status] ?? 'badge_draft']}>
                            {STATUS_LABEL[a.status] ?? a.status}
                          </span>
                        )}
                      </td>
                      <td className={styles.td_date}>{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 결제 목록 */}
        {tab === 'payments' && (
          <div className={styles.table_wrap}>
            <div className={styles.table_scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>신청자</th><th>프로그램</th><th>금액</th><th>상태</th><th>주문번호</th><th>결제일</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan={6} className={styles.td_empty}>결제 내역이 없습니다.</td></tr>
                  ) : payments.map(p => (
                    <tr key={p.id}>
                      <td>{p.profiles?.full_name ?? '-'}</td>
                      <td>{PROGRAM_LABEL[p.program] ?? p.program}</td>
                      <td>{p.amount.toLocaleString('ko-KR')}원</td>
                      <td>
                        <span className={styles[PAYMENT_STATUS_CLASS[p.status] ?? 'badge_draft']}>
                          {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
                        </span>
                      </td>
                      <td className={styles.td_muted}>{p.payapp_order_id ?? '-'}</td>
                      <td className={styles.td_date}>{new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

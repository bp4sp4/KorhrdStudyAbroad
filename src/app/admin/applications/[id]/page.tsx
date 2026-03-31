import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ImageViewer from './ImageViewer'
import styles from './page.module.css'

const PROGRAM_LABEL: Record<string, string> = {
  '3week': '3주 프로그램', '10week': '10주 프로그램',
}
const SCHOOL_LABEL: Record<string, string> = {
  elementary: '초등학교', middle: '중학교', high: '고등학교', university: '대학교',
}
const STATUS_LABEL: Record<string, string> = {
  draft: '임시저장', submitted: '신청완료', reviewing: '검토중', approved: '승인', rejected: '반려',
}
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  draft:     { bg: '#F2F4F6',  color: '#8B95A1' },
  submitted: { bg: '#EBF3FF',  color: '#0051FF' },
  reviewing: { bg: '#FFF8E8',  color: '#E08A00' },
  approved:  { bg: '#E9FAF0',  color: '#00B04F' },
  rejected:  { bg: '#FFF0F0',  color: '#F04452' },
}

async function signed(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  if (!path) return null
  const { data } = await supabase.storage.from('application-files').createSignedUrl(path, 3600)
  return data?.signedUrl ?? null
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/admin/login')

  const adminSupabase = createAdminClient()
  const { data: app } = await adminSupabase.from('applications').select('*').eq('id', id).single()
  if (!app) notFound()

  const [passportUrl, idPhotoUrl, guardianPassportUrl, guardianPhotoUrl, participantSigUrl, guardianSigUrl] =
    await Promise.all([
      signed(adminSupabase, app.passport_file_url),
      signed(adminSupabase, app.id_photo_url),
      signed(adminSupabase, app.guardian_passport_url),
      signed(adminSupabase, app.guardian_photo_url),
      signed(adminSupabase, app.participant_sig_url),
      signed(adminSupabase, app.guardian_sig_url),
    ])

  const sc = STATUS_COLOR[app.status] ?? STATUS_COLOR.draft

  return (
    <div className={styles.container}>
      <div className={styles.top_bar}>
        <Link href="/admin/dashboard" className={styles.back_btn}>← 신청서 목록</Link>
        <span className={styles.status_badge} style={{ background: sc.bg, color: sc.color }}>
          {STATUS_LABEL[app.status] ?? app.status}
        </span>
      </div>

      {/* 타이틀 카드 */}
      <div className={styles.title_card}>
        <div>
          <p className={styles.page_title}>{app.name ?? '-'}</p>
          <p className={styles.page_sub}>
            {PROGRAM_LABEL[app.program ?? ''] ?? app.program ?? '-'}
            &nbsp;·&nbsp;
            {new Date(app.created_at).toLocaleString('ko-KR')} 신청
          </p>
        </div>
      </div>

      <div className={styles.grid}>

        {/* 참가자 기본정보 */}
        <Card title="참가자 기본정보">
          <F label="한국 이름"   v={app.name} />
          <F label="영어 이름"   v={app.english_name} />
          <F label="성별"       v={app.gender} />
          <F label="혈액형"     v={app.blood_type} />
          <F label="생년월일"   v={app.birth_date} />
          <F label="출생 도시"  v={app.birth_city} />
          <F label="이메일"     v={app.email} />
          <F label="연락처"     v={app.phone} />
          <F label="학교 종류"  v={SCHOOL_LABEL[app.school_type ?? ''] ?? app.school_type} />
          <F label="학교"       v={app.school} />
          <F label="학년"       v={app.school_grade} />
          <F label="주소"       v={[app.address, app.address_detail].filter(Boolean).join(' ')} />
        </Card>

        {/* 해외 출국용 정보 */}
        <Card title="해외 출국용 정보"
          images={[
            { label: '여권사본', url: passportUrl },
            { label: '증명사진', url: idPhotoUrl },
          ]}
        >
          <F label="여권 영문명" v={app.passport_name} />
          <F label="여권번호"   v={app.passport_number} />
          <F label="여권만료일" v={app.passport_expiry} />
        </Card>

        {/* 보호자 정보 */}
        <Card title="보호자 정보"
          images={[
            { label: '보호자 여권사본', url: guardianPassportUrl },
            { label: '보호자 증명사진', url: guardianPhotoUrl },
          ]}
        >
          <F label="이름"       v={app.guardian_name} />
          <F label="연락처"     v={app.guardian_phone} />
          <F label="이메일"     v={app.guardian_email} />
          <F label="출생 도시"  v={app.guardian_birth_city} />
        </Card>

        {/* 홈스테이 정보 */}
        <Card title="홈스테이 정보">
          <F label="영어 수준"          v={app.english_level} />
          <F label="수영 레벨"          v={app.swim_level} />
          <F label="알러지"             v={app.allergies?.join(', ')} />
          <F label="자기소개"           v={app.self_intro}       text />
          <F label="가족소개"           v={app.family_intro}     text />
          <F label="홈스테이 고려사항"  v={app.homestay_notes}   text />
          <F label="성격"               v={app.personality}      text />
          <F label="취미"               v={app.hobbies}          text />
          <F label="특기"               v={app.special_notes}    text />
          <F label="건강/음식 주의사항" v={app.health_notes}     text />
          <F label="참고사항"           v={app.extra_notes}      text />
        </Card>

        {/* 참가 동의 */}
        <Card title="참가 동의"
          images={[
            { label: '참가자 서명', url: participantSigUrl },
            { label: '보호자 서명', url: guardianSigUrl },
          ]}
        >
          <Agree label="참가자 동의"   v={app.agreed_terms} />
          <Agree label="보호자 동의"   v={app.agreed_privacy} />
          <Agree label="환불규정 확인" v={app.agreed_media} />
        </Card>

      </div>
    </div>
  )
}

/* ── 카드 컴포넌트 ── */
function Card({ title, children, images }: {
  title: string
  children: React.ReactNode
  images?: { label: string; url: string | null }[]
}) {
  const validImages = images?.filter(i => i.url) as { label: string; url: string }[] | undefined
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <span className={styles.card_dot} />
        <h2 className={styles.card_title}>{title}</h2>
      </div>
      <div className={styles.fields}>{children}</div>
      {validImages && validImages.length > 0 && (
        <ImageViewer images={validImages} />
      )}
    </div>
  )
}

/* ── 필드 행 ── */
function F({ label, v, text }: { label: string; v: string | null | undefined; text?: boolean }) {
  if (!v) return null
  return (
    <div className={styles.field_row}>
      <span className={styles.field_label}>{label}</span>
      <span className={text ? styles.field_value_text : styles.field_value}>{v}</span>
    </div>
  )
}

/* ── 동의 행 ── */
function Agree({ label, v }: { label: string; v: boolean }) {
  return (
    <div className={styles.field_row}>
      <span className={styles.field_label}>{label}</span>
      {v
        ? <span className={styles.agree_yes}>✓ 동의</span>
        : <span className={styles.agree_no}>✗ 미동의</span>
      }
    </div>
  )
}

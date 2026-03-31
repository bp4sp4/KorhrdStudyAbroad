# 프로젝트 코딩 규칙

## 기술 스택

- Next.js App Router (TypeScript)
- Supabase (인증 + DB)
  - 브라우저: `@/lib/supabase/client.ts`
  - 서버: `@/lib/supabase/server.ts`
  - 어드민(service role): `@/lib/supabase/admin.ts`
- CSS Modules

## 스타일링

- **CSS Modules 필수**: 모든 스타일은 `*.module.css` 파일에 작성
- **인라인 스타일 금지**: `style={{ }}` 사용 금지 (런타임 동적 값만 예외)
  - 예외 허용: `style={{ width: `${percent}%` }}`, `style={{ background: dynamicColor }}`
- **BEM 방식 (언더바 1개)**: `container_wrap`, `btn_submit`, `message_error` 형식
- 새 페이지/컴포넌트 생성 시 같은 디렉토리에 `page.module.css` 또는 `Component.module.css` 함께 생성

## 프로젝트 구조

```
src/
├── app/
│   ├── auth/
│   │   ├── actions.ts         # login / signup / logout 서버 액션
│   │   └── callback/route.ts  # OAuth 콜백
│   ├── admin/
│   │   ├── actions.ts         # adminLogin / adminLogout 서버 액션
│   │   ├── login/             # 관리자 로그인 (/admin/login)
│   │   ├── dashboard/         # 관리자 대시보드 (/admin/dashboard)
│   │   └── users/             # 관리자 계정 관리 (/admin/users)
│   ├── login/                 # 일반 로그인
│   ├── signup/                # 회원가입
│   └── dashboard/             # 로그인 후 유저 대시보드
├── lib/supabase/
│   ├── client.ts              # 브라우저 클라이언트
│   ├── server.ts              # 서버 컴포넌트 클라이언트
│   └── admin.ts               # service role 클라이언트 (서버 전용)
└── middleware.ts               # 세션 갱신 + 라우트 보호
```

## 라우트 보호 규칙 (middleware.ts)

- `/admin/*` (login 제외) → `is_admin = true` 아니면 `/admin/login` 리다이렉트
- `/dashboard`, `/profile`, `/mypage` → 미로그인 시 `/login` 리다이렉트
- `/login`, `/signup` → 로그인 상태면 `/dashboard` 리다이렉트

## DB (Supabase)

- `profiles` 테이블: 유저 기본정보 + 유학 필드 (nationality, target_country, study_level)
- `is_admin` 컬럼으로 관리자 구분
- 회원가입 시 `handle_new_user` 트리거로 자동 프로필 생성
- RLS 활성화 (본인 데이터만 접근)

## 환경 변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Supabase > Project Settings > API > service_role
```

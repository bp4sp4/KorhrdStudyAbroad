# 한평생유학 (KorHrdAbroad)

> 잘 보내는 것보다, 잘 적응하는 유학이 중요합니다

아이 성향에 맞는 프로그램부터 현지 생활 적응까지 함께 관리하는 유학 서비스 웹사이트입니다.

---

## 주요 기능

- **홈 (메인)** — 히어로 섹션, 유학 과정 안내, 전문 유학 프로그램 소개, 후기
- **프로그램** — 국가별 유학 프로그램 일정·가격 안내 (필리핀, 미국, 캐나다, 영국, 뉴질랜드)
- **상담 신청** — 상담 모달 및 신청 폼
- **회원 기능** — 이메일 로그인 / 회원가입 / 이메일 찾기 / 비밀번호 찾기
- **마이페이지** — 로그인 후 개인 대시보드

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | CSS Modules |
| 인증 / DB | Supabase |
| UI 라이브러리 | Swiper.js |

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인, 회원가입, 이메일/비밀번호 찾기
│   ├── (main)/          # 홈, 프로그램, 신청, 마이페이지, 약관
│   └── auth/            # Supabase OAuth 콜백
├── components/          # 공용 컴포넌트
├── data/                # 프로그램 데이터 (정적)
└── lib/
    └── supabase/
        ├── client.ts    # 브라우저 클라이언트
        ├── server.ts    # 서버 컴포넌트 클라이언트
        └── admin.ts     # service role 클라이언트
```

---

## 로컬 실행

**1. 환경 변수 설정**

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**2. 패키지 설치 및 실행**

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

---

## 유학 프로그램

| 국가 | 지역 | 기간 | 대상 |
|------|------|------|------|
| 🇵🇭 필리핀 | 세부 | 4주 | 초2~중3 |
| 🇺🇸 미국 | 뉴저지 | 3주 | 초3~고3 |
| 🇨🇦 캐나다 | 밴쿠버-써리 | 4주 | 초5~중2 |
| 🇬🇧 영국 | 영국 | 4주 | 초4~고2 |
| 🇳🇿 뉴질랜드 | 오클랜드 / 해밀턴 | 3~10주 | 초1~중3 |

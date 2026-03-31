'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'
import { createClient } from '@/lib/supabase/client'
import { createPaymentRecord, checkAnyCompletedPayment } from './actions'

const IconProgram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8.00016 1.33333C8.17697 1.33333 8.34654 1.40357 8.47157 1.52859C8.59659 1.65362 8.66683 1.82319 8.66683 2C8.66683 2.17681 8.59659 2.34638 8.47157 2.4714C8.34654 2.59643 8.17697 2.66667 8.00016 2.66667C6.94533 2.66667 5.91418 2.97946 5.03712 3.56549C4.16006 4.15153 3.47647 4.98448 3.07281 5.95902C2.66914 6.93356 2.56352 8.00592 2.76931 9.04048C2.9751 10.075 3.48305 11.0254 4.22893 11.7712C4.97481 12.5171 5.92512 13.0251 6.95968 13.2309C7.99425 13.4366 9.0666 13.331 10.0411 12.9274C11.0157 12.5237 11.8486 11.8401 12.4347 10.963C13.0207 10.086 13.3335 9.05483 13.3335 8C13.3335 7.82319 13.4037 7.65362 13.5288 7.52859C13.6538 7.40357 13.8234 7.33333 14.0002 7.33333C14.177 7.33333 14.3465 7.40357 14.4716 7.52859C14.5966 7.65362 14.6668 7.82319 14.6668 8C14.6668 11.682 11.6822 14.6667 8.00016 14.6667C4.31816 14.6667 1.3335 11.682 1.3335 8C1.3335 4.318 4.31816 1.33333 8.00016 1.33333ZM8.00016 4C8.17697 4 8.34654 4.07024 8.47157 4.19526C8.59659 4.32029 8.66683 4.48985 8.66683 4.66667C8.66683 4.84348 8.59659 5.01305 8.47157 5.13807C8.34654 5.26309 8.17697 5.33333 8.00016 5.33333C7.47275 5.33333 6.95717 5.48973 6.51864 5.78275C6.08011 6.07576 5.73832 6.49224 5.53648 6.97951C5.33465 7.46678 5.28184 8.00296 5.38474 8.52024C5.48763 9.03752 5.7416 9.51268 6.11454 9.88562C6.48748 10.2586 6.96264 10.5125 7.47992 10.6154C7.99721 10.7183 8.53338 10.6655 9.02065 10.4637C9.50792 10.2618 9.9244 9.92005 10.2174 9.48152C10.5104 9.04299 10.6668 8.52742 10.6668 8C10.6668 7.82319 10.7371 7.65362 10.8621 7.52859C10.9871 7.40357 11.1567 7.33333 11.3335 7.33333C11.5103 7.33333 11.6799 7.40357 11.8049 7.52859C11.9299 7.65362 12.0002 7.82319 12.0002 8C12.0002 8.79112 11.7656 9.56448 11.326 10.2223C10.8865 10.8801 10.2618 11.3928 9.5309 11.6955C8.79999 11.9983 7.99573 12.0775 7.2198 11.9231C6.44388 11.7688 5.73115 11.3878 5.17174 10.8284C4.61233 10.269 4.23136 9.55628 4.07702 8.78036C3.92268 8.00444 4.00189 7.20017 4.30464 6.46926C4.6074 5.73836 5.12009 5.11365 5.77788 4.67412C6.43568 4.23459 7.20904 4 8.00016 4ZM12.3808 1.4C12.4692 1.4 12.554 1.43512 12.6165 1.49763C12.679 1.56014 12.7142 1.64493 12.7142 1.73333V2.95333C12.7143 3.04162 12.7495 3.12624 12.812 3.1886C12.8745 3.25097 12.9592 3.286 13.0475 3.286H14.2668C14.3552 3.286 14.44 3.32112 14.5025 3.38363C14.565 3.44614 14.6002 3.53093 14.6002 3.61933V4.22933L13.3415 5.488C13.0915 5.73807 12.7524 5.87859 12.3988 5.87867H11.0655L8.47216 8.47133C8.34643 8.59277 8.17803 8.65997 8.00323 8.65845C7.82843 8.65693 7.66122 8.58682 7.53762 8.46321C7.41401 8.33961 7.3439 8.1724 7.34238 7.9976C7.34086 7.8228 7.40806 7.6544 7.5295 7.52867L10.1228 4.936V3.60267C10.1227 3.24917 10.263 2.9101 10.5128 2.66L11.7728 1.4H12.3808Z" fill="currentColor"/>
  </svg>
)

const IconBasic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10.4002 8.29764C11.2846 8.72832 12.0371 9.3871 12.582 10.2061C13.127 11.025 13.4436 11.9745 13.4992 12.9566C13.5049 13.055 13.4911 13.1535 13.4586 13.2465C13.4262 13.3396 13.3758 13.4253 13.3102 13.4989C13.2447 13.5724 13.1653 13.6323 13.0766 13.6752C12.9879 13.718 12.8916 13.743 12.7932 13.7486C12.6948 13.7543 12.5963 13.7405 12.5033 13.7081C12.4103 13.6757 12.3245 13.6252 12.251 13.5597C12.1774 13.4941 12.1175 13.4147 12.0747 13.326C12.0318 13.2373 12.0069 13.141 12.0012 13.0426C11.9457 12.0187 11.5001 11.055 10.7559 10.3495C10.0118 9.64403 9.02562 9.25044 8.00021 9.24964C6.97479 9.25044 5.98865 9.64403 5.24448 10.3495C4.50032 11.055 4.05469 12.0187 3.9992 13.0426C3.99362 13.141 3.96872 13.2373 3.92593 13.326C3.88313 13.4148 3.82327 13.4942 3.74978 13.5598C3.67628 13.6254 3.59058 13.6759 3.49757 13.7084C3.40456 13.7409 3.30606 13.7547 3.2077 13.7491C3.10934 13.7436 3.01305 13.7187 2.92431 13.6759C2.83557 13.6331 2.75613 13.5732 2.69053 13.4997C2.62493 13.4262 2.57444 13.3405 2.54196 13.2475C2.50947 13.1545 2.49562 13.056 2.5012 12.9576C2.55668 11.9754 2.8732 11.0256 3.41813 10.2065C3.96306 9.38734 4.71667 8.7284 5.6012 8.29764C5.09074 7.81693 4.73643 7.19397 4.58419 6.50952C4.43196 5.82506 4.48881 5.11066 4.74739 4.4589C5.00597 3.80713 5.45436 3.24807 6.03443 2.85415C6.6145 2.46023 7.29952 2.24962 8.00071 2.24962C8.70189 2.24962 9.38691 2.46023 9.96698 2.85415C10.5471 3.24807 10.9954 3.80713 11.254 4.4589C11.5126 5.11066 11.5695 5.82506 11.4172 6.50952C11.265 7.19397 10.9107 7.81693 10.4002 8.29764ZM8.00021 3.74964C7.73387 3.74362 7.46901 3.79086 7.22118 3.88861C6.97335 3.98636 6.74755 4.13263 6.55703 4.31884C6.36651 4.50505 6.21512 4.72745 6.11173 4.97298C6.00835 5.21851 5.95506 5.48222 5.95499 5.74863C5.95492 6.01503 6.00808 6.27877 6.11134 6.52435C6.21461 6.76993 6.36589 6.9924 6.55632 7.17871C6.74674 7.36502 6.97247 7.51141 7.22025 7.60928C7.46803 7.70715 7.73286 7.75453 7.99921 7.74864C8.52177 7.73708 9.01904 7.52141 9.38458 7.1478C9.75011 6.77418 9.95486 6.27232 9.95499 5.74963C9.95512 5.22694 9.75062 4.72497 9.38527 4.35117C9.01993 3.97737 8.52276 3.76145 8.00021 3.74964Z" fill="currentColor"/>
  </svg>
)

const IconPassport = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.06073 3.99725V9.03292C2.06073 9.24674 2.23427 9.42028 2.44809 9.42028H5.41785C5.53937 9.42036 5.65841 9.45473 5.76127 9.51945C5.86413 9.58417 5.94663 9.67661 5.99929 9.78614C6.05195 9.89566 6.07262 10.0178 6.05894 10.1386C6.04525 10.2593 5.99776 10.3738 5.92193 10.4687L4.69478 12.0027H6.98794C7.04577 12.0023 7.10279 11.9891 7.15493 11.9641C7.20707 11.9391 7.25305 11.9029 7.28957 11.8581L9.0456 9.66303C9.10628 9.58762 9.18302 9.52671 9.27022 9.48472C9.35742 9.44272 9.4529 9.42071 9.54968 9.42028H13.5524C13.6033 9.42028 13.6536 9.41026 13.7006 9.39079C13.7476 9.37133 13.7903 9.3428 13.8263 9.30683C13.8623 9.27086 13.8908 9.22815 13.9103 9.18116C13.9297 9.13416 13.9398 9.08379 13.9398 9.03292V8.93376C13.9399 8.41657 13.8249 7.90583 13.6031 7.43858C13.3814 6.97132 13.0585 6.55926 12.6578 6.23224C12.2571 5.90523 11.7887 5.67146 11.2865 5.54788C10.7843 5.42431 10.2609 5.41402 9.75421 5.51776H9.75318L4.77638 6.56725C4.61791 6.60076 4.45263 6.57349 4.31333 6.49083C4.17403 6.40817 4.0709 6.27616 4.02439 6.12101L3.38808 3.99828L2.06073 3.99725ZM0.769531 3.86813C0.769531 3.22666 1.29014 2.70605 1.93161 2.70605H3.48415C3.99753 2.70605 4.44996 3.04279 4.59768 3.53448L5.09143 5.17998L9.4939 4.25342C10.1882 4.11106 10.9054 4.12496 11.5937 4.2941C12.2819 4.46323 12.9239 4.78338 13.4731 5.23133C14.0223 5.67927 14.465 6.2438 14.769 6.88399C15.0731 7.52419 15.2308 8.224 15.231 8.93272V9.03292C15.231 9.95949 14.48 10.7115 13.5524 10.7115H9.85957L8.29774 12.6638C7.97959 13.0625 7.49719 13.2939 6.98691 13.2939H4.42621C3.45213 13.2939 2.91086 12.1669 3.51927 11.4056L4.075 10.7115H2.44809C2.00291 10.7115 1.57596 10.5346 1.26117 10.2198C0.946379 9.90505 0.769531 9.4781 0.769531 9.03292V3.86813Z" fill="currentColor"/>
  </svg>
)

const IconGuardian = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.99993 5.5C1.99986 4.91987 2.14399 4.34882 2.41936 3.83822C2.69473 3.32761 3.0927 2.89346 3.57748 2.57481C4.06226 2.25616 4.61865 2.06301 5.19659 2.01274C5.77454 1.96246 6.35591 2.05663 6.88844 2.28677C7.42096 2.51692 7.88792 2.87582 8.24733 3.33121C8.60674 3.78659 8.84732 4.32417 8.94742 4.89559C9.04753 5.46702 9.00403 6.05437 8.82084 6.60481C8.63765 7.15525 8.3205 7.65153 7.89793 8.049C8.69464 8.43579 9.38637 9.00893 9.91451 9.71986C10.4427 10.4308 10.7917 11.2585 10.9319 12.133C10.9474 12.2303 10.9435 12.3297 10.9205 12.4255C10.8975 12.5213 10.8559 12.6117 10.798 12.6914C10.7401 12.7711 10.6671 12.8386 10.5831 12.8901C10.4991 12.9416 10.4057 12.9761 10.3084 12.9915C10.2111 13.0069 10.1117 13.003 10.0159 12.9801C9.92011 12.9571 9.82977 12.9154 9.75005 12.8575C9.67033 12.7997 9.6028 12.7266 9.5513 12.6426C9.49981 12.5586 9.46536 12.4653 9.44993 12.368C9.29994 11.4283 8.81986 10.5729 8.0959 9.95529C7.37193 9.33772 6.45152 8.99847 5.49993 8.99847C4.54834 8.99847 3.62793 9.33772 2.90396 9.95529C2.18 10.5729 1.69992 11.4283 1.54993 12.368C1.53443 12.4653 1.49992 12.5586 1.44837 12.6426C1.39681 12.7266 1.32922 12.7996 1.24946 12.8574C1.16969 12.9153 1.07931 12.9568 0.983481 12.9797C0.887649 13.0027 0.78824 13.0065 0.69093 12.991C0.593621 12.9755 0.500316 12.941 0.416344 12.8894C0.332372 12.8379 0.259377 12.7703 0.201526 12.6905C0.143675 12.6108 0.102101 12.5204 0.079179 12.4245C0.0562567 12.3287 0.0524344 12.2293 0.0679304 12.132C0.207703 11.2576 0.556525 10.4299 1.08475 9.71923C1.61297 9.00855 2.30497 8.43591 3.10193 8.05C2.75393 7.72267 2.47663 7.32756 2.28711 6.88901C2.09759 6.45046 1.99985 5.97775 1.99993 5.5ZM10.9999 4C11.5809 4.0004 12.1493 4.16946 12.6361 4.48665C13.1229 4.80383 13.5072 5.25551 13.7423 5.78684C13.9773 6.31818 14.0531 6.90633 13.9604 7.4799C13.8677 8.05346 13.6104 8.58778 13.2199 9.018C13.829 9.3197 14.3701 9.7424 14.8102 10.2603C15.2504 10.7781 15.5803 11.3803 15.7799 12.03C15.8196 12.1561 15.8251 12.2904 15.7961 12.4193C15.767 12.5482 15.7044 12.6672 15.6145 12.7641C15.5246 12.8609 15.4107 12.9323 15.2844 12.9709C15.158 13.0096 15.0236 13.0141 14.8949 12.984C14.7663 12.9542 14.6477 12.891 14.5513 12.8008C14.4549 12.7105 14.3841 12.5964 14.3459 12.47C14.1664 11.8903 13.8398 11.3671 13.3977 10.9514C12.9557 10.5357 12.4135 10.2416 11.8239 10.098C11.6602 10.0585 11.5145 9.96495 11.4104 9.83252C11.3062 9.70009 11.2497 9.53646 11.2499 9.368V9.016C11.2498 8.87636 11.2887 8.73948 11.3622 8.62075C11.4357 8.50203 11.5409 8.40618 11.6659 8.344C11.9691 8.19375 12.2126 7.94542 12.3568 7.63934C12.501 7.33327 12.5375 6.98742 12.4603 6.65798C12.3832 6.32854 12.1969 6.03487 11.9318 5.82465C11.6667 5.61443 11.3383 5.50002 10.9999 5.5C10.801 5.5 10.6103 5.42098 10.4696 5.28033C10.3289 5.13967 10.2499 4.94891 10.2499 4.75C10.2499 4.55108 10.3289 4.36032 10.4696 4.21967C10.6103 4.07901 10.801 4 10.9999 4ZM5.49993 3.5C5.23359 3.49397 4.96873 3.54122 4.72091 3.63897C4.47308 3.73671 4.24728 3.88299 4.05676 4.0692C3.86624 4.25541 3.71484 4.47781 3.61146 4.72334C3.50807 4.96887 3.45478 5.23258 3.45472 5.49899C3.45465 5.76539 3.50781 6.02913 3.61107 6.27471C3.71433 6.52029 3.86562 6.74276 4.05604 6.92907C4.24647 7.11538 4.4722 7.26177 4.71998 7.35964C4.96775 7.45751 5.23259 7.50489 5.49893 7.499C6.02149 7.48744 6.51877 7.27177 6.8843 6.89816C7.24984 6.52454 7.45458 6.02268 7.45472 5.49999C7.45485 4.9773 7.25035 4.47533 6.885 4.10153C6.51965 3.72773 6.02249 3.51181 5.49993 3.5Z" fill="currentColor"/>
  </svg>
)

const IconHomestay = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M7.18117 1.79201C7.39986 1.62187 7.66613 1.52409 7.94296 1.51226C8.21979 1.50044 8.49342 1.57514 8.72584 1.72601L8.8185 1.79267L14.4078 6.13934C14.8885 6.51334 14.6545 7.26734 14.0752 7.32934L13.9978 7.33334H13.3332V12.6667C13.3333 13.0031 13.2062 13.3271 12.9775 13.5737C12.7488 13.8204 12.4353 13.9714 12.0998 13.9967L11.9998 14H3.99984C3.66357 13.9999 3.33974 13.8728 3.09323 13.6441C2.84671 13.4154 2.69572 13.102 2.6705 12.7667L2.6665 12.6667V7.33334H2.00184C1.39317 7.33334 1.11384 6.59467 1.53317 6.19001L1.59184 6.13934L7.18117 1.79201ZM7.99984 2.84467L3.74984 6.15001C3.9025 6.27334 3.99984 6.46201 3.99984 6.67334V12.6667H5.99984V9.33334C5.99984 8.80291 6.21055 8.2942 6.58562 7.91913C6.96069 7.54405 7.4694 7.33334 7.99984 7.33334C8.53027 7.33334 9.03898 7.54405 9.41405 7.91913C9.78912 8.2942 9.99984 8.80291 9.99984 9.33334V12.6667H11.9998V6.67334C11.9998 6.46201 12.0972 6.27334 12.2498 6.15001L7.99984 2.84467ZM7.99984 8.66667C7.82302 8.66667 7.65346 8.73691 7.52843 8.86193C7.40341 8.98696 7.33317 9.15653 7.33317 9.33334V12.6667H8.6665V9.33334C8.6665 9.15653 8.59626 8.98696 8.47124 8.86193C8.34622 8.73691 8.17665 8.66667 7.99984 8.66667Z" fill="currentColor"/>
  </svg>
)

const IconAgree = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M14.3702 3.40733C14.5577 3.59486 14.663 3.84917 14.663 4.11433C14.663 4.3795 14.5577 4.6338 14.3702 4.82133L6.87487 12.3167C6.77582 12.4157 6.65822 12.4943 6.52879 12.548C6.39936 12.6016 6.26063 12.6292 6.12054 12.6292C5.98044 12.6292 5.84171 12.6016 5.71228 12.548C5.58285 12.4943 5.46526 12.4157 5.3662 12.3167L1.6422 8.59333C1.54669 8.50109 1.47051 8.39074 1.4181 8.26874C1.36569 8.14673 1.33811 8.01551 1.33695 7.88273C1.3358 7.74995 1.3611 7.61827 1.41138 7.49538C1.46166 7.37248 1.53591 7.26083 1.62981 7.16694C1.7237 7.07304 1.83535 6.99879 1.95825 6.94851C2.08114 6.89823 2.21282 6.87293 2.3456 6.87408C2.47838 6.87524 2.6096 6.90282 2.73161 6.95523C2.85361 7.00764 2.96396 7.08382 3.0562 7.17933L6.1202 10.2433L12.9555 3.40733C13.0484 3.31441 13.1587 3.24069 13.28 3.19039C13.4014 3.1401 13.5315 3.11421 13.6629 3.11421C13.7942 3.11421 13.9243 3.1401 14.0457 3.19039C14.1671 3.24069 14.2773 3.31441 14.3702 3.40733Z" fill="currentColor"/>
  </svg>
)

const NAV_ITEMS = [
  { id: 'program',  icon: <IconProgram />,  label: '프로그램선택' },
  { id: 'basic',    icon: <IconBasic />,    label: '참가자 기본 정보' },
  { id: 'passport', icon: <IconPassport />, label: '해외 출국용 정보' },
  { id: 'guardian', icon: <IconGuardian />, label: '보호자 정보' },
  { id: 'homestay', icon: <IconHomestay />, label: '홈스테이 정보' },
  { id: 'agree',    icon: <IconAgree />,    label: '참가 동의' },
]

const PROGRAM_PRICES: Record<string, { amount: number; display: string }> = {
  test_1000: { amount: 1000, display: '1,000원 (테스트 결제)' },
  philippines_cebu_solo: { amount: 4500000, display: '4,500,000원 (신청비 10만원 별도)' },
  usa_newjersey_solo: { amount: 9200000, display: '9,200,000원' },
  canada_vancouver_solo: { amount: 0, display: '$9,750 (별도 문의)' },
  uk_solo: { amount: 10650000, display: '10,650,000원' },
  nz_auckland_solo: { amount: 8350000, display: '8,350,000원' },
  nz_hamilton_solo_4w: { amount: 8000000, display: '8,000,000원' },
  nz_hamilton_parent_4w: { amount: 6900000, display: '6,900,000원' },
  nz_hamilton_solo_3w: { amount: 6000000, display: '6,000,000원' },
  nz_hamilton_parent_3w: { amount: 5300000, display: '5,300,000원' },
  nz_hamilton_solo_10w: { amount: 16000000, display: '16,000,000원' },
  nz_hamilton_parent_10w: { amount: 12700000, display: '12,700,000원' },
}


const PROGRAM_OPTIONS = [
  { value: 'test_1000', label: '🧪 테스트 결제 (1,000원)' },
  { value: 'philippines_cebu_solo', label: '필리핀 세부 나홀로' },
  { value: 'usa_newjersey_solo', label: '미국 뉴저지 나홀로' },
  { value: 'canada_vancouver_solo', label: '캐나다 밴쿠버-써리 나홀로' },
  { value: 'uk_solo', label: '영국 나홀로' },
  { value: 'nz_auckland_solo', label: '뉴질랜드 오클랜드 나홀로' },
  { value: 'nz_hamilton_solo_4w', label: '뉴질랜드 해밀턴 나홀로 4주' },
  { value: 'nz_hamilton_parent_4w', label: '뉴질랜드 해밀턴 부모동반 4주' },
  { value: 'nz_hamilton_solo_3w', label: '뉴질랜드 해밀턴 나홀로 3주' },
  { value: 'nz_hamilton_parent_3w', label: '뉴질랜드 해밀턴 부모동반 3주' },
  { value: 'nz_hamilton_solo_10w', label: '뉴질랜드 해밀턴 나홀로 10주' },
  { value: 'nz_hamilton_parent_10w', label: '뉴질랜드 해밀턴 부모동반 10주' },
]

function CustomSelect({ options, placeholder = '선택해주세요.', onSelect, value }: {
  options: { value: string; label: string }[]
  placeholder?: string
  onSelect?: (value: string) => void
  value?: string
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value ?? '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value !== undefined) setSelected(value)
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedLabel = options.find(o => o.value === selected)?.label

  return (
    <div className={styles.custom_select} ref={ref}>
      <button
        type="button"
        className={`${styles.custom_select_trigger} ${open ? styles.custom_select_open : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={selected ? styles.custom_select_value : styles.custom_select_placeholder}>
          {selectedLabel ?? placeholder}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s', flexShrink: 0 }}>
          <path d="M14.3578 4.46454C14.1703 4.27707 13.916 4.17175 13.6508 4.17175C13.3857 4.17175 13.1314 4.27707 12.9438 4.46454L7.99383 9.41454L3.04383 4.46454C2.85523 4.28238 2.60263 4.18159 2.34043 4.18386C2.07823 4.18614 1.82742 4.29131 1.64201 4.47672C1.45661 4.66213 1.35144 4.91294 1.34916 5.17514C1.34688 5.43733 1.44767 5.68994 1.62983 5.87854L7.28683 11.5355C7.47436 11.723 7.72867 11.8283 7.99383 11.8283C8.259 11.8283 8.5133 11.723 8.70083 11.5355L14.3578 5.87854C14.5453 5.69101 14.6506 5.4367 14.6506 5.17154C14.6506 4.90638 14.5453 4.65207 14.3578 4.46454Z" fill="#D0D0D0"/>
        </svg>
      </button>
      {open && (
        <ul className={styles.custom_select_list}>
          {options.map(opt => (
            <li
              key={opt.value}
              className={`${styles.custom_select_item} ${selected === opt.value ? styles.custom_select_item_active : ''}`}
              onClick={() => { setSelected(opt.value); setOpen(false); onSelect?.(opt.value) }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: { address: string }) => void }) => { open: () => void }
    }
  }
}

const FIELD_SECTION: Record<string, string> = {
  program: 'program',
  korean_name: 'basic', birth_date: 'basic', birth_city: 'basic',
  address: 'basic', email: 'basic', phone: 'basic', school_name: 'basic', grade: 'basic', gender: 'basic',
  passport_name: 'passport', passport_number: 'passport', passport_expiry: 'passport',
  passport_file: 'passport', id_photo_file: 'passport',
  guardian_name: 'guardian', guardian_phone: 'guardian', guardian_email: 'guardian', guardian_birth_city: 'guardian',
  english_level: 'homestay', allergy: 'homestay', swim_level: 'homestay',
  participant_agree: 'agree', participant_sig: 'agree',
  guardian_agree: 'agree', guardian_sig: 'agree', refund_agree: 'agree',
}

const SECTION_ORDER = ['program', 'basic', 'passport', 'guardian', 'homestay', 'agree']

function ApplyPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'payment' | 'form'>('payment')
  const [paymentProgram, setPaymentProgram] = useState('')
  const [paymentPhone, setPaymentPhone] = useState('')
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [showPaymentDoneModal, setShowPaymentDoneModal] = useState(false)
  const [active, setActive] = useState('program')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [programValue, setProgramValue] = useState('')
  const [schoolType, setSchoolType] = useState('')
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [fileNames, setFileNames] = useState<Record<string, string>>({})
  const [fileObjects, setFileObjects] = useState<Record<string, File>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [draftToRestore, setDraftToRestore] = useState<Record<string, unknown> | null>(null)
  const [shouldRestore, setShouldRestore] = useState(false)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [existingFileUrls, setExistingFileUrls] = useState<Record<string, string | null>>({})

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const submittedRef = useRef(false)
  const isRestoringRef = useRef(false)
  const stepRef = useRef<'payment' | 'form'>('payment')

  // step 변경 시 ref 동기화
  useEffect(() => { stepRef.current = step }, [step])

  // 페이지 이탈 시 경고 (신청서 작성 중일 때만)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stepRef.current !== 'form') return
      if (submittedRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const hasError = (field: string) => errors.has(field)
  const clearError = (field: string) => setErrors(prev => { const s = new Set(prev); s.delete(field); return s })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileNames(prev => ({ ...prev, [field]: file.name }))
      setFileObjects(prev => ({ ...prev, [field]: file }))
      clearError(field)
    }
  }

  // localStorage 이벤트로 결제완료 수신 (팝업 → 부모창, COOP 우회)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'payment_complete') {
        console.log('[PAYMENT] localStorage event → showPaymentDoneModal = true')
        localStorage.removeItem('payment_complete')
        setShowPaymentDoneModal(true)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // postMessage fallback
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      console.log('[PAYMENT] postMessage received:', e.data, 'origin:', e.origin)
      if (e.data?.type === 'PAYMENT_COMPLETE') {
        console.log('[PAYMENT] postMessage → showPaymentDoneModal = true')
        setShowPaymentDoneModal(true)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // 결제 스텝에서 DB 폴링 — 서버 API 엔드포인트로 체크 (RLS 우회)
  useEffect(() => {
    if (step !== 'payment') return
    console.log('[PAYMENT] polling started')
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/payments/check')
        const json = await res.json()
        console.log('[PAYMENT] polling result:', json)
        if (json.completed) {
          console.log('[PAYMENT] polling → completed! showing modal')
          clearInterval(interval)
          setShowPaymentDoneModal(true)
        }
      } catch (e) {
        console.log('[PAYMENT] polling error:', e)
      }
    }, 2000)
    return () => {
      console.log('[PAYMENT] polling stopped')
      clearInterval(interval)
    }
  }, [step])

  // 마운트 시 결제 완료 여부 + 프로필 전화번호 확인
  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .single()
        if (profile?.phone) setPaymentPhone(profile.phone)
      }
      // 이미 결제 완료된 유저가 재방문 시 바로 폼으로 이동
      const paid = await checkAnyCompletedPayment()
      if (paid) {
        setStep('form')
        setProgramValue(paid.program)
      }
    }
    check()
  }, [])

  // 마운트 시 DB에서 임시저장 확인
  useEffect(() => {
    const checkDraft = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: draft } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      if (draft) {
        setDraftId(draft.id)
        setDraftToRestore(draft)
        setShowDraftModal(true)
      }
    }
    checkDraft()
  }, [])

  // 이어서 작성 선택 후 DOM 복원
  useEffect(() => {
    if (!shouldRestore || !draftToRestore) return
    const d = draftToRestore as Record<string, unknown>

    // DB 컬럼명 → data-field 매핑
    const fieldMap: Record<string, string> = {
      name: 'korean_name', english_name: 'english_name',
      birth_date: 'birth_date', birth_city: 'birth_city',
      email: 'email', school_grade: 'grade', school: 'school_name',
      passport_name: 'passport_name', passport_number: 'passport_number',
      passport_expiry: 'passport_expiry',
      guardian_name: 'guardian_name', guardian_email: 'guardian_email',
      guardian_birth_city: 'guardian_birth_city',
    }
    Object.entries(fieldMap).forEach(([dbCol, dataField]) => {
      const el = document.querySelector<HTMLInputElement>(`[data-field="${dataField}"]`)
      if (el && d[dbCol]) el.value = d[dbCol] as string
    })

    const radioMap: Record<string, string> = {
      gender: 'gender', blood_type: 'blood', english_level: 'english_level', swim_level: 'swim_level',
    }
    Object.entries(radioMap).forEach(([dbCol, name]) => {
      const val = d[dbCol] as string
      if (val) {
        const radio = document.querySelector<HTMLInputElement>(`input[name="${name}"][value="${val}"]`)
        if (radio) radio.checked = true
      }
    })

    const allergyVals = (d['allergies'] as string[]) ?? []
    allergyVals.forEach(val => {
      const cb = document.querySelector<HTMLInputElement>(`input[name="allergy"][value="${val}"]`)
      if (cb) cb.checked = true
    });

    [['agreed_terms', 'participant_agree'], ['agreed_privacy', 'guardian_agree'], ['agreed_media', 'refund_agree']]
      .forEach(([dbCol, name]) => {
        if (d[dbCol]) {
          const cb = document.querySelector<HTMLInputElement>(`input[name="${name}"]`)
          if (cb) cb.checked = true
        }
      })

    const textareaMap: Record<string, string> = {
      self_intro: 'self_intro', family_intro: 'family_intro', homestay_notes: 'homestay_notes',
      personality: 'personality', hobbies: 'hobbies', health_notes: 'health_notes',
      special_notes: 'special_notes', extra_notes: 'extra_notes',
    }
    Object.entries(textareaMap).forEach(([dbCol, name]) => {
      const el = document.querySelector<HTMLTextAreaElement>(`[name="${name}"]`)
      if (el && d[dbCol]) el.value = d[dbCol] as string
    })

    isRestoringRef.current = false
    setShouldRestore(false)
  }, [shouldRestore, draftToRestore])

  // IntersectionObserver: 스크롤 위치에 따라 active 업데이트
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id) setActive(id)
          }
        })
      },
      { rootMargin: '-120px 0px -50% 0px', threshold: 0 }
    )
    SECTION_ORDER.forEach(id => {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id]
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 112
    window.scrollTo({ top, behavior: 'smooth' })
    setActive(id)
  }

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft) {
      const newErrors = new Set<string>()

      if (!programValue) newErrors.add('program')

      const basicSec = sectionRefs.current['basic']
      if (basicSec) {
        basicSec.querySelectorAll<HTMLInputElement>('[data-field]').forEach(input => {
          const f = input.getAttribute('data-field')!
          if (['text', 'email', 'tel'].includes(input.type) && !input.value.trim()) newErrors.add(f)
        })
        if (!basicSec.querySelector('input[name="gender"]:checked')) newErrors.add('gender')
      }

      const passSec = sectionRefs.current['passport']
      if (passSec) {
        passSec.querySelectorAll<HTMLInputElement>('[data-field]').forEach(input => {
          const f = input.getAttribute('data-field')!
          if (input.type === 'text' && !input.value.trim()) newErrors.add(f)
        })
        if (!fileNames['passport_file']) newErrors.add('passport_file')
        if (!fileNames['id_photo_file']) newErrors.add('id_photo_file')
      }

      const guardSec = sectionRefs.current['guardian']
      if (guardSec) {
        guardSec.querySelectorAll<HTMLInputElement>('[data-field]').forEach(input => {
          const f = input.getAttribute('data-field')!
          if (['text', 'email', 'tel'].includes(input.type) && !input.value.trim()) newErrors.add(f)
        })
      }

      const homestSec = sectionRefs.current['homestay']
      if (homestSec) {
        if (!homestSec.querySelector('input[name="english_level"]:checked')) newErrors.add('english_level')
        const allergyBoxes = homestSec.querySelectorAll<HTMLInputElement>('input[name="allergy"]')
        if (!Array.from(allergyBoxes).some(c => c.checked)) newErrors.add('allergy')
        if (!homestSec.querySelector('input[name="swim_level"]:checked')) newErrors.add('swim_level')
      }

      const agreeSec = sectionRefs.current['agree']
      if (agreeSec) {
        if (!agreeSec.querySelector('input[name="participant_agree"]:checked')) newErrors.add('participant_agree')
        if (!fileNames['participant_sig']) newErrors.add('participant_sig')
        if (!agreeSec.querySelector('input[name="guardian_agree"]:checked')) newErrors.add('guardian_agree')
        if (!fileNames['guardian_sig']) newErrors.add('guardian_sig')
        if (!agreeSec.querySelector('input[name="refund_agree"]:checked')) newErrors.add('refund_agree')
      }

      setErrors(newErrors)

      if (newErrors.size > 0) {
        for (const id of SECTION_ORDER) {
          if ([...newErrors].some(f => FIELD_SECTION[f] === id)) {
            scrollToSection(id)
            break
          }
        }
        return
      }
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // 현재 로그인한 유저 id
      const { data: { user } } = await supabase.auth.getUser()

      const getValue = (field: string) =>
        (document.querySelector<HTMLInputElement>(`[data-field="${field}"]`)?.value ?? '').trim()

      const getRadio = (name: string) =>
        document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? ''

      const getCheckboxes = (name: string) =>
        Array.from(document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`))
          .map(c => c.value)

      // 파일 업로드 - 새 파일 선택 시만 업로드, 아니면 기존 URL 유지
      const uploadFileOrKeep = async (fieldKey: string, folder: string): Promise<string | null> => {
        const file = fileObjects[fieldKey]
        if (file) {
          const ext = file.name.split('.').pop()
          const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { data, error } = await supabase.storage
            .from('application-files')
            .upload(path, file)
          if (error) { console.error('upload error', error); return existingFileUrls[fieldKey] ?? null }
          return data.path
        }
        return existingFileUrls[fieldKey] ?? null
      }

      const [passportFileUrl, idPhotoUrl, participantSigUrl, guardianSigUrl, guardianPassportUrl, guardianPhotoUrl] =
        await Promise.all([
          uploadFileOrKeep('passport_file', 'passport'),
          uploadFileOrKeep('id_photo_file', 'id-photo'),
          uploadFileOrKeep('participant_sig', 'signatures'),
          uploadFileOrKeep('guardian_sig', 'signatures'),
          uploadFileOrKeep('guardian_passport', 'guardian-passport'),
          uploadFileOrKeep('guardian_photo', 'guardian-photo'),
        ])

      const getTextarea = (name: string) =>
        (document.querySelector<HTMLTextAreaElement>(`[name="${name}"]`)?.value ?? '').trim() || null

      const payload = {
        user_id: user?.id ?? null,
        status: isDraft ? 'draft' : 'submitted',
        program: programValue,
        name: getValue('korean_name'),
        english_name: getValue('english_name') || null,
        birth_date: getValue('birth_date') || null,
        blood_type: getRadio('blood') || null,
        gender: getRadio('gender'),
        birth_city: getValue('birth_city'),
        phone,
        email: getValue('email'),
        school_type: schoolType || null,
        school: getValue('school_name'),
        school_grade: getValue('grade'),
        address,
        address_detail: addressDetail,
        passport_name: getValue('passport_name'),
        passport_number: getValue('passport_number'),
        passport_expiry: getValue('passport_expiry') || null,
        passport_file_url: passportFileUrl,
        id_photo_url: idPhotoUrl,
        guardian_name: getValue('guardian_name'),
        guardian_phone: guardianPhone,
        guardian_email: getValue('guardian_email'),
        guardian_birth_city: getValue('guardian_birth_city'),
        guardian_passport_url: guardianPassportUrl,
        guardian_photo_url: guardianPhotoUrl,
        english_level: getRadio('english_level'),
        self_intro: getTextarea('self_intro'),
        family_intro: getTextarea('family_intro'),
        homestay_notes: getTextarea('homestay_notes'),
        personality: getTextarea('personality'),
        hobbies: getTextarea('hobbies'),
        health_notes: getTextarea('health_notes'),
        special_notes: getTextarea('special_notes'),
        extra_notes: getTextarea('extra_notes'),
        allergies: getCheckboxes('allergy'),
        swim_level: getRadio('swim_level'),
        participant_sig_url: participantSigUrl,
        guardian_sig_url: guardianSigUrl,
        agreed_terms: !!document.querySelector('input[name="participant_agree"]:checked'),
        agreed_privacy: !!document.querySelector('input[name="guardian_agree"]:checked'),
        agreed_media: !!document.querySelector('input[name="refund_agree"]:checked'),
      }

      let dbError
      if (draftId) {
        const { error } = await supabase.from('applications').update(payload).eq('id', draftId)
        dbError = error
      } else {
        const { data, error } = await supabase.from('applications').insert(payload).select('id').single()
        if (data) setDraftId(data.id)
        dbError = error
      }

      if (dbError) {
        console.error('db error', dbError)
        alert('오류가 발생했습니다. 다시 시도해주세요.')
        return
      }

      if (isDraft) {
        alert('임시저장 되었습니다.')
      } else {
        submittedRef.current = true
        alert('신청이 완료되었습니다!')
        router.push('/')
      }
    } catch (e) {
      console.error(e)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length > 7) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    if (digits.length > 3) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return digits
  }

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const handleGuardianPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuardianPhone(formatPhone(e.target.value))
  }

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      const script = document.createElement('script')
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      script.onload = () => new window.daum.Postcode({ oncomplete: (data) => setAddress(data.address) }).open()
      document.head.appendChild(script)
    } else {
      new window.daum.Postcode({ oncomplete: (data) => setAddress(data.address) }).open()
    }
  }

  const handlePaymentSubmit = async () => {
    if (!paymentProgram) { alert('프로그램을 선택해주세요.'); return }
    if (paymentProgram === 'canada_vancouver_solo') {
      window.open('https://pf.kakao.com/_xkRxoxbn/chat', '_blank')
      return
    }
    const price = PROGRAM_PRICES[paymentProgram]
    if (!price || price.amount === 0) { alert('해당 프로그램은 별도 문의가 필요합니다.'); return }
    const rawPhone = paymentPhone.replace(/-/g, '')

    setIsPaymentLoading(true)
    try {
      // 1. DB에 pending 레코드 생성
      const orderId = await createPaymentRecord(paymentProgram, price.amount)
      const goodName = (PROGRAM_OPTIONS.find(o => o.value === paymentProgram)?.label ?? '유학 프로그램')
        .replace(/[\u{1F000}-\u{1FFFF}]/gu, '').trim()

      // 2. 서버에서 PayApp API 호출 → payurl 받기
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, goodname: goodName, price: price.amount, recvphone: rawPhone, var1: orderId }),
      })
      const data = await res.json()

      if (!res.ok || !data.data?.payurl) {
        alert(data.error || '결제 요청에 실패했습니다.')
        return
      }

      // 3. 모바일/데스크톱 분기
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobile) {
        window.location.href = data.data.payurl
      } else {
        const popup = window.open(data.data.payurl, 'payapp_payment', 'width=800,height=900,left=200,top=100')
        if (!popup) {
          // 팝업 차단된 경우 새 탭으로
          window.open(data.data.payurl, '_blank')
        }
      }
    } catch (e) {
      alert('결제 처리 중 오류가 발생했습니다.')
      console.error(e)
    } finally {
      setIsPaymentLoading(false)
    }
  }

  if (step === 'payment') {
    const selectedPrice = paymentProgram ? PROGRAM_PRICES[paymentProgram] : null
    const selectedLabel = PROGRAM_OPTIONS.find(o => o.value === paymentProgram)?.label
    return (
      <>
      <div className={styles.container}>
        {/* 사이드바 */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebar_title}>참가 신청</p>
          <nav className={styles.sidebar_nav}>
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className={styles.nav_item_disabled}>
                <span className={styles.nav_icon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* 콘텐츠 */}
        <div className={styles.content}>
          {/* 안내 배너 */}
          <div className={styles.banner}>
            프로그램 선택 후, 결제를 진행해주시면 신청서 작성이 가능합니다.
          </div>

          {/* 결제 섹션 */}
          <section className={styles.section}>
            <h2 className={styles.section_title}>안내받으신 프로그램을 선택 후, 결제를 진행해주세요!</h2>

            <div className={styles.field}>
              <label className={styles.label}>유학 프로그램 <span className={styles.required}>*</span></label>
              <p className={styles.field_desc}>신청하실 유학 프로그램을 선택해주세요.</p>
              <CustomSelect
                options={PROGRAM_OPTIONS}
                value={paymentProgram}
                onSelect={setPaymentProgram}
                placeholder="선택해주세요."
              />
            </div>


            {selectedPrice && (
              <div className={styles.price_box}>
                <p className={styles.price_program}>{selectedLabel}</p>
                <p className={styles.price_value}>{selectedPrice.display}</p>
              </div>
            )}

            {paymentProgram === 'canada_vancouver_solo' ? (
              <button className={styles.btn_consult} onClick={handlePaymentSubmit} disabled={isPaymentLoading}>
                상담 신청하기
              </button>
            ) : (
              <button
                className={styles.btn_pay}
                onClick={handlePaymentSubmit}
                disabled={!paymentProgram || isPaymentLoading}
              >
                {isPaymentLoading ? '처리 중...' : '결제하기'}
              </button>
            )}
          </section>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
    <div className={styles.container}>

      {/* ── 왼쪽 사이드바 ── */}
      <aside className={styles.sidebar}>
        <p className={styles.sidebar_title}>참가 신청서</p>
        <nav className={styles.sidebar_nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.nav_item} ${active === item.id ? styles.nav_active : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <span className={styles.nav_icon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── 오른쪽 콘텐츠 ── */}
      <div className={styles.content}>

        {/* 안내 배너 */}
        <div className={styles.banner}>
          입력하신 정보는 프로그램 진행에 사용되며, 동의하지 않을 시 진행이 어렵습니다.
        </div>

        {/* 프로그램 선택 */}
        <section
          className={styles.section}
          data-section="program"
          ref={el => { sectionRefs.current['program'] = el }}
        >
          <h2 className={styles.section_title}>어떤 프로그램으로 참가하시나요?</h2>
          <div className={styles.field}>
            <label className={styles.label}>유학 프로그램 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>신청하실 유학 프로그램을 선택해주세요.</p>
            <CustomSelect options={PROGRAM_OPTIONS} value={programValue} onSelect={(v) => { setProgramValue(v); clearError('program') }} />
            {hasError('program') && <p className={styles.error_msg}>프로그램을 선택해주세요.</p>}
          </div>
        </section>

        {/* 참가자 기본 정보 */}
        <section
          className={styles.section}
          data-section="basic"
          ref={el => { sectionRefs.current['basic'] = el }}
        >
          <h2 className={styles.section_title}>참가자의 기본정보를 알려주세요.</h2>

          <div className={styles.field}>
            <label className={styles.label}>한국 이름 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>한글로 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('korean_name') ? styles.input_error : ''}`} type="text" placeholder="예) 홍길동" data-field="korean_name" onChange={() => clearError('korean_name')} />
            {hasError('korean_name') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>영어이름</label>
            <p className={styles.field_desc}>영어이름이 있다면 입력해주세요.</p>
            <input className={styles.input} type="text" placeholder="예) Danny" data-field="english_name" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>성별 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>성별을 선택해주세요.</p>
            <div className={styles.radio_group}>
              <label className={styles.radio_label}>
                <input type="radio" name="gender" value="남자" onChange={() => clearError('gender')} /> 남자(Male)
              </label>
              <label className={styles.radio_label}>
                <input type="radio" name="gender" value="여자" onChange={() => clearError('gender')} /> 여자(Female)
              </label>
            </div>
            {hasError('gender') && <p className={styles.error_msg}>성별을 선택해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>혈액형</label>
            <p className={styles.field_desc}>혈액형을 선택해주세요.</p>
            <div className={styles.radio_group}>
              {['A', 'B', 'O', 'AB'].map((type) => (
                <label key={type} className={styles.radio_label}>
                  <input type="radio" name="blood" value={type} /> {type}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>생년월일 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>생년월일을 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('birth_date') ? styles.input_error : ''}`} type="text" placeholder="YYYY/MM/DD" data-field="birth_date" onChange={() => clearError('birth_date')} />
            {hasError('birth_date') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>출생 도시 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>참가자의 출생 도시를 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('birth_city') ? styles.input_error : ''}`} type="text" placeholder="예) 서울" data-field="birth_city" onChange={() => clearError('birth_city')} />
            {hasError('birth_city') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>집 주소 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>집 주소를 입력해주세요.</p>
            <div className={styles.address_row}>
              <input
                className={`${styles.input} ${styles.input_wide} ${hasError('address') ? styles.input_error : ''}`}
                type="text"
                placeholder="주소를 검색해주세요."
                value={address}
                readOnly
                data-field="address"
              />
              <button type="button" className={styles.btn_address} onClick={() => { openPostcode(); clearError('address') }}>
                주소 찾기
              </button>
            </div>
            <input
              className={`${styles.input} ${styles.input_wide}`}
              type="text"
              placeholder="상세주소를 입력해주세요."
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
            />
            {hasError('address') && <p className={styles.error_msg}>주소를 검색해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>이메일 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>참가자의 이메일 주소를 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('email') ? styles.input_error : ''}`} type="email" placeholder="예) hpsabroad@email.com" data-field="email" onChange={() => clearError('email')} />
            {hasError('email') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>연락처 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>참가자의 연락가능한 연락처를 입력해주세요. 만약 없을 경우, 보호자의 연락처를 입력해주세요.</p>
            <input
              className={`${styles.input} ${hasError('phone') ? styles.input_error : ''}`}
              type="tel"
              placeholder="예) 010-0000-0000"
              value={phone}
              onChange={(e) => { handlePhone(e); clearError('phone') }}
              data-field="phone"
            />
            {hasError('phone') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>학교 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>현재 재학중인 학교를 알려주세요.</p>
            <div className={styles.school_row}>
              <CustomSelect options={[
                { value: 'elementary', label: '초등학교' },
                { value: 'middle', label: '중학교' },
                { value: 'high', label: '고등학교' },
                { value: 'university', label: '대학교' },
              ]} placeholder="초/중/고/대" value={schoolType} onSelect={(v) => setSchoolType(v)} />
              <input className={`${styles.input} ${styles.input_school} ${hasError('school_name') ? styles.input_error : ''}`} type="text" placeholder="예)한영성초등학교" data-field="school_name" onChange={() => clearError('school_name')} />
            </div>
            {hasError('school_name') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>학년 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>학년을 작성해주세요.</p>
            <input className={`${styles.input} ${hasError('grade') ? styles.input_error : ''}`} type="text" placeholder="예) 4학년" data-field="grade" onChange={() => clearError('grade')} />
            {hasError('grade') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

        </section>

        {/* 해외 출국용 정보 */}
        <section
          className={styles.section}
          data-section="passport"
          ref={el => { sectionRefs.current['passport'] = el }}
        >
          <h2 className={styles.section_title}>해외 출국시에 꼭 필요한 정보를 알려주세요.</h2>

          <div className={styles.field}>
            <label className={styles.label}>여권상 영문 이름 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>이름 → 성 순서로 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('passport_name') ? styles.input_error : ''}`} type="text" placeholder="예) Gildong Hong" data-field="passport_name" onChange={() => clearError('passport_name')} />
            {hasError('passport_name') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>여권번호 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>여권번호를 정확하게 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('passport_number') ? styles.input_error : ''}`} type="text" placeholder="예) M12345678 혹은 M123A4567" data-field="passport_number" onChange={() => clearError('passport_number')} />
            {hasError('passport_number') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>여권만료일 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>여권 만료일을 정확하게 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('passport_expiry') ? styles.input_error : ''}`} type="text" placeholder="예) 24 Jan 2030" data-field="passport_expiry" onChange={() => clearError('passport_expiry')} />
            {hasError('passport_expiry') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>여권사본 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>사진면과 사인한 면이 모두 나와야합니다.(.jpg, .jpeg, .png파일만 가능합니다.)</p>
            <label className={`${styles.file_upload} ${hasError('passport_file') ? styles.file_error : ''}`}>
              <span className={fileNames['passport_file'] ? styles.file_name : styles.file_placeholder}>
                {fileNames['passport_file'] || '파일을 업로드해주세요.'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B2B2B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <input type="file" accept=".jpg,.jpeg,.png" className={styles.file_input} onChange={e => handleFileChange(e, 'passport_file')} />
            </label>
            {hasError('passport_file') && <p className={styles.error_msg}>파일을 업로드해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>증명사진 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>증명사진을 올려주세요.(.jpg, .jpeg, .png파일만 가능합니다.)</p>
            <label className={`${styles.file_upload} ${hasError('id_photo_file') ? styles.file_error : ''}`}>
              <span className={fileNames['id_photo_file'] ? styles.file_name : styles.file_placeholder}>
                {fileNames['id_photo_file'] || '파일을 업로드해주세요.'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B2B2B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <input type="file" accept=".jpg,.jpeg,.png" className={styles.file_input} onChange={e => handleFileChange(e, 'id_photo_file')} />
            </label>
            {hasError('id_photo_file') && <p className={styles.error_msg}>파일을 업로드해주세요.</p>}
          </div>

        </section>

        {/* 보호자 정보 */}
        <section
          className={styles.section}
          data-section="guardian"
          ref={el => { sectionRefs.current['guardian'] = el }}
        >
          <h2 className={styles.section_title}>보호자 정보를 알려주세요.</h2>

          <div className={styles.field}>
            <label className={styles.label}>보호자 이름 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>한글로 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('guardian_name') ? styles.input_error : ''}`} type="text" placeholder="예) 홍길동" data-field="guardian_name" onChange={() => clearError('guardian_name')} />
            {hasError('guardian_name') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>보호자 연락처 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>보호자의 연락가능한 연락처를 알려주세요.</p>
            <input
              className={`${styles.input} ${hasError('guardian_phone') ? styles.input_error : ''}`}
              type="tel"
              placeholder="예) 010-0000-0000"
              value={guardianPhone}
              onChange={(e) => { handleGuardianPhone(e); clearError('guardian_phone') }}
              data-field="guardian_phone"
            />
            {hasError('guardian_phone') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>보호자 이메일 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>보호자의 이메일 주소를 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('guardian_email') ? styles.input_error : ''}`} type="email" placeholder="예) hpsabroad@email.com" data-field="guardian_email" onChange={() => clearError('guardian_email')} />
            {hasError('guardian_email') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>보호자 출생 도시 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>보호자의 출생 도시를 입력해주세요.</p>
            <input className={`${styles.input} ${hasError('guardian_birth_city') ? styles.input_error : ''}`} type="text" placeholder="예) 서울" data-field="guardian_birth_city" onChange={() => clearError('guardian_birth_city')} />
            {hasError('guardian_birth_city') && <p className={styles.error_msg}>필수 항목을 입력해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>보호자 여권사본</label>
            <p className={styles.field_desc}>사진면과 사인한 면이 모두 나와야합니다.(.jpg, .jpeg, .png파일만 가능합니다.)</p>
            <label className={styles.file_upload}>
              <span className={fileNames['guardian_passport'] ? styles.file_name : styles.file_placeholder}>
                {fileNames['guardian_passport'] || '파일을 업로드해주세요.'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B2B2B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <input type="file" accept=".jpg,.jpeg,.png" className={styles.file_input} onChange={e => handleFileChange(e, 'guardian_passport')} />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>보호자 증명사진</label>
            <p className={styles.field_desc}>증명사진을 올려주세요.(.jpg, .jpeg, .png파일만 가능합니다.)</p>
            <label className={styles.file_upload}>
              <span className={fileNames['guardian_photo'] ? styles.file_name : styles.file_placeholder}>
                {fileNames['guardian_photo'] || '파일을 업로드해주세요.'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B2B2B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <input type="file" accept=".jpg,.jpeg,.png" className={styles.file_input} onChange={e => handleFileChange(e, 'guardian_photo')} />
            </label>
          </div>

        </section>

        {/* 홈스테이 정보 */}
        <section
          className={styles.section}
          data-section="homestay"
          ref={el => { sectionRefs.current['homestay'] = el }}
        >
          <h2 className={styles.section_title}>딱 맞는 매칭을 위한 홈스테이 관련 정보를 알려주세요.</h2>

          <div className={styles.field}>
            <label className={styles.label}>영어 수준 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>본인이 생각하는 자신의 영어 수준을 선택해주세요.</p>
            <div className={styles.radio_group}>
              {['상', '중', '하'].map((level) => (
                <label key={level} className={styles.radio_label}>
                  <input type="radio" name="english_level" value={level} onChange={() => clearError('english_level')} /> {level}
                </label>
              ))}
            </div>
            {hasError('english_level') && <p className={styles.error_msg}>항목을 선택해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>자기소개 (Self introduction) <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>홈스테이 부모님을 위한 자기소개를 간략하게 영어로 써주세요.</p>
            <textarea className={styles.textarea} name="self_intro" placeholder="예) I am very cheerful and enjoy conversation." />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>가족소개</label>
            <p className={styles.field_desc}>학생의 가족에 대해서 간략하게 소개해주세요.</p>
            <textarea className={styles.textarea} name="family_intro" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>홈스테이 고려사항</label>
            <p className={styles.field_desc}>반려동물이나 가족구성원에 관한 요구사항을 자세하게 입력해주세요.</p>
            <textarea className={styles.textarea} name="homestay_notes" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>성격</label>
            <p className={styles.field_desc}>학생의 성격을 자세하게 작성해주세요.</p>
            <textarea className={styles.textarea} name="personality" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>취미</label>
            <p className={styles.field_desc}>학생의 취미가 있다면 작성해주세요.</p>
            <textarea className={styles.textarea} name="hobbies" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>특기</label>
            <p className={styles.field_desc}>학생의 특기사항이 있다면 작성해주세요.</p>
            <textarea className={styles.textarea} name="special_notes" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>음식, 건강상의 주의사항</label>
            <p className={styles.field_desc}>알러지, 입원경력 및 장기복용 약이 있다면 상세하게 작성해주세요.</p>
            <textarea className={styles.textarea} name="health_notes" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>알러지 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>알러지가 없을 경우엔 없음(None)을, 있을 경우에는 해당되는 모든 알러지를 선택해주세요.</p>
            <div className={styles.checkbox_group}>
              {[
                '없음 (None)',
                '아토피 (Atopic Dermatitis)',
                '꽃가루병 (Hayfever)',
                '비염 (Allergic Rhinitis)',
                '동물 (Animals/Pets)',
                '두드러기 (Nettle Rash)',
                '천식 (Asthma)',
                '유제품 (Dairy)',
                '글루텐 (Gluten)',
                '의학품 (Medicine)',
                '그 외 기타 (Others)',
              ].map((item) => (
                <label key={item} className={styles.checkbox_label}>
                  <input type="checkbox" name="allergy" value={item} onChange={() => clearError('allergy')} /> {item}
                </label>
              ))}
            </div>
            {hasError('allergy') && <p className={styles.error_msg}>알러지를 선택해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>수영 레벨 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>본인이 생각하는 자신의 수영 레벨을 선택해주세요.</p>
            <div className={styles.radio_group}>
              {[
                "수영 못함 (Can't swim)",
                '초급 (Learner)',
                '중급 (Confident)',
                '고급 (Advanced)',
              ].map((level) => (
                <label key={level} className={styles.radio_label}>
                  <input type="radio" name="swim_level" value={level} onChange={() => clearError('swim_level')} /> {level}
                </label>
              ))}
            </div>
            {hasError('swim_level') && <p className={styles.error_msg}>항목을 선택해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>참고사항</label>
            <p className={styles.field_desc}>또 다른 참고사항이 있으시다면 이곳에 작성해주세요.</p>
            <textarea className={styles.textarea} name="extra_notes" />
          </div>

        </section>

        {/* 참가 동의 */}
        <section
          className={styles.section}
          data-section="agree"
          ref={el => { sectionRefs.current['agree'] = el }}
        >
          <h2 className={styles.section_title}>마지막으로 동의를 진행해주세요!</h2>

      

          <div className={styles.field}>
            <label className={styles.label}>참가자 동의서 <span className={styles.required}>*</span></label>
            <p className={styles.agree_text}>{`나는 본 캠프의 모든 프로그램에 적극 참여하며, 개인적인 행동은 삼가고, 진행하시는 분들의 말씀에 잘 따르고, 개인적인 안전과 위생에 최선을 다할 것을 약속합니다.

나는 본 양식에 기재된 모든 것이 사실이며 정확함을 약속합니다. 본 프로그램에 참가하는 자로 정책, 규칙, 규정, 여행조건, 동의서, 절차, 그리고 교육기관과 호스트가족의 지도방침에 잘 따를 것을 동의합니다.

나의 개인적은 불순종과 불찰로 일어나는 불상사에 대해서는 본 캠프 주관자에게 책임을 절대로 전가하지 않을 것을 약속합니다.`}</p>
            <label className={styles.agree_check}>
              <input type="checkbox" name="participant_agree" onChange={() => clearError('participant_agree')} /> 네, 동의합니다.
            </label>
            {hasError('participant_agree') && <p className={styles.error_msg}>동의해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>참가자 동의 서명 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>참가자 사인을 사진찍어서 올려주세요. (종이에 쓰시고 사진 찍어도 괜찮습니다.)</p>
            <label className={`${styles.file_upload} ${hasError('participant_sig') ? styles.file_error : ''}`}>
              <span className={fileNames['participant_sig'] ? styles.file_name : styles.file_placeholder}>
                {fileNames['participant_sig'] || '파일을 업로드해주세요.'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B2B2B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <input type="file" accept=".jpg,.jpeg,.png" className={styles.file_input} onChange={e => handleFileChange(e, 'participant_sig')} />
            </label>
            {hasError('participant_sig') && <p className={styles.error_msg}>파일을 업로드해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>보호자 동의서 <span className={styles.required}>*</span></label>
            <p className={styles.agree_text}>{`본인은 금번 행사에 참가하는 학생의 보호자로서 본 캠프의 교육이념을 잘 이해하였으며, 학생의 안전, 교육, 여행 및 긴급한 의료진행 결정 등을 모든 프로그램을 주관하는 관계자에게 위임하고, 학생개인의 부적절한 행동으로 말미암아 일어나는 불미스러운 일에 대해서 귀국이 불가피 할 경우 본인의 비용으로 학생을 귀국시킬 것이며, 관계 기관에 그 어떠한 책임도 전가하지 않을 것 입니다. 그리고 그곳에서 촬영된 사진과 동영상의 저작권은 주최측에 있음을 동의합니다.`}</p>
            <label className={styles.agree_check}>
              <input type="checkbox" name="guardian_agree" onChange={() => clearError('guardian_agree')} /> 네, 동의합니다.
            </label>
            {hasError('guardian_agree') && <p className={styles.error_msg}>동의해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>보호자 동의 서명 <span className={styles.required}>*</span></label>
            <p className={styles.field_desc}>참가자 사인을 사진찍어서 올려주세요. (종이에 쓰시고 사진 찍어도 괜찮습니다.)</p>
            <label className={`${styles.file_upload} ${hasError('guardian_sig') ? styles.file_error : ''}`}>
              <span className={fileNames['guardian_sig'] ? styles.file_name : styles.file_placeholder}>
                {fileNames['guardian_sig'] || '파일을 업로드해주세요.'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B2B2B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <input type="file" accept=".jpg,.jpeg,.png" className={styles.file_input} onChange={e => handleFileChange(e, 'guardian_sig')} />
            </label>
            {hasError('guardian_sig') && <p className={styles.error_msg}>파일을 업로드해주세요.</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>전체 캠프비 및 항공료 환불에 관한 규정 <span className={styles.required}>*</span></label>
            <p className={styles.agree_text}>{`본 캠프는 그 비용이 참가신청비, 연수비 그리고 항공료로 구분이 됩니다. 참가신청비는 이곳에서 캠프준비하는 비용으로 사용되기에 환불이 불가하며, 연수비는 출국전이면 언제든지 100%환불가능하고, 항공사규정에 맞게 환불해 드립니다.`}</p>
            <label className={styles.agree_check}>
              <input type="checkbox" name="refund_agree" onChange={() => clearError('refund_agree')} /> 네, 확인했습니다.
            </label>
            {hasError('refund_agree') && <p className={styles.error_msg}>확인해주세요.</p>}
          </div>

        </section>

      </div>
    </div>

    {/* 임시저장 복원 모달 */}
    {showPaymentDoneModal && (
      <div className={styles.modal_overlay}>
        <div className={styles.modal}>
          <p className={styles.modal_title}>결제가 완료되었습니다.</p>
          <p className={styles.modal_desc}>신청서를 작성하러 이동하시겠습니까?</p>
          <div className={styles.modal_buttons}>
            <button
              type="button"
              className={styles.modal_btn_secondary}
              onClick={() => router.push('/mypage')}
            >
              취소
            </button>
            <button
              type="button"
              className={styles.modal_btn_primary}
              onClick={async () => {
                setShowPaymentDoneModal(false)
                const paid = await checkAnyCompletedPayment()
                if (paid) {
                  setStep('form')
                  setProgramValue(paid.program)
                }
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )}

    {showDraftModal && (
      <div className={styles.modal_overlay}>
        <div className={styles.modal}>
          <p className={styles.modal_title}>이전에 작성 중인 신청서가 있습니다.</p>
          <p className={styles.modal_desc}>이어서 작성하시겠습니까?</p>
          <div className={styles.modal_buttons}>
            <button
              type="button"
              className={styles.modal_btn_secondary}
              onClick={() => {
                setDraftToRestore(null)
                setShowDraftModal(false)
              }}
            >
              새로 작성하기
            </button>
            <button
              type="button"
              className={styles.modal_btn_primary}
              onClick={() => {
                if (draftToRestore) {
                  const d = draftToRestore as Record<string, unknown>
                  // controlled states 복원 (DB 컬럼명 기준)
                  setPhone((d.phone as string) ?? '')
                  setAddress((d.address as string) ?? '')
                  setAddressDetail((d.address_detail as string) ?? '')
                  setGuardianPhone((d.guardian_phone as string) ?? '')
                  setProgramValue((d.program as string) ?? '')
                  setSchoolType((d.school_type as string) ?? '')
                  // 기존 파일 URL 저장
                  setExistingFileUrls({
                    passport_file: (d.passport_file_url as string) ?? null,
                    id_photo_file: (d.id_photo_url as string) ?? null,
                    participant_sig: (d.participant_sig_url as string) ?? null,
                    guardian_sig: (d.guardian_sig_url as string) ?? null,
                    guardian_passport: (d.guardian_passport_url as string) ?? null,
                    guardian_photo: (d.guardian_photo_url as string) ?? null,
                  })
                  // 기존 파일 있으면 파일명 표시
                  const savedFiles: Record<string, string> = {}
                  if (d.passport_file_url) savedFiles.passport_file = '저장된 파일'
                  if (d.id_photo_url) savedFiles.id_photo_file = '저장된 파일'
                  if (d.participant_sig_url) savedFiles.participant_sig = '저장된 파일'
                  if (d.guardian_sig_url) savedFiles.guardian_sig = '저장된 파일'
                  setFileNames(prev => ({ ...prev, ...savedFiles }))
                }
                isRestoringRef.current = true
                setShowDraftModal(false)
                setShouldRestore(true)
              }}
            >
              이어서 작성하기
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 하단 액션 바 */}
    <div className={styles.action_bar}>
      <button type="button" className={styles.btn_draft} onClick={() => handleSubmit(true)} disabled={isSubmitting}>
        {isSubmitting ? '저장 중...' : '임시저장'}
      </button>
      <button type="button" className={styles.btn_submit_apply} onClick={() => handleSubmit(false)} disabled={isSubmitting}>
        {isSubmitting ? '신청 중...' : '유학 프로그램 신청하기'}
      </button>
    </div>
    </>
  )
}

export default function ApplyPage() {
  return (
    <Suspense>
      <ApplyPageInner />
    </Suspense>
  )
}

# 반응형 웹 전환 작업 기록

## 개요

본 프로젝트를 모바일 전용 앱에서 반응형 웹(데스크탑 지원)으로 전환한 작업 기록입니다.

## 작업 목록

### 1. 사이드바(Sidebar) 컴포넌트 생성

- **파일**: `src/components/Sidebar.tsx`
- **내용**: 데스크탑 화면용 왼쪽 고정 사이드바 생성
- **로고/브랜드**: "하루뒤"
- **네비게이션 링크**: 홈, 감정 분석, 할 일, 마이페이지
- **알림 섹션**: 알림 페이지 링크 및 알림 배지 표시
- **일기 작성 버튼**: 오늘 날짜 기반으로 일기 작성 페이지 이동

### 2. Layout.tsx 전체 구조 개편

- **파일**: `src/Layout.tsx`
- **내용**: 반응형 레이아웃 구현
- **모바일**: 기존 `max-w-[414px]` 컨테이너 유지
- **데스크탑**: `md:max-w-screen-xl` 적용, 사이드바 공간 확보 (`md:ml-64`)
- **네비게이션 분기**:
  - 모바일: `BottomNavigation` (하단 탭바)
  - 데스크탑: `Sidebar` (왼쪽 고정 사이드바)
- **인증 페이지**: 로그인, 회원가입에서 사이드바 숨김

### 3. 홈 페이지 그리드 레이아웃

- **파일**:
  - `src/pages/Home.tsx`
  - `src/components/home/DiaryCards.tsx`
- **내용**: 일기 카드 리스트 반응형 그리드
- **모바일**: 1열 (`flex-col`)
- **태블릿**: 2열 (`md:grid-cols-2`)
- **데스크탑**: 3열 (`lg:grid-cols-3`)
- **간격**: 모바일 `gap-4`, 데스크탑 `md:gap-6`

### 4. 감정 분석 페이지 대시보드 레이아웃

- **파일**: `src/pages/Analysis.tsx`
- **내용**: 데스크탑에서 2열 레이아웃 적용
- **왼쪽 컬럼 (2/3)**: 감정 차트, 활동, 관계 분석
- **오른쪽 컬럼 (1/3)**: 캐릭터(마음 속 동물)
- **기간 선택**: 드롭다운 위치 조정 (모바일: 수직, 데스크탑: 수평)

### 5. 지도(Map) 페이지 스타일링

- **파일**: `src/pages/Map.tsx`
- **내용**: 데스크탑에서 지도 컨테이너 스타일링
- **모바일**: 전체 화면 높이
- **데스크탑**: 고정 높이 및 둥근 효과(`md:rounded-xl md:shadow-xl`)

### 6. 감정 상세 페이지 그리드 레이아웃

- **파일**:
  - `src/pages/analysis/Vitality.tsx` (활력)
  - `src/pages/analysis/Stress.tsx` (스트레스)
  - `src/pages/analysis/Depress.tsx` (우울)
  - `src/pages/analysis/Anxiety.tsx` (불안)
  - `src/pages/analysis/Stable.tsx` (안정)
  - `src/pages/analysis/RelationBond.tsx` (유대)
- **내용**: 각 감정별 정보 박스를 모바일 세로에서 데스크탑 그리드로 변경
- **모바일**: 3개 박스 세로 배치
- **태블릿**: 2열 (`md:grid-cols-2`)
- **래지탑**: 3열 (`lg:grid-cols-3`)

### 7. 할 일(Todos) 페이지 너비 최적화

- **파일**: `src/components/todo/CalendarSection.tsx`
- **내용**: 캘린더 섹션 너비 최적화
- **데스크탑**: `md:max-w-xl md:mx-auto` 적용으로 중앙 정렬

### 8. 타임라인 그래프 중앙 정렬

- **파일**: `src/components/aboutMe/Mental/MentalChart.tsx`
- **내용**: X축 텍스트 중앙 정렬
- **변경**: `margin={{ left: 0, ... }}` → `margin={{ left: 30, ... }}`

## 문제 해결 과정

### 문제 1: 데스크탑에서 일기 작성 버튼 없음

- **원인**: 사이드바가 없어서 일기 작성 불가
- **해결**: 사이드바에 "일기 작성" 버튼 추가 (활성화 표시)

### 문제 2: 로그인 화면에서 사이드바 보임

- **원인**: `HIDE_SIDEBAR_PATHS` 배열 누락, Layout.tsx에서 조건문 오류
- **해결**: `HIDE_SIDEBAR_PATHS` 배열 생성 및 `shouldShowSidebar` 변수로 사이드바 표시 제어

### 문제 3: 로그인 화면에서 콘텐츠가 왼쪽으로 밀려있음

- **원인**: 메인 콘텐츠가 항상 `flex justify-center` 적용
- **해결**: 사이드바 존재 여부에 따라 조건부로 레이아웃 적용
  - 사이드바 있음: `md:flex md:flex-row`
  - 사이드바 없음: `flex justify-center`

### 문제 4: 타임라인 그래프가 왼쪽으로 치우쳐짐

- **원인**: XAxis `margin={{ left: 0, ... }}` 설정
- **해결**: `margin={{ left: 30, ... }}`로 중앙 정렬

## 반응형 전환 전략

### Mobile First 접근법

- **기본(default)**: 모바일 스타일 적용
- **`md:` (768px+)**: 태블릿 스타일 적용
- **`lg:` (1024px+)**: 랩지탑 스타일 적용

### 주요 Breakpoint

| Breakpoint | 최소 너비 | 적용 대상 |
| ---------- | --------- | --------- |
| (default)  | 0px       | 모바일    |
| `md:`      | 768px     | 태블릿    |
| `lg:`      | 1024px    | 랩지탑    |

## 적용된 Tailwind 클래스 예시

```tsx
{/* 반응형 사이드바 */}
<aside className="hidden md:flex fixed left-0 top-0 h-full w-64">

{/* 반응형 그리드 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

{/* 조건부 레이아웃 */}
<div className={`${shouldShowSidebar ? "md:flex md:flex-row" : "flex justify-center"}`}>

{/* 조건부 너비/패딩 */}
<main className={`h-full ${
  shouldShowSidebar ? "md:ml-64 md:max-w-screen-xl" : ""
}`}>
```

## 기술 스택 정보

- **React**: 19.1.0
- **TypeScript**: 5.8.3 (strict mode)
- **Bundler**: Vite 6.3.5
- **State Management**: Zustand (클라이언트), TanStack Query (서버)
- **Styling**: Tailwind CSS 3.4.3
- **UI Components**: Shadcn UI
- **Path Alias**: `@/*` → `src/*`
- **Router**: React Router v6

## 향후 개선 사항

1. **ResponsiveDialog 컴포넌트**: 모바일 Drawer, 데스크탑 Dialog 래퍼 구현
2. **테스트 코드 추가**: 다양한 화면 크기에서 레이아웃 테스트
3. **접근성(Accessibility) 개선**: 키보드 네비게이션 지원

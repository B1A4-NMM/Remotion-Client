# 📌 감정 기반 관계도 앱

사용자의 감정을 시각적으로 표현하고 관리할 수 있는 감정 기반 관계도 앱

---

## 🛠 사용 기술 스택

- **Node.js**: v20.14.0
- **TypeScript**: 5.8.3
- **React**: 19.1.0
- **React DOM**: 19.1.0
- **React Router DOM**: 7.6.2
- **React Hook Form**: 7.58.1 – 폼 상태 관리
- **Zustand**: 5.0.5 – 클라이언트 상태 관리
- **TanStack React Query (@tanstack/react-query)**: 5.81.2 – 서버 상태 관리
- **Tailwind CSS**: 3.4.3 – 유틸리티 기반 CSS 프레임워크 (※ 4.x 버전 이슈로 다운그레이드)
- **Shadcn UI**: Tailwind 기반 컴포넌트 라이브러리
- **Lucide React**: 0.297.0 – 아이콘 컴포넌트
- **Vite**: 6.3.5 – 번들링 및 개발 서버
- **Framer Motion**: 11.0.17 – 애니메이션 라이브러리

### 📦 기타 의존성

- `@tailwindcss/postcss`: Tailwind 전용 PostCSS 플러그인
- `tailwindcss-animate`: Shadcn UI용 애니메이션 플러그인
- `class-variance-authority`: Shadcn 컴포넌트 스타일링 유틸리티
- `clsx`: 조건부 className 유틸리티
- `autoprefixer`: 브라우저 접두어 자동 처리기

---

## 🔍 Lint & Formatter

- **ESLint**: 9.29.0 (Flat Config 기반 - `eslint.config.js`)
  - `@eslint/js`: 9.25.0
  - `@typescript-eslint/eslint-plugin`: 8.34.1
  - `@typescript-eslint/parser`: 8.34.1
  - `typescript-eslint`: 8.30.1
  - `eslint-plugin-react`: 7.37.5
  - `eslint-plugin-react-hooks`: 5.2.0
  - `eslint-plugin-react-refresh`: 0.4.19
  - `eslint-plugin-prettier`: 5.5.0
- **Prettier**: 3.6.0
  - `eslint-config-prettier`: 10.1.5

---

## ✨ 타입 자동 완성

- `@types/react`: 19.1.2
- `@types/react-dom`: 19.1.2

---

## ⚙️ 프로젝트 실행 방법

````bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

```
---

## 🧩 VSCode 추천 설정

`.vscode/settings.json`에 아래 내용을 추가해주세요.
자동 저장 시 Prettier와 ESLint가 함께 동작합니다.

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
````

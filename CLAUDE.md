# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NFC Tag Reader - Android 전용 웹 애플리케이션으로 Web NFC API를 사용하여 NFC 태그를 읽고 정보를 표시합니다.

## Tech Stack

- React 18 with TypeScript
- Vite (build tool with HTTPS support via @vitejs/plugin-basic-ssl)
- Tailwind CSS for styling
- Vitest for testing
- Web NFC API (Android Chrome only)

## Development Commands

```bash
npm install          # 의존성 설치
npm run dev          # HTTPS 개발 서버 실행 (https://localhost:5173)
npm run build        # 프로덕션 빌드
npm run test         # 테스트 실행
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 체크
```

## Project Architecture

### Core Components
- `NFCReader`: NFC 읽기 버튼 및 상태 관리 컴포넌트
- `DataDisplay`: 읽은 NFC 데이터 표시 및 히스토리 관리
- `useNFC`: Web NFC API 인터페이스를 제공하는 커스텀 훅

### Data Flow
1. 사용자가 NFCReader 컴포넌트의 버튼 클릭
2. useNFC 훅이 Web NFC API를 통해 스캔 시작
3. NFC 태그 감지 시 NDEFReader 이벤트 리스너가 데이터 수신
4. 파싱된 데이터가 state에 저장되고 DataDisplay 컴포넌트에 전달
5. 읽기 히스토리는 세션 동안 메모리에 유지 (최대 10개)

### Key Technical Decisions
- **Android Only**: iOS Safari가 Web NFC를 지원하지 않아 Android Chrome 전용으로 개발
- **HTTPS Required**: Web NFC API는 보안 컨텍스트(HTTPS)에서만 작동
- **Client-Side Only**: 백엔드 서버 없이 모든 처리를 클라이언트에서 수행
- **Session Storage**: 읽기 기록을 세션 메모리에만 저장 (새로고침 시 초기화)

## Important Constraints

1. **Browser Support**: Android Chrome 89+ 필요 (Web NFC API 지원)
2. **HTTPS Requirement**: 로컬 개발에서도 HTTPS 필수 (Vite 설정으로 자동 처리)
3. **NFC Permission**: 사용자가 NFC 권한을 허용해야 함
4. **No iOS Support**: 현재 iOS에서는 작동하지 않음

## Testing Strategy

- Unit tests for utility functions (nfcParser.ts)
- Component tests with mocked Web NFC API
- Integration tests simulate user workflows

## Deployment Notes

- Must deploy to HTTPS-enabled hosting (Vercel, Netlify 권장)
- PWA manifest 포함 - Android에서 앱으로 설치 가능
- Service Worker 미구현 (향후 오프라인 지원 시 추가 필요)
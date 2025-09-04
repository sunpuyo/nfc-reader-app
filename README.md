# NFC Tag Reader

Android 스마트폰에서 NFC 태그를 읽고 정보를 표시하는 웹 애플리케이션입니다.

## 기능

- NFC 태그 읽기 (Android Chrome 전용)
- 태그 시리얼 번호 표시
- NDEF 레코드 파싱 및 표시
- 읽기 기록 관리 (세션 동안)
- PWA 지원 (앱으로 설치 가능)

## 기술 스택

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Web NFC API

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm run test

# 빌드
npm run build
```

## Render.com 배포 방법

### 1. GitHub에 코드 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-github-repo-url]
git push -u origin main
```

### 2. Render.com 설정

1. [Render.com](https://render.com) 로그인
2. "New +" → "Static Site" 선택
3. GitHub 저장소 연결
4. 다음 설정 입력:
   - **Name**: nfc-reader-app (원하는 이름)
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment**: Node 18

5. "Create Static Site" 클릭

### 3. 자동 배포

- GitHub main 브랜치에 push하면 자동으로 재배포됩니다
- Render는 자동으로 HTTPS를 제공합니다

## 요구사항

- Android Chrome 89+ (Web NFC API 지원)
- HTTPS 연결 (Render.com은 자동으로 HTTPS 제공)

## 제약사항

- iOS Safari는 Web NFC API를 지원하지 않음
- HTTPS 환경에서만 작동 (localhost 제외)

## 테스트

Android 기기에서 테스트하려면:
1. Chrome 브라우저 열기
2. 배포된 URL 접속
3. "NFC 태그 읽기" 버튼 클릭
4. NFC 권한 허용
5. NFC 태그를 휴대폰 뒷면에 가져다 대기
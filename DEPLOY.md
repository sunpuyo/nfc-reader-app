# Render.com 배포 가이드

## 사전 준비사항
- GitHub 계정
- Render.com 계정 (GitHub로 가입 권장)

## 배포 단계

### 1. GitHub에 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit for NFC Reader App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nfc-reader-app.git
git push -u origin main
```

### 2. Render.com 설정

1. [Render.com](https://render.com) 로그인
2. Dashboard에서 "New +" 버튼 클릭
3. "Static Site" 선택
4. GitHub 연결 및 저장소 선택
5. 다음 설정 확인:
   - **Name**: nfc-reader-app
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. "Create Static Site" 클릭

### 3. 자동 배포 확인

- `render.yaml` 파일이 프로젝트에 포함되어 있어 자동으로 설정됨
- 빌드 로그에서 진행 상황 확인
- 배포 완료 후 제공된 URL로 접속 (https://nfc-reader-app.onrender.com)

## 중요 사항

### HTTPS 자동 제공
- Render.com은 자동으로 HTTPS를 제공하므로 Web NFC API 사용 가능

### 브라우저 요구사항
- Android Chrome 89+ 필요
- iOS는 지원하지 않음

### 환경 변수
- 현재 프로젝트는 환경 변수가 필요하지 않음
- 필요시 Render Dashboard > Environment에서 설정

## 업데이트 방법

코드 변경 후:
```bash
git add .
git commit -m "Update message"
git push
```

GitHub에 푸시하면 Render가 자동으로 재배포

## 문제 해결

### 빌드 실패 시
1. Render Dashboard > Logs 확인
2. 로컬에서 `npm run build` 테스트
3. Node.js 버전 확인 (package.json에 engines 필드 추가 가능)

### 404 에러 발생 시
- `render.yaml`의 rewrite 규칙 확인
- SPA 라우팅을 위해 모든 경로를 index.html로 리디렉션

## 커스텀 도메인 (선택사항)

1. Render Dashboard > Settings > Custom Domains
2. 도메인 추가 후 DNS 설정
3. SSL 인증서는 자동 발급됨
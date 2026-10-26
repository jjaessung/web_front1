# 김재성 | Personal Portfolio

순수 HTML, CSS, JavaScript로 만든 반응형 포트폴리오입니다. GitHub `jjaessung`의 공개 저장소를 가져와 프로젝트 카드로 보여줍니다.

- 연락처: rlawotjd03@naver.com
- GitHub: https://github.com/jjaessung
- 저장소 URL: https://github.com/jjaessung/web_front1
- 배포 URL: https://jjaessung.github.io/web_front1/

## 실행

VS Code에서 `index.html`을 열고 Live Server의 **Open with Live Server**를 선택합니다. 빌드나 패키지 설치는 필요 없습니다.

## 파일 구성

```text
index.html                  시맨틱 페이지 구조
css/style.css               반응형 레이아웃 및 테마 변수
js/main.js                  이벤트, 상태, DOM 렌더링, GitHub API
images/profile.svg          이니셜 프로필 일러스트
.github/workflows/pages.yml GitHub Pages 자동 배포
```

## 기술과 동작

- HTML5: header/nav/main/section/article/footer, label 연결, 이미지 대체 텍스트
- CSS3: 모바일 우선, 768px/1024px 브레이크포인트, Flex 네비게이션, auto-fit/minmax Grid 카드
- JavaScript: const/let, 화살표 함수, 구조분해, 템플릿 리터럴, map/filter/forEach
- 메뉴: 버튼 클릭 → menuOpen 변경 → active 클래스와 aria-expanded 갱신
- 테마: 토글 → theme 변경 → data-theme, 버튼 안내, localStorage 갱신
- 최초 테마: 저장된 설정 우선, 없으면 시스템 prefers-color-scheme 적용
- 프로젝트: fetch → loading/success/error 변경 → 로딩·카드·오류·빈 상태 렌더링
- 언어 필터: 클릭 → filter 변경 → filter() 결과로 카드 렌더링
- 폼: input/submit → errors/submitted 변경 → 필드 근처 오류 및 완료 메시지 갱신
- 네비게이션 배경 변경: 스크롤 **60px 이상**
- 맨 위로 이동 버튼 표시: 스크롤 **300px 이상**
- Intersection Observer: **threshold 0.2**, 한 번 노출 후 관찰 해제
- 부드러운 스크롤 및 키보드 초점 이동. reduced-motion 설정에서는 애니메이션 생략

폼은 입력 검증 데모입니다. **실제 이메일 전송이나 메시지 저장은 하지 않습니다.** 실제 문의에는 이메일 링크를 사용합니다. 자기소개·기술 목록은 초안이며 경력이나 숙련도를 주장하지 않습니다. 사진이 준비되면 `images/profile.svg` 대신 사진을 넣고 alt도 수정하세요.

## GitHub API

`https://api.github.com/users/jjaessung/repos?sort=updated&per_page=100&page=1`

공개 저장소를 최신 수정순으로 가져오며 다음 페이지가 있으면 이어서 조회합니다. 언어별 필터, 별 수, fork/보관 상태를 표시합니다. 외부 데이터는 이스케이프해서 삽입하며, 저장소 링크는 고정 GitHub 도메인으로 생성합니다.

요청 제한(403 포함), 404, 네트워크 실패, 15초 시간 초과는 오류 UI와 재시도 버튼으로 처리합니다. 저장소가 없으면 빈 상태를 표시합니다. 인증 없는 API는 시간당 60회 제한이 있으므로 불필요한 새로고침은 피하세요.

## 확인 항목

1. 모바일(예: 390px), 태블릿(768px), 데스크톱(예: 1440px)에서 가로 넘침 및 메뉴 확인
2. 모바일 메뉴 열기/닫기, Escape 닫기, 섹션 이동 확인
3. 다크 모드 전환 후 새로고침하여 유지 확인
4. 스크롤 60px/300px에서 헤더/맨 위 버튼 확인
5. 프로젝트 로딩·카드·언어 필터 확인
6. 개발자 도구에서 네트워크 오프라인 또는 403 응답으로 오류 UI와 재시도 확인
7. API 응답을 `[]`로 대체하여 빈 상태 확인
8. 빈 폼, 잘못된 이메일, 정상 입력에서 오류 및 완료 안내 확인
9. Tab 키로 메뉴, 테마, 링크, 필터, 폼 접근 확인

## GitHub Pages 배포

1. GitHub에 저장소를 만들고 이 폴더의 파일을 `main` 브랜치로 업로드합니다.
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
3. `main` push 또는 Actions의 **Deploy portfolio to GitHub Pages → Run workflow**로 배포합니다.
4. 성공한 워크플로의 `github-pages` URL에 접속하여 위 확인 항목을 재검증합니다.
5. 실제 저장소 URL과 배포 URL을 README 상단에 기록합니다.

워크플로는 index.html, css, js, images만 배포합니다. 저장소 기본 브랜치가 main이 아니면 워크플로의 branches를 수정하세요. 상대 경로를 사용하므로 저장소 하위 경로에서도 동작합니다.

## 제출 스크린샷

브라우저 화면 검증 후 아래 경로에 실제 캡처를 저장하고 링크를 추가하세요. 현재 스크린샷은 아직 없습니다.

- `images/screenshots/desktop.png`: 데스크톱 화면
- `images/screenshots/mobile.png`: 모바일 화면
- `images/screenshots/dark.png`: 다크 모드 화면

## 핵심 개념

시맨틱 태그는 콘텐츠 역할을 브라우저와 보조 기술에 전달합니다. Flexbox는 네비게이션처럼 한 방향 정렬에, Grid는 여러 행·열로 구성하는 프로젝트 카드에 사용했습니다. querySelector로 선택한 DOM에 addEventListener로 이벤트를 연결하고 상태를 변경한 뒤 render 함수가 화면을 갱신합니다. async/await는 비동기 응답을 기다리는 코드를 읽기 쉽게 표현하며 try/catch/finally가 성공·실패·후처리를 담당합니다.

## 배포 확인 기록 (2026-10-26)

GitHub Actions 배포 성공과 공개 페이지 및 CSS, JavaScript, 프로필 SVG의 HTTP 200 응답을 터미널에서 확인했습니다. 인증 없는 GitHub 저장소 API도 정상 응답했습니다. 브라우저 화면 검증 및 데스크톱/모바일/다크 모드 스크린샷은 아직 완료하지 않았습니다.

# 김재성의 웹 포트폴리오

HTML, CSS, JavaScript로 만든 반응형 개인 포트폴리오입니다. 외부 프레임워크와 라이브러리 없이 화면 구성, 다크 모드, GitHub 프로젝트 조회, 문의 폼 검증을 구현했습니다.

## 목차

- [사용 기술](#사용-기술)
- [주요 기능](#주요-기능)
- [실행 방법](#실행-방법)
- [폴더 구조](#폴더-구조)
- [설정과 동작 기준](#설정과-동작-기준)
- [학습 노트](#학습-노트)

## 사용 기술

| 기술 | 사용 목적 |
| --- | --- |
| HTML5 | 시맨틱 마크업, 페이지 구조, 접근성 속성 |
| CSS3 | Flexbox, Grid, CSS 변수, 반응형 레이아웃, 전환 효과 |
| JavaScript | DOM 조작, 이벤트 처리, 상태 관리, 비동기 요청 |
| GitHub REST API | 공개 저장소 목록과 프로젝트 정보 조회 |
| 브라우저 API | `localStorage`, `IntersectionObserver`, `matchMedia`, `AbortController` |

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 다크 모드 | 시스템 설정을 초기값으로 사용하고, 선택한 테마를 `localStorage`에 저장 |
| 모바일 메뉴 | 메뉴 열기·닫기, 바깥 영역 클릭 및 Escape 키로 닫기 |
| 페이지 이동 | 섹션 링크의 부드러운 스크롤과 이동 후 포커스 처리 |
| 스크롤 UI | 헤더 스타일 변경, 맨 위로 이동 버튼 표시 |
| 섹션 애니메이션 | 화면에 들어온 섹션을 `IntersectionObserver`로 감지해 표시 |
| GitHub 프로젝트 | 공개 저장소를 페이지별로 조회하고 언어별로 필터링 |
| 요청 상태 표시 | 로딩, 오류, 빈 결과 안내와 재시도 버튼 |
| 문의 폼 검증 | 이름·이메일·메시지 필수 입력과 이메일 형식 검사 |
| 접근성 | 본문 바로 가기, 키보드 포커스, ARIA 상태, 모션 감소 설정 지원 |

> 문의 폼은 입력 검증을 위한 데모입니다. 메시지를 실제로 전송하지 않으며, 문의는 페이지의 이메일 링크를 이용합니다.

## 실행 방법

1. 저장소를 내려받습니다.
2. 브라우저에서 `index.html`을 엽니다. 별도의 설치나 빌드 과정은 없습니다.
3. 프로젝트 목록을 불러오려면 인터넷 연결이 필요합니다.

GitHub API 요청에 실패하면 화면의 **다시 시도** 버튼으로 재요청할 수 있습니다.

## 폴더 구조

```text
Web_Front/
├── .github/           # GitHub 설정 및 워크플로
├── css/
│   └── style.css      # 레이아웃, 테마, 반응형 스타일
├── images/
│   └── profile.svg    # 프로필 일러스트 및 파비콘
├── js/
│   └── main.js        # 이벤트, 상태 관리, GitHub API, 폼 검증
├── index.html         # 페이지 구조와 콘텐츠
├── prompt.md          # 프로젝트 관련 프롬프트
└── README.md
```

## 설정과 동작 기준

### GitHub 계정 변경

[`js/main.js`](js/main.js)의 `CONFIG.github`을 수정하면 해당 계정의 공개 저장소를 가져옵니다.

```js
const CONFIG = { github: 'jjaessung' };
```

사용하는 API 경로는 다음과 같습니다. 한 페이지에 최대 100개를 요청하고, 응답의 `Link` 헤더에 다음 페이지가 있으면 이어서 조회합니다.

```text
GET https://api.github.com/users/{username}/repos?sort=updated&per_page=100&page={page}
```

### 화면과 요청 기준

| 항목 | 기준 | 구현 위치 |
| --- | --- | --- |
| 헤더 스타일 변경 | 스크롤 위치 60px 이상 | `js/main.js` → `renderScroll` |
| 맨 위로 이동 버튼 | 스크롤 위치 300px 이상 | `js/main.js` → `renderScroll` |
| 섹션 표시 애니메이션 | 요소의 20%가 화면에 진입 | `js/main.js` → `threshold: 0.2` |
| GitHub 요청 제한 시간 | 전체 조회에 15초 | `js/main.js` → `loadProjects` |
| 태블릿 레이아웃 | 화면 너비 768px 이상 | `css/style.css` → 미디어 쿼리 |
| 데스크톱 크기 조정 | 화면 너비 1024px 이상 | `css/style.css` → 미디어 쿼리 |

## 학습 노트

아래 예시는 구현 원리를 설명하기 위해 일부를 간추린 코드입니다. 전체 동작은 [`index.html`](index.html), [`css/style.css`](css/style.css), [`js/main.js`](js/main.js)에서 확인할 수 있습니다.

### 1. HTML · CSS · JavaScript 연결

- **HTML**은 페이지의 구조와 내용을 정의합니다.
- **CSS**는 색상, 크기, 배치와 같은 스타일을 담당합니다.
- **JavaScript**는 사용자 이벤트에 반응하고 상태와 화면을 갱신합니다.

```html
<link rel="stylesheet" href="css/style.css">
<script src="js/main.js" defer></script>
```

현재 프로젝트는 두 태그를 `<head>`에 둡니다. 외부 스크립트의 `defer`는 HTML 파싱과 함께 파일을 내려받고, 파싱이 끝난 뒤 실행하도록 합니다. 따라서 스크립트에서 DOM 요소에 접근할 수 있습니다.

### 2. HTML의 의미와 접근성

<details>
<summary>시맨틱 태그, 속성, ID와 클래스</summary>

#### 시맨틱 태그

`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`는 콘텐츠의 역할을 나타냅니다. `<div>`와 `<span>`은 자체적으로 특정한 의미를 갖지 않는 범용 요소입니다.

`<header>`는 태그 자체로 의미를 전달합니다. `<div id="header">`의 `id`는 요소를 식별하는 이름이며, 시맨틱 태그의 의미를 대신하지 않습니다.

#### 주요 속성

| 속성 | 역할 |
| --- | --- |
| `id`, `class` | CSS와 JavaScript에서 요소를 선택하는 이름 |
| `href` | 링크의 목적지 |
| `src` | 이미지나 스크립트 등 리소스의 주소 |
| `type` | 버튼이나 입력 요소의 종류 |
| `placeholder` | 입력 예시나 힌트. 레이블을 대신하지 않음 |
| `alt` | 이미지의 대체 텍스트 |
| `aria-label` | 요소의 접근 가능한 이름 |
| `aria-pressed` | 토글 버튼의 눌림 상태 |
| `aria-expanded` | 메뉴 등의 펼침 상태 |

#### ID와 클래스

| 구분 | ID | 클래스 |
| --- | --- | --- |
| 사용 범위 | 문서 안에서 고유한 값 | 여러 요소에서 재사용 가능 |
| CSS 선택자 | `#nav-menu` | `.theme-toggle` |
| JavaScript 조회 | `getElementById('nav-menu')` | `querySelectorAll('.reveal')` |

#### 레이블과 입력창 연결

`label`의 `for`와 입력창의 `id`를 일치시키면 레이블을 눌러 입력창에 포커스를 줄 수 있습니다.

```html
<label for="name">이름</label>
<input type="text" id="name" name="name">
```

</details>

### 3. CSS 레이아웃과 반응형 디자인

<details>
<summary>Flexbox, Grid, CSS 변수, 다크 모드와 애니메이션</summary>

#### Flexbox와 Grid

| 구분 | Flexbox | Grid |
| --- | --- | --- |
| 배치 기준 | 주로 한 방향의 정렬 | 행과 열을 함께 구성 |
| 활용 예 | 내비게이션, 버튼 묶음 | 기술 카드, 프로젝트 카드 |

프로젝트 카드에는 다음 스타일을 사용합니다.

```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
}
```

- `auto-fit`: 공간에 맞춰 열 개수를 자동으로 조절합니다.
- `min(100%, 280px)`: 좁은 화면에서는 컨테이너 너비를 넘지 않도록 합니다.
- `1fr`: 남은 공간을 열들이 나누어 사용합니다.

`block`, `inline`, `inline-block`은 기본 배치 방식이며, `position`은 요소의 위치를 조절합니다. `float`은 이미지 주변으로 텍스트가 흐르게 할 때 사용할 수 있습니다.

#### CSS 변수와 다크 모드

CSS 변수에 색상과 간격 등의 값을 모아두고 `var()`로 사용합니다. 다음은 개념 예시입니다.

```css
:root {
  --bg: #ffffff;
  --text: #222222;
}

[data-theme="dark"] {
  --bg: #111111;
  --text: #eeeeee;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

JavaScript가 `<html>`의 `data-theme` 값을 변경하면 해당 테마의 변수가 적용됩니다.

#### 모바일 퍼스트

기본 스타일을 작은 화면에 맞춰 작성하고, 화면이 넓어질 때 미디어 쿼리로 확장합니다. 기술 카드는 기본 1열이며 768px 이상에서 3열로 바뀝니다.

```css
.skills-grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### 전환과 스크롤 효과

- `:hover`: 마우스가 요소 위에 있을 때의 스타일입니다.
- `transition`: 스타일 변화가 일정 시간에 걸쳐 일어나도록 합니다.
- `box-shadow`: 요소에 그림자를 추가합니다.
- `scroll-behavior: smooth`: 앵커 이동 등에 부드러운 스크롤을 적용합니다.

현재 섹션 링크는 JavaScript의 `scrollIntoView()`로 이동과 포커스를 함께 처리합니다. 섹션 표시 효과는 `IntersectionObserver`와 `.reveal.is-pending`, `.reveal.is-visible` 클래스로 구현합니다. 사용자 설정이 모션 감소인 경우 애니메이션을 줄입니다.

</details>

### 4. JavaScript 이벤트와 상태 관리

<details>
<summary>DOM, 변수, 함수, 배열 처리와 화면 갱신</summary>

#### DOM과 이벤트

DOM은 브라우저가 HTML을 해석해 만든 트리 구조입니다. JavaScript는 이 구조에서 요소를 찾고, 속성과 내용을 변경합니다.

```js
const themeButton = document.querySelector('.theme-toggle');

themeButton.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  renderTheme();
});
```

`querySelector()`는 요소를 찾고, `addEventListener()`는 이벤트가 발생했을 때 실행할 콜백을 등록합니다. 콜백은 등록 즉시 실행되는 것이 아니라 사용자가 버튼을 클릭할 때 실행됩니다.

#### 변수와 함수

- `const`: 변수에 다른 값을 다시 대입할 수 없습니다. 객체 내부의 속성은 변경할 수 있습니다.
- `let`: 값이 바뀌는 변수에 사용하며 블록 범위를 가집니다.
- `var`: 함수 범위를 가지며 같은 범위에서 재선언할 수 있습니다.
- 화살표 함수: `const renderTheme = () => { ... };` 형태로 함수를 정의합니다.
- `DOMContentLoaded`: HTML 파싱과 지연 스크립트 실행이 끝났을 때 발생하는 이벤트입니다. 현재 코드는 `defer`로 로드되어 최상위에서 초기화를 수행합니다.

#### 템플릿 리터럴과 구조 분해

백틱으로 감싼 문자열에는 `${표현식}`을 넣을 수 있습니다. 구조 분해는 객체나 배열의 값을 변수로 꺼내는 문법입니다.

```js
const { status, repos, filter } = state.projects;
const message = `프로젝트 ${repos.length}개`;
const language = repos[0]?.language ?? '기타';
```

`??`는 왼쪽 값이 `null` 또는 `undefined`일 때 오른쪽 값을 사용합니다.

#### 배열 메서드

| 메서드 | 역할 | 예시 |
| --- | --- | --- |
| `map()` | 각 요소를 변환해 새 배열 생성 | `repos.map(({ language }) => language)` |
| `filter()` | 조건을 만족하는 요소로 새 배열 생성 | `repos.filter((repo) => repo.language === 'JavaScript')` |
| `forEach()` | 각 요소에 작업 수행 | `buttons.forEach((button) => button.focus())` |

#### 상태 → 화면 갱신

현재 프로젝트는 테마, 메뉴, 프로젝트, 폼 상태를 `state` 객체에 저장합니다.

```text
사용자 이벤트 또는 API 응답
  → state 변경
  → render 함수 호출
  → DOM 갱신
```

프로젝트 조회의 `status`는 `loading`, `success`, `error` 중 하나입니다. 빈 결과는 별도 상태 문자열 대신 저장소 배열 또는 필터 결과의 길이로 판단합니다.

</details>

### 5. GitHub API와 문의 폼

<details>
<summary>비동기 요청, 오류 처리, 입력 검증</summary>

#### fetch와 async/await

`fetch()`는 네트워크 요청을 보내고 Promise를 반환합니다. `async` 함수 안에서 `await`를 사용하면 응답을 기다린 뒤 다음 처리를 이어갈 수 있습니다.

```js
const response = await fetch(
  `https://api.github.com/users/${encodeURIComponent(CONFIG.github)}/repos?sort=updated&per_page=100&page=1`
);

if (!response.ok) {
  throw new Error(`GitHub HTTP ${response.status}`);
}

const repos = await response.json();
```

실제 `loadProjects()`는 다음 페이지까지 조회하고, `try/catch/finally`로 성공·오류 상태와 화면 갱신을 처리합니다. `AbortController`는 제한 시간이 지나면 요청을 중단합니다. API에서 가져온 문자열은 `escapeHTML()`로 이스케이프한 뒤 카드에 표시합니다.

#### 조회 흐름

1. `status`를 `loading`으로 설정하고 로딩 UI를 표시합니다.
2. 조회에 성공하면 `repos`를 저장하고 `success`로 변경합니다.
3. 조회에 실패하면 `error`로 변경하고 재시도 버튼을 표시합니다.
4. 저장소나 필터 결과가 없으면 빈 결과 메시지를 표시합니다.

#### 문의 폼 검증

- `input` 이벤트: 수정 중인 필드의 필수값과 이메일 형식을 검사합니다.
- `submit` 이벤트: `event.preventDefault()`로 기본 제출을 막고 모든 필드를 검사합니다.
- 오류 표시: 필드별 메시지와 `aria-invalid`를 갱신합니다.
- 포커스 이동: 오류가 있으면 첫 번째 오류 필드로 이동합니다.
- 검증 성공: 입력 확인 안내를 표시합니다. 실제 전송 기능은 연결되어 있지 않습니다.

</details>

순수 HTML / CSS / JavaScript(바닐라 JS)로 제작한 반응형 포터 웹사이트입니다. 외부 프레임워크·라이브러리 없이 시맨틱 마크업, CSS 기반 다크 소스, GitHub API 캐스팅을 직접 구현했습니다.

사용 기술
HTML5 (시맨틱 태그: header, nav, main, section, article, footer)
CSS3(CSS 반응형, Flexbox, Grid, 미디어 쿼리 기반 반응형)
바닐라 자바스크립트 (ES6 이상, fetch/ async-await, IntersectionObserver, localStorage)
GitHub REST API( /repos/{username}/{repo}—휴대용 개인 조회)
구글 폰트(스페이스 그로테스크, 인터)
주요 기능
다크 모드 토글 (localStorage에 저장되어 새로고침 보호 유지, 시스템 다크 모드 감지 지원)
모바일 메뉴 ( classList.toggle('active'))
단순함량함량
스크롤 위치에 따라 내비게이션 변경 / 스크롤 탑 버튼
IntersectionObserver기반 섹션은 애니메이션
GitHub API로 목록을 볼 때 프로젝트 섹션에 뭉쳐서 (로딩 / 성공 / / 빈상태 UI 처리)
언어별 프로젝트 위치 ( Array.prototype.filter)
미사일 포맷에 문의하세요 (필수값, 이메일 형식, 필드별 메시지)
히어로 섹션 타이핑 효과
기준값 (Threshold) 문서화
요소	값	위치
스크롤 탑 버튼 카테고리	300px	js/main.js→SCROLL_TOP_THRESHOLD
배경화면 변경 기준	60px	js/main.js→NAV_SCROLL_THRESHOLD
스크롤 애니메이션 IntersectionObserver 임계값	0.2	js/main.js→REVEAL_THRESHOLD
폴더 구조
introduce_website/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── profile.svg
└── README.md
정리 노트
일단, html은 구조/내용, css는 스타일, js는 이벤트를 처리함

1. HTML, CSS, JS가 어떻게 서로 연결되는지
html<->css는 <link rel="stylesheet" href="css/style.css" />로, html의 head에서, HTML ← JS는 <script src="js/main.js" defer></script>에서 <body>의 끝( </body>)에서 불려옴

CSS/JS가 HTML의 "어떤 요소"를 표시하는 **선택자(selector)**로 연결 즉 HTML에 태그 id="theme-toggle", CSS는 #theme-toggle로 스타일을 강조, JS는 getElementById("theme-toggle")로 그 버튼을 클릭하여 이벤트를 연결하는 방식

2. HTML
<> 내부에 포함된 의미
태그 이름 (header) — 이 요소가 "무엇인지"를 정함 (의미/역할)
시맨틱 - 이름이 스스로가 역할을 하고 있습니다.
레이아웃:<header> <nav> <main> <section> <article> <aside> <footer>
컨텐츠용: <h1>~<h6>(제목) <p>(문단) <ul>/<li>(목록) <img>(이미지) <button>(버튼) <form>(폼) <a>(링크)
비시맨틱 - <div>, <span>의미 없는 그냥 "Box". 역할은 class/id로 설명해야 함
속성(속성) (key="value"형태) — 그 요소에 대한 부가 정보. 뭐 재산이 목적이니까
요소	역할
ID, 클래스	구분/이름표(CSS·JS가 결함이 있을 수 있게)
href	링크가 실제로 있는 주소
src	실제로 파일을 불러오는 방법
유형	요소의 동작 방식을 동작시키거나, 버튼 모양 설정 ex) <button type="submit">신청서를 제출하는 것과 같이
플레이스홀더	입력창에 보이는 안내 문구
alt	대체 텍스트(로드하지 않고 대신 대체 텍스트, 스크린 리더가 장애를 인에게 전달하는 텍스트)
aria-*	접근하는 정보(시각·청각 장애가 있는 사용자가 스크린 리더 등을 지원하는 웹을 좀 수 있게 돕는 정보) ex) aria-label="다크 모드 전환"→ 화면엔 이모지만 하지만, 스크린 리더는 이 부분을 읽어줌 / aria-pressed="false"→ 이 버튼이 지금 눌린 상태인지 알릴 때 줌(JS가 클릭할 때마다마다)
시맨틱 태그를 사용하는 이유
기본적으로는 전체적으로 <div id="header">, <div id="nav">마치 의미 없는 <div>id 구분 구분 기호입니다. 브라우저/스크린리더/검색 엔진에는 "얘가 헤더인지 그냥 상자인지" 알 수 없습니다.

<div id="header">vs <header>는 외관보기(화면)는 쯔을 수 있지만, <header>"나는 헤더다"라는 의미를 브라우저·검색엔진(SEO)·스크린리더에게 직접 전달함. id는 그 태그가 승리 없이도 이름이 있고, 의미 자체는 태그 이름이 담당합니다.

클래스 vs ID 차이
구분	ID	클래스
요소 제한	페이지에서 1개만 (유일해야 함)	다양한 요소를 재활용할 수 있음
용도	특정 요소를 콕콕 가리킬 때 (JS가 자주 씀)	스타일을 여러 요소에 반복 적용할 때(CSS가 자주 씀)
JS 조회	getElementById("theme-toggle")	getElementsByClassName/querySelectorAll
<span class="hamburger-bar">가 3개 스타일 전체적으로 같은 클래스라 CSS 한 번에 적용. 반면 id="hamburger"에 그 버튼은 하나뿐입니다.

레이블의 for-id 매칭
label의 for="name"과 input의 id="name"것을 동일하게 반대서 서로 연결함.

< label  for =" name " > 이름 </label> < input type =" text " id = " name " name =" name " / >
 
모바일에서 특정 유틸리티를 클릭하여 입력창에 포커스가 있는 방식으로 연결해 보세요.

3. CSS
Flexbox와 Grid의 차이
플렉스박스	그리드
방향	1차원(가로 또는 세로, 한 줄)	2차원 (가로+세로 동시에 배치/열 콕)
적절한 경우	줄 하나에 요소들을 포함하고/정렬할 때	여러 줄·여러 칸으로 표를 짜듯 배치할 때
크기 결정	분수에 따라 유연하게 남	미리 캔(열/행) 구조를 딱 정해놓고 채움
한 줄로 요약하면: Flex = 한방향으로 최적 조정기, Grid = 쏠(표) 짜기.

우리 프로젝트에서는 위 메뉴를 Flexbox로 짜고, projects, Skills카드를 Grid로 샴

스킬카드 : 카드를 여러 개 동시에 블록으로 배치해야 합니다(모바일 1열 → 데스크톱 3열), 열과 함께 작업할 수 있는 네트워크를 관리하고 네트워크 그리드를 사용합니다.

.skills -groups { display : grid; grid-template-columns :  1 fr ; }
프로젝트 카드 : GitHub API로 몇 가지 프로젝트가 올지 모르는 상황(개수 가변) → auto-fit으로 줄어들게 하기 위해 카드 변형을 자동으로 힘쓰게 함. 이러한 "반응형 카드 그리드"는 Flex로도 억지로 가능하지만 Grid의 auto-fit/minmax 조합은 훨씬 간단하고 신뢰할 수 있습니다

.projects -grid {
   display : grid;
   grid-template-columns :  repeat (auto-fit ,  minmax ( 260 px ,  1 fr ));
}
**참고로 minmax는 minmax(최소, 최대) — 그리드의 각 칸(열) 크기 범위를 대상으로 하는 문의

최소 260px: 칸이 이보다 지면 안니(카드가 찌그러지는 걸 방지)
최대 1fr: 광대한 공간이 있으면 좋겠습니다(fraction)
둘 말고도

block / inline / inline-block: 본체 배치
위치: 원하는 위치에 직접 배치(상대, 절대, 고정, 고정)
float: 옛 방식, 현재는 주 제목을 잘 이해하기 위한 글
요즘의 방식은 잘 안씀

CSS 변수(:root)
css 가변(:root)은 자주 쓰는 값(색상, 덤불, 그림자 등)에 이름 코팅서 한곳에 저장해 두고, 나머지 css전체에서 그 이름으로 꺼내쓰는 기호

: 루트 {
   --color-primary :  # 4f46e5 ;    /* --이름: 값; 형태의 정의 */ 
  --space-md :  1.5 rem ;
}
이러한 식으로 정의하는 것에 CSS가 있습니다.

.btn -primary { background-color :  var ( --color-primary ); }
이런식으로 꺼낼 수 있음

다크모드 변수 ([data-theme="dark"])
동일한 이름에 대해, 다크 모드용 값을 별도의 블록에서 다시 정의합니다.

[ data-theme = "dark" ] {
   --color-bg :  # 0f1015 ;
   --color-bg-alt :  # 17181f ;
   --color-text :  # f2f2f5 ;
}
JS가 <html data-theme="dark">마치 속성만 패드면( main.js:28 ), 이 활동을 하는 CSS 규칙 전체가 자동으로 새 값으로 교체돼서 전체 화면이 한 번에 다크 모드로 바뀜.

반응형 디자인 (모바일 퍼스트 / 768px, 1024px / 부활)
HTML/CSS파일은 하나인데, 정리에 따라 배열이 자동으로 다르게 만드는 것입니다

@media (min-width: 768px) {
 768px이면, 이 중괄호 안의 CSS 규칙을 적용합니다.
}
CSS는 존재한다는 것을 가지고 있습니다 => 부정에 모바일 개념으로 스타일을 짜고, 하위로 커질 때 가치가 있기 때문에 구현함(모바일 퍼스트) 모바일 탄성 메뉴 축소 만듦새

/* ① 기본값 (미디어쿼리 없음 = 모든 화면에 항상 적용되는 "바탕") */
.hamburger { display: flex; }         /* style.css:290 */
.nav-menu  { position: fixed; max-height: 0; overflow: hidden; } /* style.css:324-336 */

/* ② 768px 이상일 때, ①을 덮어씀 */
@media (min-width: 768px) {
  .hamburger { display: none; }
  .nav-menu  { position: static; flex-direction: row; max-height: none; }
}

/* ③ 1024px 이상일 때, 추가로 세부 크기만 더 조정 (레이아웃 구조는 그대로) */
@media (min-width: 1024px) {
  .section-inner { padding: 0 var(--space-lg); }
}
호버/트랜지션/박스섀도우
hover - 마우스가 그 요소 위에 있을 수 있도록 적용되는 상태 선택자 전환 - 값을 축소할 수 있도록 허용함 box-shadow - 요소에 수평 확장 속성, 카드에 적용

심플리
html {
   scroll-behavior : smooth; /* style.css:84 */ 
}
html요소에 이 한 줄만 추가하면, 항해의 앵커 링크( href="#about"등)를 클릭했을 때 순간이동을 촉진하여 스크롤 이동함. JS 없이 CSS만 처리합니다.

스크롤(교차로 관찰자)
class="reveal"이 섹션은 섹션 화면에 20% 이상 is-visible코팅 클래스를 코팅서들이 서서히 하야는 애니메이션을 발동시킴입니다.


// main.js:110-131 const  revealTargets  =  document.querySelectorAll ( '.reveal ' ) ;

constobserver  = new IntersectionObserver ( ( entrys ) => { entries .forEach ( ( entry ) = > { if ( entry .isIntersecting ) { entry .target .classList .add ( ' is -visible' )  ; 관찰자 .unobserve ( entry .target ) ; // 한 번 클러스터 요소는 중지 } } ) ; } , { 임계 값 : 0.2 } // 요소 의 20% 이상 보이면 발동 ) ;  
    
      
        
        
         
      
    
  
     


revealTargets.forEach ( ( target ) = > observer.observe ( target ) ) ;​​​  
IntersectionObserver"이 요소가 화면에 전혀 보이지 않는지"라는 것은 브라우저가 존재하지 않는 기능입니다. 스크롤 이벤트를 직접적으로 부하하는 것보다 성능이 유지됩니다. CSS 내부에는 .reveal(기본 숨김/이동 상태)과 .reveal.is-visible(표시 상태로 전환) 두 클래스로 실제 애니메이션 정의가 있습니다.

4. JS
연기하다
defer 외부 서부로 브라우저가 HTML을 위에서 아래로 읽은 <script>태그를 만나 HTML 읽기를 가져오기 JS 파일을 다운로드+실행한 뒤에 야 나머지 HTML을 전부 읽습니다. 두 가지의 문제가 발생하는 현상:

JS 파일이 크면 동안 화면이 안 그려짐(백지 상태)
펼쳐져 있지 않은 분량의 작은 요소를 querySelector로 부품면 → null (DOM에 아직 남아 있지 않으니까)
defer를 접착면: "이 파일은 다운로드는 지금 배경에서 해두되, 실행은 HTML을 전체적으로 다 읽어 DOM이 완성된 뒤에 서버됩니다."

const / var
JS에서 모두 함께 노력하겠습니다. var는 같은 이름으로 또 선언해도 안 남 → 주장로 ks써도 못 알아챌 수 있음 재미있는 날

DOMContentLoaded
호출은 마지막에 DOMContentLoaded 호출에 서 호출(페이지 열릴 때 호출되는)

DOM
DOM : 브라우저가 HTML을 파싱(해석)하면서 <header>, <h1>, <button>같은 태그 하나를 연합으로 가져가고, 부모-자식 관계를 트리 구조로 묶는 게 DOM입니다.

페이지 로드 → DOM 생성됨( <button id="theme-toggle">이 제공로 존재)
initTheme() 실행 → querySelector로 그를 통해 themeToggle을 확인하기
addEventListener로 "클릭 경고"를 코팅하는 것은 일단 끝남 (대기 상태)
... (사용자가 언제든지 나 버튼을 클릭하세요)
브라우저가 클릭을 감지 → 등록해 버린 콜백 함수를 실행 → applyTheme() 호출 → 화면 색 바뀜
화살표함수

// 기존 방식 function  applyTheme ( theme )  {  root.setAttribute ( ' data-theme' , theme ) ; }  

// 화살표 
const  applyTheme  =  ( theme )  =>  {  root . setAttribute ( '데이터 테마' ,  테마 ) ;  } ;
한줄로고 복귀 가능

템플릿
백틱( `)으로 문자열을 감싸면 내부에 ${표현식}끼워 넣어서 HTML을 생성할 수 있습니다. 따옴표( '...')로 문자열을 연결하는 것보다 훨씬 짧고 읽기 쉬움.

// main.js:167-177 
const  buildProjectCard  =  ( { 이름 , 설명 ,  html_url : url ,  stargazers_count : 별 , 언어 } )  =>  ` 
  <article class="project-card" data-언어=" ${ 언어  ??  '' } "> 
    <h3> ${ 이름 } </h3> 
    <p> ${ 설명  ??  '설명이 없는 것입니다.' } </p> 
<a href=" ${ url } " target="_blank" rel="noopener noreferrer">     GitHub에서 보기 →</a> 
  </article> 
` ;
${}그 안에는 저항하는 것뿐만 아니라 language ?? ''유사하게 작용할 수도 없습니다( ??는 null 독립 반대: null/정의되지 않은 일이 있고 사용할 수 있습니다).

구조분해 배치 (Destructuring)
배열 안의 값을 하나씩 선택하고, 한 번에 모아서 "뽑아내는" 소리, 여러 값을 한 번에 꺼낼 때 코드가 훨씬 더 많습니다.

//구조 분리 없이 
const  repos  =  projectsState . 저장소 ; 
const  activeLanguage  =  projectsState . 활성언어 ;

//구조 분해별로 (main.js:256) 
const  { repos , activeLanguage }  =  projectsState ;
배열 방식 맵/필터
배열(리스트) 전체를 나열할 때 반복문 대신에 쓰는, "한 줄로 배열 변환/추리기" 구문.

map: 배열의 각 요소를 다른 값으로 변환해서, 같은 변형의 새 배열을 만듦.
// [main.js:189] repos(저장소 배열) → 언어만 뽑은 문자열 배열로 "변환" 
repos . map ( ( { 언어 } )  =>  언어 ) 
// [{이름:'A', 언어:'JS'}, {이름:'B', 언어:'Python'}] 
// → ['JS', 'Python']
필터: 배열에서 조건에 맞도록 맞추기 위해 새 배열을 만듦(개수에 대한 수 있음).
// for문으로 하면 
const  result  =  [ ] ; 
for  ( let  i  =  0 ;  i  <  repos . length ;  i ++ )  { 
  if  ( repos [ i ] . language  ===  activeLanguage )  { 
    result . push ( repos [ i ] ) ; 
  } 
}

// 필터로는 한 줄 
const  result  =  repos . 필터 ( ( repo )  =>  repo . 언어  ===  activeLanguage ) ;
forEach: 배열을 그냥 순회만 하고 싶을 때(변환/추리기 없이, 각 요소에 뭔가를 "실행"만 할 때). 새 배열을 반환하지 않습니다.
// [main.js:70] 메뉴 안의 링크(About, Skills...)를 하나씩 순회하며 각각에 클릭 이벤트를 연결 
navMenu . querySelectorAll ( '.nav-link' ) . forEach ( ( 링크 )  =>  { 
  링크 . addEventListener ( '클릭' ,  ( )  =>  { ... } ) ; 
} ) ;
querySelector + addEventListener 퀴즈
3단계로 이해하면: ① 찾다 → ② 저장한다 → ③ "이 일이 일어나서 이 공격을 실행하고 싶다"라고 등록한다

// main.js:22, 45 
const themeToggle  =  document.querySelector  ( ' # theme-toggle' ) ; // ①② 

테마토글 . addEventListener ( 'click' ,  ( )  =>  {                 // ③ 
  //클릭했을 때 실제로 할 일 
} ) ;
querySelector('#id')— CSS 선언문으로 DOM에서 요소를 "찾기"만 함 (그 자체론 아무 일도 안 일어남)
addEventListener('click', 콜백함수)— "이 요소에서 클릭이 발생하면 이 공격을 실행하는 것이 좋습니다"라고 브라우저에 등록되어 해두는 것입니다. 등록된 시점 콜백이 실행되고 나중에 사용자가 실제로 클릭하는 순간이 실행되었습니다.
즉 querySelector, DOM에서 대상을 찾는데, addEventListener는 미래에 일어날 사건에 대한 반응을 미리 등록해 두는 것입니다. 그래서 등록된 코드와 실제 실행 사이에 시간차가 있습니다.

fetch + async/await
fetch는 인터넷을 요청하는 전화입니다. 응답이 언제 올지 알 수 있는 "비동기"로 작동함 — 응답하는 동안 화면이 몬스터와 다른 코드로 계속 돌아옵니다.

// main.js:267-277 
const  fetchRepo  =  async  ( repoName )  =>  { 
  const  response  =  await  fetch ( `https://api.github.com/repos/ ${ GITHUB_USERNAME } / ${ repoName } ` ) ; 
  if  ( ! response . ok )  { 
    throw  new  Error ( `GitHub API 오류( ${ repoName } ): ${ response . status } ` ) ; 
  } 
  return  response . json ( ) ; 
} ;
async— 이 기술 await을 좀 더 할 수 있나요?
await— "이 작업(fetch)이 끝날 때까지 기다려라"는 뜻입니다. await없이는 아직 응답이 없는 상태의 값(Promise)만 잡힘.
try/catch로우스( 네트워크 문제, 403 레이트리밋 등)를 기반으로 ( main.js:284-307 )
상태 → 관리 패턴(로딩/성공/오류/비어 있음)
todo.md 6번 목표("이벤트 →상태 변경 → DOM업데이트")의 핵심 예시. React의 상태-렌더링의 기초가 되는 개념입니다.

// main.js:158-162 
const  projectsState  =  { 
  status : 'loading' ,  // 'loading' | 'success' | 'error' | 'empty' 
  repos : [ ] , 
  activeLanguage : 'all' , 
} ;
흐름:

fetchProjects()호출 → status = 'loading'로 참가 renderProjects()호출 → 스피너표시
가져오기 성공 → status = 'success', repos에 데이터 저장 → renderProjects()→ 카드 그리기
가져오기 실패 → status = 'error'→ renderProjects()→ 순간의 메시지 + 재시도 버튼
renderProjects()( main.js:223-262 )는 구성원 가치 만 projectsState.status보고 무엇이든 먹으려고 결심합니다:

if  ( status  ===  'loading' )  {  스피너  표시 ;  반품 ;  } 
if  ( status  ===  'error' )    {  주스 + 재시도버튼  표시 ;  반품 ;  } 
if  ( status  ===  'empty' )    {  "없습니다"  표시 ;  반품 ;  } 
// 성공면 실제 카드 그리기
상태를 기록해두고, 상태가 싸울 때마다 최선을 다해 호출하여 그 상태에 맞는 화면을 그림. 모드 토글, 낚시 버튼 클릭도 전체적으로 동일한 패턴("상태 → 돔").

일련의 형식
// main.js:326-361 
const  setFieldError  =  ( input ,  message )  =>  { 
  const  field  =  input . closest ( '.form-field' ) ; 
  const  errorEl  =  document . querySelector ( `# ${ input . id } -error` ) ; 
  field . classList . toggle ( 'invalid' ,  Boolean ( message ) ) ; 
  errorEl . textContent  =  message ; 
} ;

const  verifyField  =  ( 입력 )  =>  { 
  const  value  =  입력 . 값 . 다듬기 ( ) ; 
  if  ( input  ===  emailInput  &&  ! EMAIL_PATTERN . test ( value ) ) { setFieldError ( input , '올바른 이메일 형식이 아닙니다.' )  ; 거짓을 반환 ; } // ... setFieldError ( 입력 , '' ) ; 참을 반환 ; } ;
     
     
  
  
   
   
원천징수: 세이 input핑할 때마다 발생하는 발생)을 입력하여 직접 받을 수 있는 자산이 있는 경우 ( main.js:365-367 )
시 검증: submit이벤트에서 event.preventDefault()새로 고침을 막고, 세 필드를 제외하고 제출 validateField로 검사한 뒤 .every(Boolean)로 전체 통과 확인 확인 ( main.js:370-387 )
이메일 형식은 정규표현식( EMAIL_PATTERN)으로 @와 .올바른 위치에 있는지 여부를 검사합니다.
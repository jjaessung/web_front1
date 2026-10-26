'use strict';

// 개인 정보와 API 설정은 이곳에서 수정합니다.
const CONFIG = { github: 'jjaessung' };
const state = { theme: 'light', menuOpen: false, projects: { status: 'loading', repos: [], filter: '전체' }, form: { errors: {}, submitted: false } };
const $ = (selector) => document.querySelector(selector);
const themeButton = $('.theme-toggle');
const menuButton = $('.menu-toggle');
const menu = $('#nav-menu');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const renderTheme = () => {
  document.documentElement.dataset.theme = state.theme;
  const dark = state.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? '라이트 모드 켜기' : '다크 모드 켜기');
  themeButton.textContent = dark ? '☼' : '◐';
};
try { state.theme = localStorage.getItem('portfolio-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch { /* 저장소 접근이 제한되어도 사이트는 작동합니다. */ }
if (!['light', 'dark'].includes(state.theme)) state.theme = 'light';
renderTheme();
themeButton.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  renderTheme();
  try { localStorage.setItem('portfolio-theme', state.theme); } catch { /* 메모리 상태로 유지합니다. */ }
});

const renderMenu = () => {
  menu.classList.toggle('active', state.menuOpen);
  menuButton.setAttribute('aria-expanded', String(state.menuOpen));
  menuButton.setAttribute('aria-label', state.menuOpen ? '메뉴 닫기' : '메뉴 열기');
  menuButton.textContent = state.menuOpen ? '×' : '☰';
};
menuButton.addEventListener('click', () => { state.menuOpen = !state.menuOpen; renderMenu(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.menuOpen) { state.menuOpen = false; renderMenu(); menuButton.focus(); }
});
document.addEventListener('click', (event) => {
  if (state.menuOpen && !$('.nav').contains(event.target)) { state.menuOpen = false; renderMenu(); }
});
window.matchMedia('(min-width: 768px)').addEventListener('change', () => { state.menuOpen = false; renderMenu(); });
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    event.preventDefault();
    state.menuOpen = false;
    renderMenu();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});
const renderScroll = () => {
  $('.header').classList.toggle('scrolled', window.scrollY >= 60);
  $('.back-top').hidden = window.scrollY < 300;
};
window.addEventListener('scroll', renderScroll, { passive: true });
renderScroll();
$('.back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  $('.logo').focus({ preventScroll: true });
});
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) { target.classList.remove('is-pending'); target.classList.add('is-visible'); observer.unobserve(target); }
  }), { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((section) => { section.classList.add('is-pending'); observer.observe(section); });
}

// API 문자열은 HTML로 실행되지 않도록 이스케이프합니다.
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const renderProjects = () => {
  const { status, repos, filter } = state.projects;
  const statusBox = $('#project-status');
  const grid = $('#project-grid');
  grid.setAttribute('aria-busy', String(status === 'loading'));
  grid.innerHTML = '';
  $('#project-filters').innerHTML = '';
  statusBox.hidden = false;
  if (status === 'loading') { statusBox.innerHTML = '<div class="spinner" aria-hidden="true"></div><p>프로젝트를 불러오는 중입니다.</p>'; return; }
  if (status === 'error') {
    statusBox.innerHTML = '<p>프로젝트를 불러올 수 없습니다.</p><p>네트워크 연결 또는 GitHub 요청 제한을 확인해 주세요.</p><button type="button" class="button primary" id="retry-projects">다시 시도 ↻</button>';
    $('#retry-projects').addEventListener('click', loadProjects);
    return;
  }
  if (!repos.length) { statusBox.textContent = '표시할 프로젝트가 없습니다.'; return; }
  const languages = ['전체', ...new Set(repos.map(({ language }) => language || '기타'))];
  $('#project-filters').innerHTML = languages.map((language) => `<button type="button" class="filter-button${filter === language ? ' active' : ''}" aria-pressed="${filter === language}" data-language="${escapeHTML(language)}">${escapeHTML(language)}</button>`).join('');
  const visible = repos.filter(({ language }) => filter === '전체' || (language || '기타') === filter);
  if (!visible.length) { statusBox.textContent = '표시할 프로젝트가 없습니다.'; return; }
  statusBox.hidden = true;
  grid.innerHTML = visible.map(({ name, description, language, stargazers_count, fork, archived }, index) => `
    <article class="project-card">
      <div class="project-top"><span>PROJECT / ${String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">↗</span></div>
      <h3><a href="https://github.com/${encodeURIComponent(CONFIG.github)}/${encodeURIComponent(name)}" target="_blank" rel="noopener noreferrer">${escapeHTML(name)}</a></h3>
      <p>${escapeHTML(description || 'GitHub에서 프로젝트 코드와 작업 내용을 확인해 보세요.')}</p>
      <div class="project-meta"><span>● ${escapeHTML(language || '기타')}${fork ? ' · Fork' : ''}${archived ? ' · 보관됨' : ''}</span><span aria-label="별 ${Number(stargazers_count) || 0}개">☆ ${Number(stargazers_count) || 0}</span></div>
    </article>`).join('');
};
const loadProjects = async () => {
  state.projects.status = 'loading';
  renderProjects();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    // 페이지당 100개씩, 다음 페이지가 없을 때까지 공개 저장소를 수집합니다.
    const repos = [];
    let page = 1;
    let hasNext = true;
    while (hasNext) {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(CONFIG.github)}/repos?sort=updated&per_page=100&page=${page}`, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected response');
      repos.push(...data);
      hasNext = /rel="next"/.test(response.headers.get('Link') || '');
      page += 1;
    }
    state.projects.repos = repos;
    state.projects.status = 'success';
  } catch { state.projects.status = 'error'; }
  finally { window.clearTimeout(timeout); renderProjects(); }
};
$('#project-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-language]');
  if (!button) return;
  state.projects.filter = button.dataset.language;
  renderProjects();
  Array.from($('#project-filters').querySelectorAll('button')).find((item) => item.dataset.language === state.projects.filter)?.focus();
});

const form = $('#contact-form');
const validate = (field) => {
  if (!field.value.trim()) return { name: '이름을 입력해 주세요.', email: '이메일을 입력해 주세요.', message: '메시지를 입력해 주세요.' }[field.name];
  if (field.name === 'email' && (field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) return '올바른 이메일 주소를 입력해 주세요.';
  return '';
};
const renderForm = () => {
  ['name', 'email', 'message'].forEach((name) => {
    const error = state.form.errors[name] || '';
    $(`#${name}-error`).textContent = error;
    $(`#${name}`).setAttribute('aria-invalid', String(Boolean(error)));
  });
  $('#form-status').textContent = state.form.submitted ? '입력 확인이 완료되었습니다. 메시지는 전송되지 않았습니다. 실제 문의는 이메일 링크를 이용해 주세요.' : '';
};
form.addEventListener('input', (event) => {
  if (!['name', 'email', 'message'].includes(event.target.name)) return;
  state.form.submitted = false;
  state.form.errors[event.target.name] = validate(event.target);
  renderForm();
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  ['name', 'email', 'message'].forEach((name) => { state.form.errors[name] = validate($(`#${name}`)); });
  state.form.submitted = !Object.values(state.form.errors).some(Boolean);
  renderForm();
  const firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (firstInvalid) firstInvalid.focus();
});
$('#year').textContent = new Date().getFullYear();
loadProjects();

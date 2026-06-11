// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 10);
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  mobileToggle.classList.toggle('active');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    mobileToggle.classList.remove('active');
  });
});

// Scroll animation (Intersection Observer)
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-up class to animatable elements
const animTargets = [
  { sel: '.about__card', cls: 'fade-up', stagger: 0.1 },
  { sel: '.coach-card', cls: 'fade-up', stagger: 0.08 },
  { sel: '.price-card', cls: 'scale-up', stagger: 0.06 },
  { sel: '.guarantee__box', cls: 'fade-up', stagger: 0 },
  { sel: '.process__step', cls: 'fade-up', stagger: 0.15 },
  { sel: '.guide__card', cls: 'fade-up', stagger: 0.1 },
  { sel: '.contact__box', cls: 'scale-up', stagger: 0 },
  { sel: '.board__controls', cls: 'fade-in', stagger: 0 },
  { sel: '.board__list', cls: 'fade-up', stagger: 0 },
];

animTargets.forEach(({ sel, cls, stagger }) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add(cls);
    el.style.transitionDelay = `${i * stagger}s`;
    observer.observe(el);
  });
});

// Animate section labels and titles
document.querySelectorAll('.section__label, .section__title').forEach(el => {
  observer.observe(el);
});

// Counter animation for hero stats
function animateCounter(el, target, suffix) {
  const duration = 1500;
  const start = performance.now();
  const isFloat = String(target).includes('.');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat
      ? (target * eased).toFixed(1)
      : Math.floor(target * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.classList.add('counted');
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.hero__stat-number');
      nums.forEach(n => {
        const text = n.textContent.trim();
        if (text.includes('+')) {
          animateCounter(n, parseInt(text), '+');
        } else if (text.includes('%')) {
          animateCounter(n, parseInt(text), '%');
        } else if (text.includes('.')) {
          animateCounter(n, parseFloat(text), '');
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero__stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== Board =====
(function() {
  const tiers = ['아이언', '브론즈', '실버', '골드', '플래티넘', '에메랄드', '다이아몬드', '마스터', '그랜드마스터', '챌린저'];
  const divisions = ['4', '3', '2', '1'];
  const champions = ['야스오', '제드', '리신', '카이사', '징크스', '럭스', '쓰레쉬', '블리츠크랭크', '아리', '카타리나', '르블랑', '이렐리아', '피오라', '갱플랭크', '트위스티드 페이트', '빅토르', '아지르', '오리아나', '신드라', '요네'];
  const agents = ['기사님 A', '기사님 B', '기사님 C', '기사님 D', '기사님 E'];
  const templates = [
    (from, to) => `${from} → ${to} 승급 완료`,
    (from, to) => `[${to} 달성] ${from}에서 작업 완료`,
    (from, to) => `${from} → ${to} 부스팅 완료 (${champions[Math.floor(Math.random()*champions.length)]} 주챔 사용)`,
    (from, to) => `${to} 승급 성공! (${Math.floor(Math.random()*5)+7}승 ${Math.floor(Math.random()*3)}패)`,
    (from, to) => `[작업 완료] ${from} → ${to} (${agents[Math.floor(Math.random()*agents.length)]} 담당)`,
    (from, to) => `${from} 탈출 → ${to} 안착 완료`,
    (from, to) => `${to} 프로모션 통과! 승률 ${Math.floor(Math.random()*16)+80}%`,
    (from, to) => `[인증] ${from} → ${to} ${Math.floor(Math.random()*3)+1}일 만에 완료`,
  ];

  function randTierPair() {
    const fromIdx = Math.floor(Math.random() * 7);
    const toIdx = fromIdx + 1 + Math.floor(Math.random() * Math.min(2, 9 - fromIdx));
    const fromDiv = divisions[Math.floor(Math.random() * 4)];
    const toDiv = divisions[Math.floor(Math.random() * 4)];
    const from = fromIdx < 7 ? `${tiers[fromIdx]} ${fromDiv}` : tiers[fromIdx];
    const to = toIdx < 7 ? `${tiers[toIdx]} ${toDiv}` : tiers[toIdx];
    return [from, to];
  }

  function randDate(i) {
    const base = new Date(2026, 5, 11);
    base.setDate(base.getDate() - Math.floor(i * 0.5 + Math.random() * 2));
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    return `${base.getFullYear()}.${m}.${d}`;
  }

  const posts = [];
  for (let i = 0; i < 327; i++) {
    const [from, to] = randTierPair();
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    const isProgress = i < 5;
    posts.push({
      num: 327 - i,
      title: isProgress ? `[진행중] ${from} → ${to} 작업 중...` : tpl(from, to),
      date: randDate(i),
      status: isProgress ? 'progress' : 'complete'
    });
  }

  const PER_PAGE = 15;
  let currentPage = 1;
  let filtered = posts;

  const listEl = document.getElementById('boardList');
  const pagEl = document.getElementById('boardPagination');
  const countEl = document.querySelector('.board__count');
  const searchEl = document.getElementById('boardSearch');

  function render() {
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const start = (currentPage - 1) * PER_PAGE;
    const page = filtered.slice(start, start + PER_PAGE);

    countEl.textContent = `총 ${filtered.length}건`;

    listEl.innerHTML = page.map(p => `
      <div class="board__item">
        <span class="board__item-num">${p.num}</span>
        <span class="board__item-badge board__item-badge--${p.status}">${p.status === 'complete' ? '완료' : '진행중'}</span>
        <span class="board__item-title">${p.title}</span>
        <span class="board__item-date">${p.date}</span>
      </div>
    `).join('');

    let pagHTML = '';
    const maxShow = 5;
    let startP = Math.max(1, currentPage - Math.floor(maxShow / 2));
    let endP = Math.min(totalPages, startP + maxShow - 1);
    if (endP - startP < maxShow - 1) startP = Math.max(1, endP - maxShow + 1);

    if (currentPage > 1) pagHTML += `<button class="board__page-btn" data-page="${currentPage-1}">&laquo;</button>`;
    for (let i = startP; i <= endP; i++) {
      pagHTML += `<button class="board__page-btn ${i===currentPage?'board__page-btn--active':''}" data-page="${i}">${i}</button>`;
    }
    if (currentPage < totalPages) pagHTML += `<button class="board__page-btn" data-page="${currentPage+1}">&raquo;</button>`;

    pagEl.innerHTML = pagHTML;
    pagEl.querySelectorAll('.board__page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        render();
        document.getElementById('board').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  searchEl.addEventListener('input', () => {
    const q = searchEl.value.trim().toLowerCase();
    filtered = q ? posts.filter(p => p.title.toLowerCase().includes(q)) : posts;
    currentPage = 1;
    render();
  });

  render();
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

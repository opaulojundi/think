/**
 * main.js – Inicializações principais
 * THINK Corporation
 *
 * Responsabilidades:
 *  - Carregar header.html e footer.html via fetch (estrutura modular)
 *  - Inicializar AOS (Animate On Scroll)
 *  - Partículas leves no hero (Canvas 2D nativo)
 *  - Efeito de scroll na navbar
 *  - Destaque de link ativo na navbar via Intersection Observer
 *  - Smooth scroll para âncoras
 *  - Lazy loading de imagens
 */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────
     1. CARGA MODULAR DE HEADER E FOOTER
  ──────────────────────────────────────────────── */
  async function loadComponent(placeholderId, filePath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
      const res  = await fetch(filePath);
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const html = await res.text();
      placeholder.innerHTML = html;

      // Re-executa scripts inline (ex.: footer year)
      placeholder.querySelectorAll('script').forEach((oldScript) => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      });

      // Após injetar o header, aplica tema salvo ao ícone
      if (placeholderId === 'header-placeholder' && window.ThinkTheme) {
        window.ThinkTheme.apply(window.ThinkTheme.getTheme());
      }
    } catch (err) {
      console.warn(`[THINK] Não foi possível carregar ${filePath}:`, err.message);
    }
  }

  /* ────────────────────────────────────────────────
     2. SCROLL DA NAVBAR
  ──────────────────────────────────────────────── */
  function initNavbarScroll() {
    const handleScroll = () => {
      const navbar = document.querySelector('.think-navbar');
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ────────────────────────────────────────────────
     3. LINK ATIVO VIA INTERSECTION OBSERVER
  ──────────────────────────────────────────────── */
  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Remove active de todos
            document.querySelectorAll('.think-nav-link').forEach((l) => {
              l.classList.remove('active');
            });
            // Adiciona ao link correspondente
            const id = entry.target.id;
            const link = document.querySelector(`.think-nav-link[href="#${id}"]`);
            if (link) link.classList.add('active');
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ────────────────────────────────────────────────
     4. SMOOTH SCROLL + FECHAR MENU MOBILE
  ──────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.querySelector('.think-navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top, behavior: 'smooth' });

      // Fecha menu mobile se aberto
      const navCollapse = document.getElementById('mainNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        bsCollapse?.hide();
      }
    });
  }

  /* ────────────────────────────────────────────────
     5. PARTÍCULAS NO HERO (Canvas 2D nativo)
     Leves e performáticas — sem biblioteca externa
  ──────────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles, animId;

    // Quantidade reduzida para performance em mobile
    const COUNT = window.innerWidth < 768 ? 40 : 80;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    Math.random() * 1.5 + .3,
        vx:   (Math.random() - .5) * .4,
        vy:   (Math.random() - .5) * .4,
        life: Math.random(),       // fase inicial aleatória
        speed: Math.random() * .01 + .005,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, createParticle);
    }

    function getColor() {
      // Lê a variável de cor definida no tema
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      return theme === 'dark' ? '255,255,255' : '0,0,0';
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const color = getColor();

      particles.forEach((p) => {
        p.life += p.speed;
        const alpha = Math.abs(Math.sin(p.life)) * .5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        // Rebote nas bordas
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      // Linhas de conexão entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * .15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    // Pausa quando a aba fica oculta (performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });

    // Reseta no resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animId);
        init();
        draw();
      }, 300);
    });

    init();
    draw();
  }

  /* ────────────────────────────────────────────────
     6. AOS (Animate On Scroll)
  ──────────────────────────────────────────────── */
  function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration:   700,
      easing:     'ease-out-cubic',
      once:       true,
      offset:     80,
      mirror:     false,
      anchorPlacement: 'top-bottom',
    });
  }

  /* ────────────────────────────────────────────────
     7. LAZY LOADING DE IMAGENS
  ──────────────────────────────────────────────── */
  function initLazyLoad() {
    // Aplica loading="lazy" a todas as imagens sem ele
    document.querySelectorAll('img:not([loading])').forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });
  }

  /* ────────────────────────────────────────────────
     8. BOOTSTRAP TOOLTIPS
  ──────────────────────────────────────────────── */
  function initTooltips() {
    if (typeof bootstrap === 'undefined') return;
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      bootstrap.Tooltip.getOrCreateInstance(el);
    });
  }

  /* ────────────────────────────────────────────────
     BOOT – executado ao carregar o DOM
  ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async function () {
    // Carrega componentes modulares
    await loadComponent('header-placeholder', 'components/header.html');
    await loadComponent('footer-placeholder', 'components/footer.html');

    // Inicializa funcionalidades
    initNavbarScroll();
    initActiveLinks();
    initSmoothScroll();
    initParticles();
    initAOS();
    initLazyLoad();
    initTooltips();

    // Aplica tema salvo no ícone agora que o header foi injetado
    if (window.ThinkTheme) {
      window.ThinkTheme.apply(window.ThinkTheme.getTheme());
    }

    console.info('[THINK Corporation] Site inicializado com sucesso. 🚀');
  });

})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registrado com sucesso:', reg.scope))
      .catch(err => console.error('Falha ao registrar o Service Worker:', err));
  });
}

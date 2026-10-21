/* Nasty ENRG microsite interactions (vanilla JS) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav */
  var burger = $('.burger'), menu = $('#menu');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var o = !menu.classList.contains('open');
    menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', String(o));
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* scroll: progress, active link, hero parallax */
  var bar = $('.progress'), heroImg = $('.hero-photo img');
  var links = $$('a', menu), secs = links.map(function (a) { return $(a.getAttribute('href')); });
  var tick = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (heroImg && !reduce && y < innerHeight) heroImg.style.transform = 'translateY(' + (y * 0.12) + 'px) scale(1.06)';
    var mark = y + innerHeight * 0.4, cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= mark) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
    tick = false;
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* reveal */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (r) { io.observe(r); });
  } else rev.forEach(function (r) { r.classList.add('in-view'); });

  /* sneaker-run video: play only while visible, sound toggle */
  $$('.o-video, .i-vid').forEach(function (box) {
    var vid = $('video', box), snd = $('.vid-sound', box);
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause(); });
      }, { threshold: 0.4 }).observe(vid);
    }
    snd.addEventListener('click', function () {
      vid.muted = !vid.muted;
      snd.setAttribute('aria-pressed', String(!vid.muted));
      snd.textContent = vid.muted ? 'Sound off' : 'Sound on';
      snd.setAttribute('aria-label', vid.muted ? 'Turn sound on' : 'Turn sound off');
      if (vid.paused) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
    });
  });

  /* film: click to play inline with controls */
  var film = $('.film');
  if (film) {
    var fv = $('video', film), fb = $('.film-play', film);
    fb.addEventListener('click', function () { fv.controls = true; film.classList.add('playing'); fv.play(); });
    fv.addEventListener('ended', function () { film.classList.remove('playing'); fv.controls = false; fv.load(); });
  }

  /* toast for placeholder links */
  var toast = $('.toast'), tt;
  $$('[data-soon]').forEach(function (a) {
    if (a.getAttribute('href') !== '#') return;
    a.addEventListener('click', function (e) {
      e.preventDefault(); toast.textContent = a.getAttribute('data-soon');
      toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2200);
    });
  });

  /* lightbox (all .zoom images, one set) */
  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button class="lb-btn lb-close" type="button" aria-label="Close">&times;</button><button class="lb-btn lb-prev" type="button" aria-label="Previous">&lsaquo;</button><img alt=""><button class="lb-btn lb-next" type="button" aria-label="Next">&rsaquo;</button><p class="lb-cap"></p>';
  document.body.appendChild(lb);
  var img = $('img', lb), cap = $('.lb-cap', lb), set = [], idx = 0, last = null;
  function show(i) {
    idx = (i + set.length) % set.length; var im = set[idx];
    img.src = im.currentSrc || im.src; img.alt = im.alt;
    cap.textContent = (im.getAttribute('data-cap') || '') + '  ' + (idx + 1) + '/' + set.length;
  }
  function open(im) {
    last = document.activeElement;
    set = $$('img.zoom', im.closest('section')).filter(function (x) { return x.offsetParent !== null; });
    show(Math.max(0, set.indexOf(im)));
    lb.classList.add('open'); document.body.classList.add('no-scroll'); $('.lb-close', lb).focus();
  }
  function close() { lb.classList.remove('open'); document.body.classList.remove('no-scroll'); if (last && last.focus) last.focus(); }
  document.addEventListener('click', function (e) { var im = e.target.closest && e.target.closest('img.zoom'); if (im) open(im); });
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
  $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1);
  });
  $$('img.zoom').forEach(function (im) {
    im.tabIndex = 0; im.setAttribute('role', 'button');
    im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(im); } });
  });
})();

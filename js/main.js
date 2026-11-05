(function () {
  'use strict';
  var EMAIL = 'nick.tersigni92@gmail.com';

  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  function closeMenu() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Safe in-page anchors: only scroll if the target exists
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    var target = id.length > 1 ? document.querySelector(id) : null;
    if (id === '#' || id === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    } else {
      e.preventDefault();
    }
  });

  // Active nav link on scroll
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });

    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.row,.timeline li,.why__item,.about__media,.about__text,.contact')
      .forEach(function (el) { el.classList.add('reveal'); rev.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Contact form: opens the visitor's email app with the message pre-filled
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var name = f.name.value.trim(), email = f.email.value.trim(),
        subject = f.subject.value.trim(), message = f.message.value.trim();
    var ok = true;
    [f.name, f.email, f.message].forEach(function (el) { el.classList.remove('invalid'); });
    if (!name) { f.name.classList.add('invalid'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { f.email.classList.add('invalid'); ok = false; }
    if (!message) { f.message.classList.add('invalid'); ok = false; }
    if (!ok) {
      status.className = 'form__status err';
      status.textContent = 'Please fill in your name, a valid email and a message.';
      return;
    }
    var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    var href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject || 'Website inquiry from ' + name) +
               '&body=' + encodeURIComponent(body);
    status.className = 'form__status ok';
    status.innerHTML = 'Thank you! Your email app should open now. If it does not, write to us at ' +
      '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
    window.location.href = href;
    form.reset();
  });
})();

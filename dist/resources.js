(function () {
  'use strict';

  function toggleLang() {
    const isZh = document.body.classList.toggle('zh');
    localStorage.setItem('jow_lang', isZh ? 'zh' : 'en');
    document.documentElement.lang = isZh ? 'zh-CN' : 'en';
    document.getElementById('langToggle').textContent = isZh ? '中文' : 'EN';
  }

  function printPage() { window.print(); }

  const ACTIONS = {
    'toggle-lang': toggleLang,
    'print': printPage,
  };

  document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem('jow_lang');
    const isZh = saved !== 'en';
    document.body.classList.toggle('zh', isZh);
    document.documentElement.lang = isZh ? 'zh-CN' : 'en';
    document.getElementById('langToggle').textContent = isZh ? '中文' : 'EN';

    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const fn = ACTIONS[target.dataset.action];
      if (fn) { e.stopPropagation(); fn(); }
    });

    try {
      new QRCode(document.getElementById('qr-top'), {
        text: 'https://job-offers-workshop.pages.dev',
        width: 100,
        height: 100,
        colorDark: '#7c3aed',
        colorLight: '#ffffff'
      });
    } catch (e) {
      const el = document.getElementById('qr-top');
      if (el) el.textContent = 'job-offers-workshop.pages.dev';
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  });
})();
